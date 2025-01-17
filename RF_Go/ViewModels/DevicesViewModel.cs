using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RF_Go.Data;
using RF_Go.Models;
using RF_Go.Services.NetworkProtocols;
using System.Collections.ObjectModel;
using System.Diagnostics;


namespace RF_Go.ViewModels
{
    public partial class DevicesViewModel : ObservableObject
    {
        private readonly DatabaseContext _context;

        public DevicesViewModel(DatabaseContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [ObservableProperty]
        private ObservableCollection<RFDevice> _devices = new();
        [ObservableProperty]
        public RFDevice _operatingDevice = new();

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
        public async Task SaveAllDevicesAsync()
        {
            var busyText = "Saving All Devices...";
            await ExecuteAsync(async () =>
            {
                foreach (var device in Devices)
                {
                    var (isValid, errorMessage) = device.Validate();
                    if (!isValid)
                    {
                        await Shell.Current.DisplayAlert("Validation Error", $"Device {device.Name}: {errorMessage}", "Ok");
                        continue;
                    }

                    if (device.ID == 0)
                    {
                        // Create Device
                        await _context.AddItemAsync<RFDevice>(device);
                    }
                    else
                    {
                        // Update Device
                        await _context.UpdateItemAsync<RFDevice>(device);
                    }
                }
            }, busyText);
        }


        public async Task UpdateDeviceAsync(RFDevice device)
        {
            if (device == null)
                throw new ArgumentNullException(nameof(device));

            var (isValid, errorMessage) = device.Validate();
            if (!isValid)
            {
                await Shell.Current.DisplayAlert("Validation Error", errorMessage, "Ok");
                return;
            }

            var busyText = "Updating Device...";
            await ExecuteAsync(async () =>
            {
                if (await _context.UpdateItemAsync<RFDevice>(device))
                {
                    var deviceCopy = device.Clone();

                    var index = Devices.IndexOf(device);
                    if (index >= 0)
                    {
                        Devices[index] = deviceCopy;
                    }
                    else
                    {
                        Devices.Add(deviceCopy);
                    }
                }
                else
                {
                    // A FAIRE remonter les info à la snackbar
                    await Shell.Current.DisplayAlert("Error", "Device update error", "Ok");
                }
            }, busyText);
        }

        public void MapOnlineToOffline(RFDevice onlineDevice)
        {
            /// Attention _onlineDevices n'existe plus !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
                    var device = Devices.FirstOrDefault(p => p.ID == id);
                    if (device != null)
                    {
                        Devices.Remove(device);
                    }
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

        //public void UpdateDeviceSyncStatus(RFDevice onlineDevice, bool isPendingSync)
        //{
        //    onlineDevice.PendingSync = isPendingSync;

        //    var matchingDevice = Devices.FirstOrDefault(d => d.ID == onlineDevice.ID);
        //    if (matchingDevice != null)
        //    {
        //        matchingDevice.PendingSync = isPendingSync;
        //    }
        //}
    }
}
