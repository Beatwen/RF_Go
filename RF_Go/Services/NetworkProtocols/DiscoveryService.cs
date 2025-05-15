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
        private UdpClient _shureUdpClient;
        private CancellationTokenSource _shureDiscoveryCts;

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
            
            // Add Shure discovery
            Task.Run(async () => {
                try {
                    using (var timeoutCts = new CancellationTokenSource(10000)) // 10 sec
                    {
                        await TriggerShureDiscoveryAsync(timeoutCts.Token);
                    }
                }
                catch (Exception ex) {
                    Debug.WriteLine($"Shure discovery safely aborted: {ex.Message}");
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
                        addressIPV4 = resolvedAddresses.FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
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
                IPAddress = addressIPV4 != null ? addressIPV4.ToString() : null
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

            var discoveredDevicesCopy = DiscoveredDevices.ToList();
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
        }
        
        private async Task TriggerSennheiserG4DiscoveryAsync(CancellationToken cancellationToken)
        {
            Debug.WriteLine("Triggering Sennheiser G4 IEM discovery via proprietary protocol.");
            try
            {
                _g4DiscoveryCts?.Cancel();
                _g4DiscoveryCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                
                // Clean up any existing UDP client
                _g4UdpClient?.Dispose();
                
                // Create a new UDP client specifically for G4 discovery
                _g4UdpClient = new UdpClient();
                
                // Configure socket options for multicast properly
                _g4UdpClient.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                _g4UdpClient.Client.SetSocketOption(SocketOptionLevel.IP, SocketOptionName.MulticastTimeToLive, 4);
                _g4UdpClient.MulticastLoopback = false;
                
                try {
                    // Bind to port 8133 on all interfaces
                    IPEndPoint localEndpoint = new IPEndPoint(IPAddress.Any, 8133);
                    _g4UdpClient.Client.Bind(localEndpoint);
                    
                    // Join the multicast group
                    _g4UdpClient.JoinMulticastGroup(IPAddress.Parse("224.0.0.251"));
                    
                    // Start listening for G4 device responses
                    var listenTask = ListenForG4DevicesAsync(_g4DiscoveryCts.Token);
                    
                    // Send the discovery trigger - first attempt
                    await SendG4DiscoveryTrigger();
                    await Task.Delay(2000, cancellationToken);
                    
                    // Send a second discovery trigger
                    await SendG4DiscoveryTrigger();
                    await Task.Delay(5000, cancellationToken);
                }
                finally {
                    // Clean up
                    try {
                        if (_g4UdpClient != null)
                        {
                            _g4UdpClient.DropMulticastGroup(IPAddress.Parse("224.0.0.251"));
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
                // Create discovery packet
                string commandStr = "[servicecommand]devinfo\r\n";
                byte[] commandBytes = Encoding.ASCII.GetBytes(commandStr);
                
                // Create a packet with header
                byte[] header = new byte[] { 0x12, 0x07, 0x06, 0x20, 0x00, 0x00, 0x19, 0x00 };
                
                // Total size is 1035 bytes
                byte[] packet = new byte[1035];
                
                // Copy header
                Array.Copy(header, 0, packet, 0, header.Length);
                
                // Copy command string
                Array.Copy(commandBytes, 0, packet, header.Length, commandBytes.Length);
                
                // Set footer at the end of the packet
                packet[packet.Length - 3] = 0x01;
                packet[packet.Length - 2] = 0x01;
                packet[packet.Length - 1] = 0x01;
                
                // Create a specific endpoint for the destination
                IPEndPoint multicastEndpoint = new IPEndPoint(IPAddress.Parse("224.0.0.251"), 8133);
                
                // Send the discovery packet
                await _g4UdpClient.SendAsync(packet, packet.Length, multicastEndpoint);
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
                    
                    // Skip our own discovery packet
                    if (dataAscii.Contains("[servicecommand]devinfo"))
                    {
                        continue;
                    }

                    // Only process packets that look like G4 responses
                    if (dataAscii.Contains("Model=") && 
                       (dataAscii.Contains("SR-IEMG4") || dataAscii.Contains("G4")))
                    {
                        var deviceInfo = ParseG4DeviceInfo(dataAscii, result.RemoteEndPoint.Address);
                        if (deviceInfo != null)
                        {
                            // Check if device is already synced - same logic as in OnServiceInstanceDiscovered
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
                            
                            var discoveredDevicesCopy = DiscoveredDevices.ToList();
                            if (!discoveredDevicesCopy.Any(d => d.Name == deviceInfo.Name))
                            {
                                DiscoveredDevices.Add(deviceInfo);
                                DeviceDiscovered?.Invoke(this, deviceInfo);
                            }
                        }
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
                // First, check if this is truly a G4 device by looking for G4-specific patterns
                if (!(data.Contains("SR-IEMG4") || data.Contains("G4 IEM") || 
                      data.Contains("Model=") && data.Contains("ID=") && data.Contains("IPA=")))
                {
                    return null;
                }
                
                // Extract model, ID and IP using string manipulation
                string model = "";
                string id = "";
                string ipa = "";
                
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
                    return null;
                }
                
                // Double-check this is a G4 model
                if (!model.Contains("G4") && !model.Contains("IEM"))
                {
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
                // If state is an RFDevice, check only that device
                if (state is RFDevice deviceToCheck)
                {
                    await CheckSingleDeviceSync(deviceToCheck);
                    return;
                }

                // Otherwise check all devices
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
                    return g4Handler;
                }
            }

            // Fall back to regular handler by brand
            return _handlers.FirstOrDefault(h => h.Brand == device.Brand);
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
                    return g4Handler;
                }
            }
            return _handlers.FirstOrDefault(h => h.Brand == brand);
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
                }
                else
                {
                    device.IsOnline = true;
                    device.PendingSync = !IsEqual;
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
            
            // Stop Shure discovery
            _shureDiscoveryCts?.Cancel();
            _shureUdpClient?.Dispose();
            _shureUdpClient = null;
        }

        private async Task TriggerShureDiscoveryAsync(CancellationToken cancellationToken)
        {
            Debug.WriteLine("Triggering Shure ULX-D discovery via proprietary protocol.");
            try
            {
                _shureDiscoveryCts?.Cancel();
                _shureDiscoveryCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                
                // Clean up any existing UDP client
                _shureUdpClient?.Dispose();
                
                // Create a new UDP client specifically for Shure discovery
                _shureUdpClient = new UdpClient();
                
                // Configure socket options for multicast properly
                _shureUdpClient.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                _shureUdpClient.Client.SetSocketOption(SocketOptionLevel.IP, SocketOptionName.MulticastTimeToLive, 4);
                _shureUdpClient.MulticastLoopback = false;
                
                try {
                    // Try SSDP discovery (port 1900)
                    await TryShureSsdpDiscovery();
                    
                    // After a short delay, try SLP discovery (port 8427)
                    await Task.Delay(2000, cancellationToken);
                    await TryShureSlpDiscovery();
                    
                    // Listen for responses for some time
                    await Task.Delay(5000, cancellationToken);
                }
                finally {
                    // Clean up
                    try {
                        _shureUdpClient?.Close();
                        _shureUdpClient?.Dispose();
                    } 
                    catch (Exception ex) {
                        Debug.WriteLine($"Error during Shure client cleanup: {ex.Message}");
                    }
                }
            }
            catch (OperationCanceledException)
            {
                Debug.WriteLine("Shure discovery cancelled.");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during Shure discovery: {ex.Message}");
            }
        }

        private async Task TryShureSsdpDiscovery()
        {
            try 
            {
                // Bind to all interfaces
                IPEndPoint localEndpoint = new IPEndPoint(IPAddress.Any, 0);
                _shureUdpClient.Client.Bind(localEndpoint);
                
                // Join the SSDP multicast group
                _shureUdpClient.JoinMulticastGroup(IPAddress.Parse("239.255.255.250"));
                
                // Start listening for responses
                var receiveTask = ListenForShureDevicesAsync(_shureDiscoveryCts.Token);
                
                // Create SSDP M-SEARCH message
                string ssdpMessage = 
                    "M-SEARCH * HTTP/1.1\r\n" +
                    "HOST: 239.255.255.250:1900\r\n" +
                    "MAN: \"ssdp:discover\"\r\n" +
                    "MX: 3\r\n" +
                    "ST: ssdp:all\r\n" + // Search for all devices
                    "\r\n";
                
                byte[] ssdpData = Encoding.ASCII.GetBytes(ssdpMessage);
                
                // Send to SSDP multicast address
                IPEndPoint ssdpEndpoint = new IPEndPoint(IPAddress.Parse("239.255.255.250"), 1900);
                await _shureUdpClient.SendAsync(ssdpData, ssdpData.Length, ssdpEndpoint);
                
                Debug.WriteLine("Sent SSDP discovery packet for Shure devices");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error in Shure SSDP discovery: {ex.Message}");
            }
        }

        private async Task TryShureSlpDiscovery()
        {
            try
            {
                // Create a new client for SLP if needed (or reuse existing but with different multicast group)
                _shureUdpClient?.Close();
                _shureUdpClient = new UdpClient();
                _shureUdpClient.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                _shureUdpClient.Client.SetSocketOption(SocketOptionLevel.IP, SocketOptionName.MulticastTimeToLive, 4);
                _shureUdpClient.MulticastLoopback = false;
                
                // Bind to all interfaces 
                IPEndPoint localEndpoint = new IPEndPoint(IPAddress.Any, 0);
                _shureUdpClient.Client.Bind(localEndpoint);
                
                // Join the SLP multicast group
                _shureUdpClient.JoinMulticastGroup(IPAddress.Parse("239.255.254.253"));
                
                // Start listening for responses on the SLP port
                var receiveTask = ListenForShureDevicesAsync(_shureDiscoveryCts.Token);
                
                // SLP service request packet (simplified version)
                byte[] slpHeader = new byte[] { 
                    0x02, // SLP Version 2
                    0x01, // Function-ID: Service Request
                    0x00, 0x00, // Message Length (placeholder)
                    0x00, 0x00, // Flags
                    0x00, 0x00, // Next Offset 
                    0x00, 0x00, // Language Tag Length
                    // Simplified SLP packet - enough to trigger responses
                };
                
                // Send to SLP multicast address
                IPEndPoint slpEndpoint = new IPEndPoint(IPAddress.Parse("239.255.254.253"), 8427);
                await _shureUdpClient.SendAsync(slpHeader, slpHeader.Length, slpEndpoint);
                
                Debug.WriteLine("Sent SLP discovery packet for Shure devices");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error in Shure SLP discovery: {ex.Message}");
            }
        }

        private async Task ListenForShureDevicesAsync(CancellationToken cancellationToken)
        {
            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    var result = await _shureUdpClient.ReceiveAsync(cancellationToken);
                    string dataAscii = Encoding.ASCII.GetString(result.Buffer);
                    
                    Debug.WriteLine($"Received potential Shure device data from {result.RemoteEndPoint.Address}");
                    
                    // Check if this looks like a Shure device response
                    if (dataAscii.Contains("Shure") || dataAscii.Contains("ULXD") || 
                        dataAscii.Contains("AD4") || dataAscii.Contains("PSM1000") || 
                        dataAscii.Contains("UR4D"))
                    {
                        Debug.WriteLine($"Shure device response detected: {dataAscii.Substring(0, Math.Min(100, dataAscii.Length))}");
                        
                        var deviceInfo = ParseShureDeviceInfo(dataAscii, result.RemoteEndPoint.Address);
                        if (deviceInfo != null)
                        {
                            // Check if device is already synced
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
                            
                            var discoveredDevicesCopy = DiscoveredDevices.ToList();
                            if (!discoveredDevicesCopy.Any(d => d.Name == deviceInfo.Name))
                            {
                                DiscoveredDevices.Add(deviceInfo);
                                DeviceDiscovered?.Invoke(this, deviceInfo);
                            }
                        }
                    }
                }
            }
            catch (OperationCanceledException)
            {
                // Operation was cancelled, no need to log
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error while listening for Shure devices: {ex.Message}");
            }
        }

        private DeviceDiscoveredEventArgs ParseShureDeviceInfo(string data, IPAddress remoteAddress)
        {
            try
            {
                // Extract information from the response
                // This is a simplified parser - the actual format will need to be determined from real responses
                string model = "";
                string id = "";
                
                // Try to extract model
                if (data.Contains("ULXD4D"))
                    model = "ULXD4D";
                else if (data.Contains("ULXD4Q"))
                    model = "ULXD4Q";
                else if (data.Contains("ULXD4"))
                    model = "ULXD4";
                else if (data.Contains("AD4D"))
                    model = "AD4D";
                else if (data.Contains("AD4Q"))
                    model = "AD4Q";
                else if (data.Contains("PSM1000"))
                    model = "PSM1000";
                else if (data.Contains("UR4D"))
                    model = "UR4D";
                else
                    model = "Unknown Shure";
                    
                // Try to extract unique identifier
                // This is a placeholder - need to determine the actual format
                int idIndex = data.IndexOf("MAC=");
                if (idIndex >= 0)
                {
                    id = data.Substring(idIndex + 4, 17); // Assume MAC address format
                }
                else
                {
                    id = "Unknown-" + Guid.NewGuid().ToString().Substring(0, 8);
                }
                
                // Create device info
                var deviceInfo = new DeviceDiscoveredEventArgs
                {
                    Name = model + " " + id,
                    Brand = "Shure",
                    Type = model,
                    SerialNumber = id,
                    IPAddress = remoteAddress.ToString(),
                };
                
                // Get appropriate handler
                var handler = GetAppropriateHandlerForType(deviceInfo.Brand, deviceInfo.Type);
                if (handler != null && handler.CanHandle(deviceInfo.Type))
                {
                    handler.HandleDevice(deviceInfo).Wait();
                }
                
                Debug.WriteLine($"Parsed Shure device: {deviceInfo.Name} at {deviceInfo.IPAddress}");
                return deviceInfo;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error parsing Shure device info: {ex.Message}");
                return null;
            }
        }
    }
}

