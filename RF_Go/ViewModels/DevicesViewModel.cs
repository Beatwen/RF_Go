using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Newtonsoft.Json;
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
        private List<DeviceDiscoveredEventArgs> _discoveredDevices = new();
        [ObservableProperty]
        private RFDevice _operatingDevice = new();

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
            var device = OperatingDevice;
            if (OperatingDevice is null)
                return;

            var (isValid, errorMessage) = OperatingDevice.Validate();
            if (!isValid)
            {
                // A FAIRE : revérifier les datas et l'erreur générer ici
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

        [RelayCommand]
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
        public void SaveDataDevicesInfo(RFDevice device)
        {
            var json = DeviceDataJson.Devices;
            var deviceData = JsonConvert.DeserializeObject<DeviceData>(json);
            device.Range = deviceData.Brands[device.Brand][device.Model][device.Frequency];
            device.Step = (int)deviceData.Brands[device.Brand][device.Model][device.Frequency][3];
            device.NumberOfChannels = (int)deviceData.Brands[device.Brand][device.Model][device.Frequency][2];
            Debug.WriteLine(device.NumberOfChannels);
            device.Channels = new List<RFChannel>();
            for (int i = 0; i < device.NumberOfChannels; i++)
            {
                device.Channels.Add(new RFChannel());
            }
        }
        public void SaveDataChannelsInfo(RFDevice device)
        {
            var json = DeviceDataJson.Devices;
            var deviceData = JsonConvert.DeserializeObject<DeviceData>(json);
            var freq = deviceData.Brands[device.Brand][device.Model][device.Frequency];
            int count = 1;
            foreach (RFChannel chan in device.Channels)
            {
                chan.Range = device.Range;
                chan.Step = device.Step;
                chan.chanNumber = count;
                chan.SelfSpacing = freq[4];
                chan.ThirdOrderSpacing = freq[5];
                chan.FifthOrderSpacing = freq[6];
                chan.SeventhOrderSpacing = freq[7];
                chan.ThirdOrderSpacing3Tx = freq[8];
                count++;
            }
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