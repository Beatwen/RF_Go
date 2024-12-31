using Makaretu.Dns;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

public class SennheiserDiscoveryService : IDisposable
{
    private readonly MulticastService multicastService;
    private readonly ServiceDiscovery serviceDiscovery;
    public event EventHandler<string> DeviceDiscovered;

    public SennheiserDiscoveryService()
    {
        multicastService = new MulticastService();
        serviceDiscovery = new ServiceDiscovery(multicastService);
        serviceDiscovery.ServiceDiscovered += OnServiceDiscovered;
        serviceDiscovery.ServiceInstanceDiscovered += OnServiceInstanceDiscovered;
    }

    public void StartDiscovery()
    {
        multicastService.Start();
        serviceDiscovery.QueryServiceInstances("_ssc._udp.local");
        serviceDiscovery.QueryServiceInstances("_ssc._tcp.local");

        Debug.Print("Listening for Sennheiser devices via DNS-SD...");
    }

    private void OnServiceDiscovered(object sender, DomainName serviceName)
    {
        // Filtrer uniquement les services Sennheiser (qui utilisent "_ssc._udp" ou "_ssc._tcp")
        if (serviceName.ToString().EndsWith("_ssc._udp.local") || serviceName.ToString().EndsWith("_ssc._tcp.local"))
        {
            DeviceDiscovered?.Invoke(this, $"Service discovered: {serviceName}");
            Debug.Print(serviceName.Labels.First());

            // Interroger les instances de service pour plus de détails
            serviceDiscovery.QueryServiceInstances(serviceName);
        }
    }

    private void OnServiceInstanceDiscovered(object sender, ServiceInstanceDiscoveryEventArgs e)
    {
        // Filtrer uniquement les instances de service Sennheiser
        if (e.ServiceInstanceName.ToString().EndsWith("_ssc._udp.local") || e.ServiceInstanceName.ToString().EndsWith("_ssc._tcp.local"))
        {
            // Récupérer les informations détaillées de l'instance de service, comme l'adresse IP
            var addresses = string.Join(", ", e.Message.AdditionalRecords
                .OfType<AddressRecord>()
                .Select(record => record.Address.ToString()));

            var deviceInfo = $"{e.ServiceInstanceName} - IP: {addresses}";

            // Récupérer les enregistrements TXT (comme version, etc.)
            var txtRecord = e.Message.AdditionalRecords
                .OfType<TXTRecord>()
                .FirstOrDefault();
            if (txtRecord != null)
            {
                var version = txtRecord.Strings.FirstOrDefault(s => s.StartsWith("version="));
                deviceInfo += $" - {version}";
            }

            DeviceDiscovered?.Invoke(this, deviceInfo);
        }
    }

    public void StopDiscovery()
    {
        multicastService.Stop();
        serviceDiscovery.Dispose();
    }

    public void Dispose()
    {
        StopDiscovery();
        multicastService.Dispose();
    }
}
