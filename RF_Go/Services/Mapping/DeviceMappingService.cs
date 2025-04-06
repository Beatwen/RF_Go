using RF_Go.Models;
using System.Diagnostics;
using RF_Go.Services.Commands;
using RF_Go.Services.NetworkProtocols;
using System.Threading.Tasks;
using RF_Go.Services.DeviceHandlers;
using RF_Go.Utils.ValidationRules;
using System.Text.Json;
using MudBlazor;
using RF_Go.Components;
using RF_Go.ViewModels;
using Microsoft.Maui.Controls;
using Newtonsoft.Json;
using RF_Go.Data;


namespace RF_Go.Services.Mapping
{
    public class DeviceMappingService
    {
        private readonly UDPCommunicationService _communicationService;
        private readonly IDeviceCommandSet _commandSet;
        private readonly IEnumerable<IDeviceHandler> _deviceHandlers;
        private readonly DevicesViewModel _devicesViewModel;
        private readonly DiscoveryService _discoveryService;

        public DeviceMappingService(UDPCommunicationService communicationService, IDeviceCommandSet commandSet, IEnumerable<IDeviceHandler> deviceHandlers, DevicesViewModel devicesViewModel, DiscoveryService discoveryService)
        {
            _communicationService = communicationService;
            _commandSet = commandSet;
            _deviceHandlers = deviceHandlers;
            _devicesViewModel = devicesViewModel;
            _discoveryService = discoveryService;
        }

        public static RFDevice CastDeviceDiscoveredToRFDevice(DeviceDiscoveredEventArgs device)
        {
            var brand = device.Brand;
            if (device == null)
            {
                throw new ArgumentNullException("Device cannot be null");
            }
            try
            {
                RFDevice rfDevice = new RFDevice
                {
                    Name = device.Name,
                    Brand = device.Brand,
                    Frequency = device.Frequency,
                    Model = device.Type,
                    IpAddress = device.IPAddress,
                    SerialNumber = device.SerialNumber,
                    Channels = new List<RFChannel>()
                };

                foreach (var channel in device.Channels)
                {
                    var rfChannel = new RFChannel
                    {
                        chanNumber = channel.ChannelNumber,
                        ChannelName = channel.Name,
                        Frequency = int.Parse(channel.Frequency)
                    };
                    rfDevice.Channels.Add(rfChannel);
                }

                Debug.WriteLine("CastDeviceDiscoveredToRFDevice completed successfully");
                return rfDevice;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error in CastDeviceDiscoveredToRFDevice: {ex.Message}");
                throw;
            }
        }

        public async Task<List<string>> FirstSyncToDevice(RFDevice offlineDevice, RFDevice onlineDevice)
        {
            var errors = new List<string>();

            if (offlineDevice == null || onlineDevice == null)
            {
                throw new ArgumentNullException("Device cannot be null");
            }
            // A FAIRE : this cannot stay like this, the port must be dynamic
            var ip = onlineDevice.IpAddress;
            var port = 45;

            foreach (var channel in offlineDevice.Channels)
            {
                var channelFrequencyCommand = _commandSet.SetChannelFrequencyCommand(channel.chanNumber, channel.Frequency);
                await _communicationService.SendCommandAsync(ip, port, channelFrequencyCommand);

                var (validatedChannelName, validationErrors) = ValidationHelper.ValidateInput(onlineDevice.Model, channel.ChannelName);
                if (validationErrors.Any())
                {
                    errors.AddRange(validationErrors.Select(error => $"Validation error for channel {channel.chanNumber}: {error}"));
                }
                else
                {
                    var channelNameCommand = _commandSet.SetChannelNameCommand(channel.chanNumber, validatedChannelName);
                    await _communicationService.SendCommandAsync(ip, port, channelNameCommand);
                }
            }
            return errors;
        }

        public async Task<List<string>> SyncToDevice(RFDevice offlineDevice)
        {
            var errors = new List<string>();

            if (offlineDevice == null)
            {
                throw new ArgumentNullException("Device cannot be null");
            }
            // A FAIRE this cannot stay like this, the port must be dynamic
            var ip = offlineDevice.IpAddress;
            var port = 45;

            foreach (var channel in offlineDevice.Channels)
            {
                var channelFrequencyCommand = _commandSet.SetChannelFrequencyCommand(channel.chanNumber, channel.Frequency);
                await _communicationService.SendCommandAsync(ip, port, channelFrequencyCommand);

                var (validatedChannelName, validationErrors) = ValidationHelper.ValidateInput(offlineDevice.Model, channel.ChannelName);
                if (validationErrors.Any())
                {
                    errors.AddRange(validationErrors.Select(error => $"Validation error for channel {channel.chanNumber}: {error}"));
                }
                else
                {
                    var channelNameCommand = _commandSet.SetChannelNameCommand(channel.chanNumber, validatedChannelName);
                    await _communicationService.SendCommandAsync(ip, port, channelNameCommand);
                }
            }

            return errors;
        }

        public static void FirstSyncFromDevice(RFDevice offlineDevice, RFDevice onlineDevice)
        {
            if (offlineDevice == null || onlineDevice == null)
            {
                throw new ArgumentNullException("Device cannot be null");
            }
            try
            {
                Debug.WriteLine("SyncFromDevice called");
                Debug.WriteLine($"OnlineDevice Name: {onlineDevice.Name}, Frequency: {onlineDevice.Frequency}");

                offlineDevice.Name = onlineDevice.Name;
                offlineDevice.Frequency = onlineDevice.Frequency;
                offlineDevice.IpAddress = onlineDevice.IpAddress;
                offlineDevice.SerialNumber = onlineDevice.SerialNumber;

                foreach (var channel in onlineDevice.Channels)
                {
                    Debug.WriteLine($"Channel Number: {channel.chanNumber}, Name: {channel.chanNumber}, Frequency: {channel.Frequency}");
                    if (offlineDevice.Channels.Count >= channel.chanNumber)
                    {
                        offlineDevice.Channels[channel.chanNumber - 1].ChannelName = channel.ChannelName;
                        offlineDevice.Channels[channel.chanNumber - 1].Frequency = channel.Frequency;
                    }
                    else
                    {
                        Debug.WriteLine($"Channel number {channel.chanNumber} is out of range for offlineDevice.Channels");
                    }
                }

                Debug.WriteLine("SyncFromDevice completed successfully");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error in SyncFromDevice: {ex.Message}");
                throw;
            }
        }

        public async Task SyncFromDevice(RFDevice offlineDevice)
        {
            if (offlineDevice == null)
            {
                throw new ArgumentNullException("Device cannot be null");
            }
            try
            {
                var deviceInfo = await FetchDeviceData(offlineDevice);
                if (deviceInfo == null)
                {
                    throw new Exception("Device not found on the network.");
                }

                offlineDevice.Name = deviceInfo.Name;
                offlineDevice.Frequency = deviceInfo.Frequency;
                offlineDevice.IpAddress = deviceInfo.IPAddress;
                offlineDevice.SerialNumber = deviceInfo.SerialNumber;

                foreach (var channel in deviceInfo.Channels)
                {
                    Debug.WriteLine($"Channel Number: {channel.ChannelNumber}, Name: {channel.Name}, Frequency: {channel.Frequency}");
                    if (offlineDevice.Channels.Count >= channel.ChannelNumber)
                    {
                        offlineDevice.Channels[channel.ChannelNumber - 1].ChannelName = channel.Name;
                        if (!string.IsNullOrEmpty(channel.Frequency))
                        {
                            offlineDevice.Channels[channel.ChannelNumber - 1].Frequency = int.Parse(channel.Frequency);
                        }
                        else
                        {
                            Debug.WriteLine($"Channel {channel.ChannelNumber} has an empty frequency.");
                        }
                    }
                    else
                    {
                        Debug.WriteLine($"Channel number {channel.ChannelNumber} is out of range for offlineDevice.Channels");
                    }
                }
                Debug.WriteLine("SyncFromDeviceUsingOfflineDevice completed successfully");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error in SyncFromDeviceUsingOfflineDevice: {ex.Message}");
                throw;
            }
        }

        public async Task<List<string>> SyncAllFromDevice()
        {
            var errors = new List<string>();
            var discoveredDevices = _discoveryService.DiscoveredDevices.ToList();
            var json = DeviceDataJson.Devices;
            var deviceData = JsonConvert.DeserializeObject<DeviceData>(json);

            foreach (var discoveredDevice in discoveredDevices)
            {
                if (discoveredDevice.Brand != null &&
                    discoveredDevice.Type != null &&
                    discoveredDevice.Frequency != null &&
                    deviceData.Brands.TryGetValue(discoveredDevice.Brand, out var brandData) &&
                    brandData.TryGetValue(discoveredDevice.Type, out var modelData) &&
                    modelData.TryGetValue(discoveredDevice.Frequency, out var frequencies))
                {
                    var existingDevice = _devicesViewModel.Devices.FirstOrDefault(d => d.SerialNumber == discoveredDevice.SerialNumber);
                    if (existingDevice != null)
                    {
                        Debug.WriteLine($"Device with SerialNumber {discoveredDevice.SerialNumber} already exists.");
                        continue; 
                    }
                    var device = CastDeviceDiscoveredToRFDevice(discoveredDevice);

                    try
                    {
                        _devicesViewModel.SaveDataDevicesInfo(device);
                        _devicesViewModel.SaveDataChannelsInfo(device);
                        device.IsOnline = true;
                        device.IsSynced = true;
                        var clonedDevice = device.Clone();
                        _devicesViewModel.OperatingDevice = clonedDevice;
                        await _devicesViewModel.SaveDeviceAsync();
                        await SyncFromDevice(device);
                        await _discoveryService.CheckDeviceSync(device);
                    }
                    catch (Exception ex)
                    {
                        var errorMessage = $"Error syncing device {device.Name} (IP: {device.IpAddress}): {ex.Message}";
                        Debug.WriteLine(errorMessage);
                        errors.Add(errorMessage);
                    }
                }
            }
            return errors;
        }


        public async Task<List<string>> SyncAllToDevice()
        {
            var errors = new List<string>();
            var devices = _devicesViewModel.Devices;

            foreach (RFDevice d in devices)
            {
                if (d.IsSynced)
                {
                    try
                    {
                        await SyncToDevice(d);
                    }
                    catch (Exception ex)
                    {
                        var errorMessage = $"Error syncing device {d.Name} (IP: {d.IpAddress}): {ex.Message}";
                        Debug.WriteLine(errorMessage);
                        errors.Add(errorMessage);
                    }
                    await _discoveryService.CheckDeviceSync(d);

                }
            }

            return errors;
        }

        private async Task<DeviceDiscoveredEventArgs> FetchDeviceData(RFDevice offlineDevice)
        {
            var handler = _deviceHandlers.FirstOrDefault(h => h.Brand == offlineDevice.Brand);
            if (handler == null)
            {
                throw new Exception($"No handler found for brand {offlineDevice.Brand}");
            }

            var deviceInfo = new DeviceDiscoveredEventArgs
            {
                Name = offlineDevice.Name,
                Brand = offlineDevice.Brand,
                Type = offlineDevice.Model,
                SerialNumber = offlineDevice.SerialNumber,
                IPAddress = offlineDevice.IpAddress,
                Frequency = offlineDevice.Frequency,
                Channels = offlineDevice.Channels.Select(c => new DeviceDiscoveredEventArgs.ChannelInfo
                {
                    ChannelNumber = c.chanNumber,
                    Name = c.ChannelName,
                    Frequency = c.Frequency.ToString()
                }).ToList()
            };

            await handler.HandleDevice(deviceInfo);
            return deviceInfo;
        }
    }
}
