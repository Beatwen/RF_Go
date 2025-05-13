using Makaretu.Dns;
using RF_Go.Services.DeviceHandlers;
using System.Diagnostics;
using System.Linq;
using System.Net;
using RF_Go.Models;
using RF_Go.Services.Commands;
using RF_Go.ViewModels;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;


namespace RF_Go.Services.NetworkProtocols
{
    public class DiscoveryService
    {
        private readonly MulticastService _multicastService;
        private readonly ServiceDiscovery _serviceDiscovery;
        private readonly List<IDeviceHandler> _handlers;
        private readonly DevicesViewModel _devicesViewModel;
        private readonly Timer _syncTimer;
        public readonly List<DeviceDiscoveredEventArgs> DiscoveredDevices;
        public event EventHandler<DeviceDiscoveredEventArgs> DeviceDiscovered;
        private UdpClient _g4UdpClient;
        private CancellationTokenSource _g4DiscoveryCts;

        public DiscoveryService(IEnumerable<IDeviceHandler> handlers, DevicesViewModel devicesViewModel)
        {
            _handlers = handlers.ToList();
            _multicastService = new MulticastService();
            _serviceDiscovery = new ServiceDiscovery(_multicastService);
            _serviceDiscovery.ServiceDiscovered += OnServiceDiscovered;
            _serviceDiscovery.ServiceInstanceDiscovered += OnServiceInstanceDiscovered;
            _devicesViewModel = devicesViewModel ?? throw new ArgumentNullException(nameof(devicesViewModel));
            DiscoveredDevices = new List<DeviceDiscoveredEventArgs>();

            _syncTimer = new Timer(SyncTimerCallback, null, TimeSpan.Zero, TimeSpan.FromSeconds(30));
        }

        private async void SyncTimerCallback(object state)
        {
            await CheckDeviceSync(state);
        }

        public void StartDiscovery()
        {
            DiscoveredDevices.Clear();
            _multicastService.Start();
            _serviceDiscovery.QueryServiceInstances("_ssc._udp.local");
            _serviceDiscovery.QueryServiceInstances("_ewd._http.local");
            TriggerSennheiserDiscovery();
            
            // Exécuter la découverte G4 dans un thread séparé avec un timeout strict
            Task.Run(async () => {
                try {
                    using (var timeoutCts = new CancellationTokenSource(10000)) // 10 sec
                    {
                        await TriggerSennheiserG4DiscoveryAsync(timeoutCts.Token);
                    }
                }
                catch (Exception ex) {
                    Debug.WriteLine($"G4 discovery safely aborted: {ex.Message}");
                }
            });
        }

        private void OnServiceDiscovered(object sender, DomainName serviceName)
        {
            Debug.WriteLine($"Service discovered: {serviceName}");
            _serviceDiscovery.QueryServiceInstances(serviceName);
        }

        private async void OnServiceInstanceDiscovered(object sender, ServiceInstanceDiscoveryEventArgs e)
        {
            Debug.WriteLine($"Service instance discovered: {e.ServiceInstanceName}");
            var addressIPV4 = e.RemoteEndPoint.Address;


            if (addressIPV4 == null)
            {
                Debug.WriteLine("No IPv4 address found in answers. Trying additional records.");
                var srvRecord = e.Message.AdditionalRecords
                    .OfType<SRVRecord>()
                    .FirstOrDefault();

                if (srvRecord != null)
                {
                    try
                    {
                        var resolvedAddresses = await Dns.GetHostAddressesAsync(srvRecord.Target.ToString());
                        addressIPV4 = resolvedAddresses.FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork); // Première IPv4
                        Debug.WriteLine($"Resolved address: {addressIPV4}");
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine($"Failed to resolve hostname {srvRecord.Target}: {ex.Message}");
                    }
                }
            }

            var deviceInfo = new DeviceDiscoveredEventArgs
            {
                Name = e.ServiceInstanceName.Labels[0],
                Brand = "Unknown",
                IPAddress = addressIPV4 != null ? addressIPV4.ToString() : null // Une seule IP
            };

            // Determine the best handler for this service
            var serviceName = e.ServiceInstanceName.ToString();
            bool handlerFound = false;
            
            foreach (var handler in _handlers)
            {
                if (handler.CanHandle(serviceName))
                {
                    // Set the brand first so we can use it for finding the appropriate handler
                    deviceInfo.Brand = handler.Brand;
                    
                    // Now find the best handler (in case there are multiple handlers for the same brand)
                    var bestHandler = handler;
                    if (serviceName.Contains("G4") || serviceName.Contains("IEM"))
                    {
                        // Try to get a G4-specific handler if this is a G4 device
                        var g4Handler = _handlers.FirstOrDefault(h => 
                            h.Brand == handler.Brand && 
                            h.GetType().Name.Contains("G4") && 
                            h.CanHandle(serviceName));
                            
                        if (g4Handler != null)
                        {
                            bestHandler = g4Handler;
                            Debug.WriteLine($"Using specialized G4 handler for {serviceName}");
                        }
                    }
                    
                    await bestHandler.HandleDevice(deviceInfo);
                    handlerFound = true;
                    break;
                }
            }
            
            if (!handlerFound)
            {
                Debug.WriteLine($"No handler found for service: {serviceName}");
            }

            if (!string.IsNullOrEmpty(deviceInfo.SerialNumber))
            {
                var existingDevice = _devicesViewModel.Devices.FirstOrDefault(d => d.SerialNumber == deviceInfo.SerialNumber);
                if (existingDevice != null)
                {
                    deviceInfo.IsSynced = true;
                }
                else
                {
                    deviceInfo.IsSynced = false;
                }
            }

            if (string.IsNullOrEmpty(deviceInfo.IPAddress))
            {
                Debug.WriteLine($"No IP addresses found for the device: {deviceInfo.Name}");
            }

            var discoveredDevicesCopy = DiscoveredDevices.ToList(); // Créez une copie de la collection
            if (!discoveredDevicesCopy.Any(d => d.Name == deviceInfo.Name))
            {
                DiscoveredDevices.Add(deviceInfo);
                Debug.WriteLine($"Device added to discovered devices: {deviceInfo.Name}");
            }
            DeviceDiscovered?.Invoke(this, deviceInfo);
        }

        public void TriggerSennheiserDiscovery()
        {
            Debug.WriteLine("Triggering standard Sennheiser discovery via mDNS.");
            // Trigger discovery for standard Sennheiser devices via mDNS
            var query = new Message
            {
                Questions = {
                                        new Question
                                        {
                                            Name = "_ssc._udp.local",
                                            Type = DnsType.PTR
                                        }
                                    }
            };
            _multicastService.SendQuery(query);
            // Ne pas appeler TriggerSennheiserG4Discovery() ici, c'est un processus séparé
        }
        
        private async Task TriggerSennheiserG4DiscoveryAsync(CancellationToken cancellationToken)
        {
            Debug.WriteLine("Triggering Sennheiser G4 IEM discovery via proprietary protocol.");
            try
            {
                _g4DiscoveryCts?.Cancel();
                _g4DiscoveryCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                
                _g4UdpClient?.Dispose();
                _g4UdpClient = new UdpClient();
                _g4UdpClient.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                _g4UdpClient.MulticastLoopback = true; // Let's receive our own packets for debugging
                _g4UdpClient.EnableBroadcast = true;
                
                try {
                    // Bind to the G4 discovery port
                    _g4UdpClient.Client.Bind(new IPEndPoint(IPAddress.Any, 8133));
                    _g4UdpClient.JoinMulticastGroup(IPAddress.Parse("224.0.0.251"));
                    Debug.WriteLine("Successfully joined multicast group 224.0.0.251");
                    
                    // Start listening for G4 device responses
                    var listenTask = ListenForG4DevicesAsync(_g4DiscoveryCts.Token);
                    
                    // Send the discovery trigger - first attempt
                    await SendG4DiscoveryTrigger();
                    Debug.WriteLine("Sent first G4 discovery packet, waiting for responses...");
                    await Task.Delay(2000, cancellationToken); // Wait 2 seconds
                    
                    // Send a second discovery trigger
                    await SendG4DiscoveryTrigger();
                    Debug.WriteLine("Sent second G4 discovery packet, waiting for responses...");
                    await Task.Delay(5000, cancellationToken); // Wait longer (5 seconds) for all responses
                    
                    Debug.WriteLine("G4 discovery cycle completed");
                }
                catch (OperationCanceledException) {
                    Debug.WriteLine("G4 discovery operation canceled");
                }
                catch (Exception ex) {
                    Debug.WriteLine($"G4 discovery encountered an error but will continue: {ex.Message}");
                }
                finally {
                    // Clean up
                    try {
                        // Leave the multicast group
                        if (_g4UdpClient != null)
                        {
                            try { _g4UdpClient.DropMulticastGroup(IPAddress.Parse("224.0.0.251")); } catch { }
                            _g4UdpClient.Close();
                        }
                    } 
                    catch (Exception ex) {
                        Debug.WriteLine($"Error during G4 client cleanup: {ex.Message}");
                    }
                }
            }
            catch (OperationCanceledException)
            {
                Debug.WriteLine("Sennheiser G4 discovery cancelled.");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during Sennheiser G4 discovery: {ex.Message}");
            }
        }
        
        private async Task SendG4DiscoveryTrigger()
        {
            try
            {
                string commandStr = "[servicecommand]devinfo\r\n";
                List<byte> packet = new List<byte>();
                
                // Header bytes from the hex dump
                // 12 07 06 20 00 00 19 00
                packet.Add(0x12);
                packet.Add(0x07);
                packet.Add(0x06);
                packet.Add(0x20);
                packet.Add(0x00);
                packet.Add(0x00);
                packet.Add(0x19);
                packet.Add(0x00);
                
                packet.AddRange(Encoding.ASCII.GetBytes(commandStr));
                
                // Pad the packet to 1035 bytes (the exact size shown in dump)
                int remainingBytes = 1035 - packet.Count;
                for (int i = 0; i < remainingBytes; i++)
                {
                    packet.Add(0x00);
                }
                
                // Add the specific trailer seen in the hex dump
                // Ensure the last 3 bytes are 0x01 0x01 0x01
                if (packet.Count >= 3)
                {
                    packet[^3] = 0x01;
                    packet[^2] = 0x01;
                    packet[^1] = 0x01;
                }
                
                Debug.WriteLine($"Sending G4 discovery packet to 224.0.0.251:8133, size: {packet.Count} bytes");
                await _g4UdpClient.SendAsync(packet.ToArray(), packet.Count, new IPEndPoint(IPAddress.Parse("224.0.0.251"), 8133));
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error sending G4 discovery trigger: {ex.Message}");
            }
        }
        
        private async Task ListenForG4DevicesAsync(CancellationToken cancellationToken)
        {
            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    var result = await _g4UdpClient.ReceiveAsync(cancellationToken);
                    string dataAscii = Encoding.ASCII.GetString(result.Buffer);
                    
                    // Skip our own discovery packet (the one we sent)
                    if (dataAscii.Contains("[servicecommand]devinfo"))
                    {
                        Debug.WriteLine("Ignoring our own discovery packet");
                        continue;
                    }

                    // Only process packets that look like G4 responses
                    if (dataAscii.Contains("Model=") && 
                       (dataAscii.Contains("SR-IEMG4") || dataAscii.Contains("G4")))
                    {
                        Debug.WriteLine($"G4 device response from {result.RemoteEndPoint}: {dataAscii}");
                        
                        var deviceInfo = ParseG4DeviceInfo(dataAscii, result.RemoteEndPoint.Address);
                        if (deviceInfo != null)
                        {
                            var discoveredDevicesCopy = DiscoveredDevices.ToList();
                            if (!discoveredDevicesCopy.Any(d => d.Name == deviceInfo.Name))
                            {
                                DiscoveredDevices.Add(deviceInfo);
                                DeviceDiscovered?.Invoke(this, deviceInfo);
                            }
                        }
                    }
                    else
                    {
                        Debug.WriteLine($"Ignoring packet that doesn't match G4 pattern from {result.RemoteEndPoint}");
                    }
                }
            }
            catch (OperationCanceledException)
            {
                // Operation was cancelled, no need to log
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error while listening for G4 devices: {ex.Message}");
            }
        }
        
        private DeviceDiscoveredEventArgs ParseG4DeviceInfo(string data, IPAddress remoteAddress)
        {
            try
            {
                Debug.WriteLine($"Parsing G4 data: {data}");
                
                // First, check if this is truly a G4 device by looking for G4-specific patterns
                if (!(data.Contains("SR-IEMG4") || data.Contains("G4 IEM") || 
                      data.Contains("Model=") && data.Contains("ID=") && data.Contains("IPA=")))
                {
                    Debug.WriteLine("Data not matching G4 device pattern, skipping");
                    return null;
                }
                
                // Extract model, ID and IP using string manipulation
                string model = "";
                string id = "";
                string ipa = "";
                
                // Based on the hex dump format:
                // "Model=SR-IEMG4   ID=001B66A6C99A   IPA=192.168.0.41"
                int modelIndex = data.IndexOf("Model=");
                int idIndex = data.IndexOf("ID=");
                int ipaIndex = data.IndexOf("IPA=");
                
                if (modelIndex >= 0 && idIndex >= 0 && ipaIndex >= 0)
                {
                    // Extract model between "Model=" and "ID="
                    model = data.Substring(modelIndex + 6, idIndex - (modelIndex + 6)).Trim();
                    
                    // Extract ID between "ID=" and "IPA="
                    id = data.Substring(idIndex + 3, ipaIndex - (idIndex + 3)).Trim();
                    
                    // Extract IP address after "IPA="
                    ipa = data.Substring(ipaIndex + 4).Trim();
                    
                    // Clean up IP address (remove trailing nulls/control chars)
                    int nullIndex = ipa.IndexOf('\0');
                    if (nullIndex > 0)
                    {
                        ipa = ipa.Substring(0, nullIndex);
                    }
                    
                    // Ensure we got a valid IP, otherwise use the sender's IP
                    if (string.IsNullOrEmpty(ipa) || !IPAddress.TryParse(ipa, out _))
                    {
                        ipa = remoteAddress.ToString();
                    }
                    
                    Debug.WriteLine($"Extracted device info: Model={model}, ID={id}, IPA={ipa}");
                }
                else
                {
                    // Fallback to previous method
                    model = ExtractValue(data, "Model=");
                    id = ExtractValue(data, "ID=");
                    ipa = ExtractValue(data, "IPA=");
                    
                    // If IP parsing failed, use the remote address
                    if (string.IsNullOrEmpty(ipa) || !IPAddress.TryParse(ipa, out _))
                    {
                        ipa = remoteAddress.ToString();
                    }
                }
                
                // Check if we have a valid model and ID
                if (string.IsNullOrEmpty(model) || string.IsNullOrEmpty(id))
                {
                    Debug.WriteLine("Failed to extract model or ID");
                    return null;
                }
                
                // Double-check this is a G4 model
                if (!model.Contains("G4") && !model.Contains("IEM"))
                {
                    Debug.WriteLine($"Model {model} doesn't appear to be a G4 device, skipping");
                    return null;
                }
                
                // Create device info object
                var deviceInfo = new DeviceDiscoveredEventArgs
                {
                    Name = model.Trim() + " " + id.Trim(),
                    Brand = "Sennheiser",
                    Type = model.Trim(),
                    SerialNumber = id.Trim(),
                    IPAddress = ipa.Trim(),
                };
                
                // Get appropriate handler for this device type
                var handler = GetAppropriateHandlerForType(deviceInfo.Brand, deviceInfo.Type);
                if (handler != null && handler.CanHandle(deviceInfo.Type))
                {
                    handler.HandleDevice(deviceInfo).Wait();
                    Debug.WriteLine($"G4 device handled by {handler.GetType().Name}");
                }
                else
                {
                    Debug.WriteLine($"No suitable handler found for G4 device {deviceInfo.Type}");
                }
                
                return deviceInfo;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error parsing G4 device info: {ex.Message}");
                return null;
            }
        }
        
        private string ExtractValue(string data, string prefix)
        {
            int startIndex = data.IndexOf(prefix);
            if (startIndex < 0)
                return null;
                
            startIndex += prefix.Length;
            
            int endIndex = data.IndexOf('\0', startIndex);
            if (endIndex < 0)
                endIndex = data.IndexOf(' ', startIndex);
            if (endIndex < 0)
                endIndex = data.Length;
            string value = data.Substring(startIndex, endIndex - startIndex);
            return value.TrimEnd('\0');
        }

        public async Task<List<DeviceDiscoveredEventArgs>> DetectDevicesAsync()
        {
            var discoveredDevices = new List<DeviceDiscoveredEventArgs>();
            var completionSource = new TaskCompletionSource();

            EventHandler<DeviceDiscoveredEventArgs> handler = (sender, device) =>
            {
                if (!discoveredDevices.Any(d => d.Name == device.Name))
                {

                    discoveredDevices.Add(device);
                    Debug.WriteLine($"Discovered Device: {device.Name}, IPs: {string.Join(", ", device.IPAddress)}");
                }
            };

            DeviceDiscovered += handler;

            try
            {
                StartDiscovery();
                await Task.Delay(3000);
                completionSource.SetResult();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during device discovery: {ex.Message}");
                completionSource.SetException(ex);
            }
            finally
            {
                StopDiscovery();
                DeviceDiscovered -= handler;
            }

            await completionSource.Task;

            return discoveredDevices;
        }
        public async Task CheckDeviceSync(object state)
        {
            try
            {
                // Si state est un RFDevice, vérifier uniquement cet appareil
                if (state is RFDevice deviceToCheck)
                {
                    await CheckSingleDeviceSync(deviceToCheck);
                    return;
                }

                // Sinon vérifier tous les appareils
                var devicesCopy = _devicesViewModel.Devices.ToList();
                foreach (var discoveredDevice in devicesCopy)
                {
                    if (!discoveredDevice.IsSynced)
                    {
                        continue;
                    }

                    await CheckSingleDeviceSync(discoveredDevice);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error checking device sync: {ex.Message}");
            }
        }

        private IDeviceHandler GetAppropriateHandler(RFDevice device)
        {
            if (device == null)
            {
                return null;
            }

            // Prioritize G4 handler for G4 devices
            if (device.Model?.Contains("G4") == true)
            {
                var g4Handler = _handlers.FirstOrDefault(h => 
                    h.Brand == device.Brand && 
                    h.GetType().Name.Contains("G4"));
                
                if (g4Handler != null)
                {
                    Debug.WriteLine($"Selected G4 handler for device {device.Name}");
                    return g4Handler;
                }
            }

            // Fall back to regular handler by brand
            var regularHandler = _handlers.FirstOrDefault(h => h.Brand == device.Brand);
            Debug.WriteLine($"Selected regular handler {regularHandler?.GetType().Name} for device {device.Name}");
            return regularHandler;
        }

        private IDeviceHandler GetAppropriateHandlerForType(string brand, string type)
        {
            // Prioritize G4 handler for G4 devices
            if (type?.Contains("G4") == true)
            {
                var g4Handler = _handlers.FirstOrDefault(h => 
                    h.Brand == brand && 
                    h.GetType().Name.Contains("G4"));
                
                if (g4Handler != null)
                {
                    Debug.WriteLine($"Selected G4 handler for device type {type}");
                    return g4Handler;
                }
            }
            var regularHandler = _handlers.FirstOrDefault(h => h.Brand == brand);
            Debug.WriteLine($"Selected regular handler {regularHandler?.GetType().Name} for device type {type}");
            return regularHandler;
        }

        private async Task CheckSingleDeviceSync(RFDevice device)
        {
            try
            {
                if (device == null || !device.IsSynced)
                {
                    return;
                }
                var handler = GetAppropriateHandler(device);
                if (handler == null)
                {
                    Debug.WriteLine($"No handler found for device {device.Name} of brand {device.Brand}");
                    return;
                }
                
                var deviceInfo = new DeviceDiscoveredEventArgs
                {
                    Name = device.Name,
                    Brand = device.Brand,
                    Type = device.Model,
                    SerialNumber = device.SerialNumber,
                    IPAddress = device.IpAddress,
                    Frequency = device.Frequency,
                    Channels = device.Channels.Select(c => new DeviceDiscoveredEventArgs.ChannelInfo
                    {
                        ChannelNumber = c.chanNumber,
                        Name = c.ChannelName,
                        Frequency = c.Frequency.ToString()
                    }).ToList()
                };

                var (IsEqual, IsNotResponding) = await handler.IsDevicePendingSync(deviceInfo);
                if (IsNotResponding)
                {
                    device.IsOnline = false;
                    Debug.WriteLine($"Device {device.Name} is not responding");
                }
                else
                {
                    device.IsOnline = true;
                    device.PendingSync = !IsEqual;
                    Debug.WriteLine($"Device {device.Name} - IsEqual: {IsEqual}, PendingSync: {device.PendingSync}");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error checking sync for device {device.Name}: {ex.Message}");
            }
        }

        public void StopDiscovery()
        {
            _multicastService.Stop();
            _serviceDiscovery.Dispose();
            
            // Stop G4 discovery
            _g4DiscoveryCts?.Cancel();
            _g4UdpClient?.Dispose();
            _g4UdpClient = null;
        }
    }
}

