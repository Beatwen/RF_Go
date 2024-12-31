using Makaretu.Dns;
using RF_Go.Services.DeviceHandlers;
using System.Diagnostics;
using System.Linq;
using System.Net;
using RF_Go.Models;

namespace RF_Go.Services.NetworkProtocols
{
    public class DiscoveryService
    {
        private readonly MulticastService _multicastService;
        private readonly ServiceDiscovery _serviceDiscovery;
        private readonly List<IDeviceHandler> _handlers;
        public event EventHandler<DeviceDiscoveredEventArgs> DeviceDiscovered;

        public DiscoveryService(IEnumerable<IDeviceHandler> handlers)
        {
            _handlers = handlers.ToList();
            _multicastService = new MulticastService();
            _serviceDiscovery = new ServiceDiscovery(_multicastService);

            _serviceDiscovery.ServiceDiscovered += OnServiceDiscovered;
            _serviceDiscovery.ServiceInstanceDiscovered += OnServiceInstanceDiscovered;
        }
        public void StartDiscovery()
        {
            _multicastService.Start();
            _serviceDiscovery.QueryServiceInstances("_ssc._udp.local");
            _serviceDiscovery.QueryServiceInstances("_ewd._http.local");
        }
        private void OnServiceDiscovered(object sender, DomainName serviceName)
        {
            _serviceDiscovery.QueryServiceInstances(serviceName);
        }
        private async void OnServiceInstanceDiscovered(object sender, ServiceInstanceDiscoveryEventArgs e)
        {
            var addressIPV4 = e.Message.Answers
                .OfType<AddressRecord>()
                .Select(record => record.Address)
                .FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork); // IPv4 uniquement

            if (addressIPV4 == null)
            {
                var srvRecord = e.Message.AdditionalRecords
                    .OfType<SRVRecord>()
                    .FirstOrDefault();

                if (srvRecord != null)
                {
                    try
                    {
                        var resolvedAddresses = await Dns.GetHostAddressesAsync(srvRecord.Target.ToString());
                        addressIPV4 = resolvedAddresses.FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork); // Première IPv4
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
                IPAddress = addressIPV4?.ToString() // Une seule IP
            };

            foreach (var handler in _handlers)
            {
                if (handler.CanHandle(e.ServiceInstanceName.ToString()))
                {
                    handler.HandleDevice(deviceInfo);
                    deviceInfo.Brand = handler.Brand;
                    break;
                }
            }
            DeviceDiscovered?.Invoke(this, deviceInfo);
        }
        public void TriggerSennheiserDiscovery()
        {
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
        public void StopDiscovery()
        {
            _multicastService.Stop();
            _serviceDiscovery.Dispose();
        }
    }
}
