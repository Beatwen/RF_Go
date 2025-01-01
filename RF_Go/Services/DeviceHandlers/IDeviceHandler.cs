using RF_Go.Models;


namespace RF_Go.Services.DeviceHandlers
{
    public interface IDeviceHandler
    {
        bool CanHandle(string serviceName);
        Task HandleDevice(DeviceDiscoveredEventArgs deviceInfo);
        Task<bool> CheckDeviceSync(DeviceDiscoveredEventArgs deviceInfo);
        string Brand { get; }
    }

}
