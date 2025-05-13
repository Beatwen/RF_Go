using RF_Go.Models;


namespace RF_Go.Services.DeviceHandlers
{
    public interface IDeviceHandler
    {
        bool CanHandle(string serviceName);
        Task HandleDevice(DeviceDiscoveredEventArgs deviceInfo);

        Task<(bool IsEqual, bool IsNotResponding)> IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo);
        Task<List<string>> SyncToDevice(DeviceDiscoveredEventArgs deviceInfo);
        string Brand { get; }
    }

}
