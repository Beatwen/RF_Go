using RF_Go.Models;


namespace RF_Go.Services.DeviceHandlers
{
    public interface IDeviceHandler
    {
        bool CanHandle(string serviceName);
        void HandleDevice(DeviceDiscoveredEventArgs deviceInfo);
        string Brand { get; }
    }

}
