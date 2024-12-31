using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RF_Go.Data;
using RF_Go.Models;
using RF_Go.Services.NetworkProtocols;
using System.Collections.ObjectModel;
using System.Diagnostics;


namespace RF_Go.ViewModels
{
    public partial class DevicesViewModel(DatabaseContext context, DiscoveryService discoveryService) : ObservableObject
    {
        private readonly DatabaseContext _context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly DiscoveryService _discoveryService = discoveryService ?? throw new ArgumentNullException(nameof(discoveryService));
        [ObservableProperty]
        private ObservableCollection<RFDevice> _devices = new();
        [ObservableProperty]
        public RFDevice _operatingDevice = new();
        [ObservableProperty]
        private ObservableCollection<RFDevice> _onlineDevices = new();

        [ObservableProperty]
        private bool _isBusy;

        [ObservableProperty]
        private string _busyText;

        public async Task LoadDevicesAsync()
        {
            try
            {
                var devices = await _context.GetAllAsync<RFDevice>();
                if (devices != null && devices.Any())
                {
                    Devices.Clear();
                    foreach (var device in devices)
                    {
                        Devices.Add(device);
                    }
                    Debug.WriteLine($"Number of devices loaded: {Devices.Count}");
                }
                else
                {
                    Debug.WriteLine("No devices found in the database.");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error loading devices: {ex.Message}");
                throw; // Rethrow the exception to propagate it
            }
        }
        [RelayCommand]
        public void SetOperatingDevice(RFDevice Device)
        {
            System.Diagnostics.Debug.WriteLine("edit device!");
            OperatingDevice = Device ?? new();
        }
        [RelayCommand]
        public async Task SaveDeviceAsync()
        {
            Debug.WriteLine("Save function called !");
            if (OperatingDevice is null)
                return;

            var (isValid, errorMessage) = OperatingDevice.Validate();
            if (!isValid)
            {
                await Shell.Current.DisplayAlert("Validation Error", errorMessage, "Ok");
                return;
            }

            var busyText = OperatingDevice.ID == 0 ? "Creating Device..." : "Updating Device...";
            await ExecuteAsync(async () =>
            {
                if (OperatingDevice.ID == 0)
                {
                    // Create Device
                    await _context.AddItemAsync<RFDevice>(OperatingDevice);
                    Devices.Add(OperatingDevice);
                }
                else
                {
                    // Update Device
                    if (await _context.UpdateItemAsync<RFDevice>(OperatingDevice))
                    {
                        var DeviceCopy = OperatingDevice.Clone();

                        var index = Devices.IndexOf(OperatingDevice);
                        Devices.RemoveAt(index);

                        Devices.Insert(index, DeviceCopy);
                    }
                    else
                    {
                        await Shell.Current.DisplayAlert("Error", "Device update error", "Ok");
                        return;
                    }
                }
                SetOperatingDeviceCommand.Execute(new());
            }, busyText);
        }
        [RelayCommand]
        public async Task LoadOnlineDevicesAsync()
        {
            try
            {
                IsBusy = true;
                BusyText = "Detecting Online Devices...";
                var discoveredDevices = await discoveryService.DetectDevicesAsync();
                OnlineDevices.Clear();
                foreach (var device in discoveredDevices)
                {
                    OnlineDevices.Add(new RFDevice
                    {
                        Name = device.Name,
                        Model = device.Type,
                        Frequency = device.Frequency,
                        IpAddress = device.IPAddress,
                        SerialNumber = device.SerialNumber,
                        IsSynced = device.IsSynced
                    });
                }

                Debug.WriteLine($"Number of online devices detected: {OnlineDevices.Count}");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error detecting online devices: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
                BusyText = null;
            }
        }
        public void MapOnlineToOffline(RFDevice onlineDevice)
        {
            var matchingOfflineDevice = Devices.FirstOrDefault(d =>
                d.Model == onlineDevice.Model &&
                d.Frequency == onlineDevice.Frequency);

            if (matchingOfflineDevice != null)
            {
                matchingOfflineDevice.IpAddress = onlineDevice.IpAddress;
                Debug.WriteLine($"Mapped {onlineDevice.Name} to {matchingOfflineDevice.Name}");
            }
            else
            {
                Debug.WriteLine($"No matching offline device found for {onlineDevice.Name}");
            }
        }

        public async Task DeleteDeviceAsync(int id)
        {
            await ExecuteAsync(async () =>
            {
                if (await _context.DeleteItemByKeyAsync<RFDevice>(id))
                {
                    var Device = Devices.FirstOrDefault(p => p.ID == id);
                    Devices.Remove(Device);
                }
                else
                {
                    await Shell.Current.DisplayAlert("Delete Error", "Device was not deleted", "Ok");
                }
            }, "Deleting Device...");
        }
        public async Task DeleteAllDeviceAsync()
        {
            await ExecuteAsync(async () =>
            {
                List<int> deviceIdsToDelete = Devices.Select(device => device.ID).ToList();

                foreach (var deviceId in deviceIdsToDelete)
                {
                    if (await _context.DeleteItemByKeyAsync<RFDevice>(deviceId))
                    {
                        var device = Devices.FirstOrDefault(p => p.ID == deviceId);
                        Devices.Remove(device);
                    }
                    else
                    {
                        await Shell.Current.DisplayAlert("Delete Error", "Device was not deleted", "Ok");
                    }
                }
            }, "Deleting Devices...");
        }
        private async Task ExecuteAsync(Func<Task> operation, string busyText = null)
        {
            IsBusy = true;
            BusyText = busyText ?? "Processing...";
            try
            {
                await operation?.Invoke();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error loading devices: {ex.Message}");
                throw; // Rethrow the exception to propagate it
            }
            finally
            {
                IsBusy = false;
                BusyText = null;
            }
        }
    }
}
