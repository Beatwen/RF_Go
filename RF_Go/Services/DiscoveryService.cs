using Makaretu.Dns;
using System;
using System.Linq;
using System.Net;

namespace RF_Go.Services
{
    public class DiscoveryService
    {
        private readonly MulticastService _multicastService;
        private readonly ServiceDiscovery _serviceDiscovery;

        public event EventHandler<DeviceDiscoveredEventArgs> DeviceDiscovered;

        public DiscoveryService()
        {
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

        private void OnServiceInstanceDiscovered(object sender, ServiceInstanceDiscoveryEventArgs e)
        {
            // Extract IP addresses
            var addresses = e.Message.AdditionalRecords
                .OfType<AddressRecord>()
                .Select(record => record.Address.ToString())
                .ToList();

            // Infer service type from the queried service
            string type = InferServiceType(e.ServiceInstanceName.ToString());

            var deviceInfo = new DeviceDiscoveredEventArgs
            {
                Name = e.ServiceInstanceName.ToString(),
                Type = type, // Set the inferred type here
                IPAddresses = addresses
            };

            DeviceDiscovered?.Invoke(this, deviceInfo);
        }

        private string InferServiceType(string serviceInstanceName)
        {
            if (serviceInstanceName.Contains("_ssc"))
                return "Sennheiser";
            if (serviceInstanceName.Contains("_ewd"))
                return "EW-D";
            return "Unknown";
        }

        public void StopDiscovery()
        {
            _multicastService.Stop();
            _serviceDiscovery.Dispose();
        }
    }

    public class DeviceDiscoveredEventArgs : EventArgs
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public List<string> IPAddresses { get; set; }
    }
}
