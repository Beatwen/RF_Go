using Makaretu.Dns;
using RF_Go.Services.DeviceHandlers;
using System.Diagnostics;
using System.Linq;
using System.Net;
using RF_Go.Models;
using RF_Go.Services.Commands;
using RF_Go.ViewModels;


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

            foreach (var handler in _handlers)
            {
                if (handler.CanHandle(e.ServiceInstanceName.ToString()))
                {
                    await handler.HandleDevice(deviceInfo);
                    deviceInfo.Brand = handler.Brand;
                    break;
                }
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
            Debug.WriteLine("Triggering Sennheiser discovery.");
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
            var devicesCopy = _devicesViewModel.Devices.ToList();
            foreach (var discoveredDevice in devicesCopy)
            {
                if (!discoveredDevice.IsSynced)
                {
                    continue;
                }
                var handler = _handlers.FirstOrDefault(h => h.Brand == discoveredDevice.Brand);
                if (handler != null)
                {
                    var deviceInfo = new DeviceDiscoveredEventArgs
                    {
                        Name = discoveredDevice.Name,
                        Brand = discoveredDevice.Brand,
                        Type = discoveredDevice.Model,
                        SerialNumber = discoveredDevice.SerialNumber,
                        IPAddress = discoveredDevice.IpAddress,
                        Frequency = discoveredDevice.Frequency,
                        Channels = discoveredDevice.Channels.Select(c => new DeviceDiscoveredEventArgs.ChannelInfo
                        {
                            ChannelNumber = c.chanNumber,
                            Name = c.ChannelName,
                            Frequency = c.Frequency.ToString()
                        }).ToList()
                    };

                    var (IsEqual, IsNotResponding) = await handler.IsDevicePendingSync(deviceInfo);
                    if (IsNotResponding)
                    {
                        discoveredDevice.IsOnline = false;
                    }
                    else
                    {
                        discoveredDevice.IsOnline = true;
                        discoveredDevice.PendingSync = !IsEqual;
                    }
                }
            }
        }
        public void StopDiscovery()
        {
            _multicastService.Stop();
            _serviceDiscovery.Dispose();
        }
    }
}
