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
        public event EventHandler<string> DeviceDiscovered;

        public DiscoveryService()
        {
            _multicastService = new MulticastService();
            _serviceDiscovery = new ServiceDiscovery(_multicastService);

            // Subscribe to events for discovering services and instances
            _serviceDiscovery.ServiceDiscovered += OnServiceDiscovered;
            _serviceDiscovery.ServiceInstanceDiscovered += OnServiceInstanceDiscovered;
        }

        public void StartDiscovery()
        {
            _multicastService.Start();
            _serviceDiscovery.QueryServiceInstances("_ssc._udp.local");
        }

        // Handle general service discovery by name (without full details)
        private void OnServiceDiscovered(object sender, DomainName serviceName)
        {
            // Simply trigger event with the service name for now
            DeviceDiscovered?.Invoke(this, $"Service discovered: {serviceName}");

            // Optionally query service instances (for more details)
            _serviceDiscovery.QueryServiceInstances(serviceName);
        }

        // Handle detailed instance discovery (with addresses and more details)
        private void OnServiceInstanceDiscovered(object sender, ServiceInstanceDiscoveryEventArgs e)
        {
            // Extract relevant information from the service instance
            var addresses = string.Join(", ", e.Message.AdditionalRecords
                .OfType<AddressRecord>()
                .Select(record => record.Address.ToString()));

            var deviceInfo = $"{e.ServiceInstanceName} - IP: {addresses}";
            DeviceDiscovered?.Invoke(this, deviceInfo);
        }

        public void StopDiscovery()
        {
            // Clean up the service
            _multicastService.Stop();
            _serviceDiscovery.Dispose();
        }
    }
}
