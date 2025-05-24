using RF_Go.Models;
using System.Diagnostics;
using RF_Go.Services.Commands;
using RF_Go.Services.NetworkProtocols;
using RF_Go.Services.DeviceHandlers;
using RF_Go.Utils.ValidationRules;
using System.Text.Json;
using RF_Go.ViewModels;
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
            if (device == null)
            {
                throw new ArgumentNullException("Device cannot be null");
            }
            try
            {
                RFDevice rfDevice = new ()
                {
                    Name = device.Name,
                    Brand = device.Brand,
                    Frequency = device.Frequency,
                    Model = device.Type,
                    IpAddress = device.IPAddress,
                    SerialNumber = device.SerialNumber,
                    Channels = []
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

        private IDeviceHandler GetAppropriateHandler(RFDevice device)
        {
            if (device == null)
            {
                return null;
            }

            // Prioritize G4 handler for G4 devices
            if (device.Model?.Contains("G4") == true)
            {
                var g4Handler = _deviceHandlers.FirstOrDefault(h => 
                    h.Brand == device.Brand && 
                    h.GetType().Name.Contains("G4"));
                
                if (g4Handler != null)
                {
                    Debug.WriteLine($"Selected G4 handler for device {device.Name}");
                    return g4Handler;
                }
            }

            // Fall back to regular handler by brand
            var regularHandler = _deviceHandlers.FirstOrDefault(h => h.Brand == device.Brand);
            Debug.WriteLine($"Selected regular handler {regularHandler?.GetType().Name} for device {device.Name}");
            return regularHandler;
        }

        public async Task<List<string>> FirstSyncToDevice(RFDevice offlineDevice, RFDevice onlineDevice)
        {
            var errors = new List<string>();

            if (offlineDevice == null || onlineDevice == null)
            {
                throw new ArgumentNullException("Device cannot be null");
            }

            var handler = GetAppropriateHandler(onlineDevice);
            if (handler == null)
            {
                var errorMessage = $"No handler found for brand {onlineDevice.Brand}";
                Debug.WriteLine(errorMessage);
                errors.Add(errorMessage);
                return errors;
            }

            try
            {
                // Create a DeviceDiscoveredEventArgs from the offline device, but with online device's IP
                var deviceInfo = new DeviceDiscoveredEventArgs
                {
                    Name = offlineDevice.Name,
                    Brand = offlineDevice.Brand,
                    Type = offlineDevice.Model,
                    SerialNumber = offlineDevice.SerialNumber,
                    IPAddress = onlineDevice.IpAddress, // Use online device's IP address
                    Frequency = offlineDevice.Frequency,
                    Channels = offlineDevice.Channels.Select(c => new DeviceDiscoveredEventArgs.ChannelInfo
                    {
                        ChannelNumber = c.chanNumber,
                        Name = c.ChannelName,
                        Frequency = c.Frequency.ToString()
                    }).ToList()
                };

                // Use the SyncToDevice method to update the physical device
                var syncErrors = await handler.SyncToDevice(deviceInfo);
                if (syncErrors.Any())
                {
                    errors.AddRange(syncErrors);
                    Debug.WriteLine($"Errors during first sync to device {offlineDevice.Name}: {string.Join(", ", syncErrors)}");
                }
                else
                {
                    Debug.WriteLine($"Device {offlineDevice.Name} synced successfully");
                }
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error syncing device {offlineDevice.Name}: {ex.Message}";
                Debug.WriteLine(errorMessage);
                errors.Add(errorMessage);
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

            var handler = GetAppropriateHandler(offlineDevice);
            if (handler == null)
            {
                var errorMessage = $"No handler found for brand {offlineDevice.Brand}";
                Debug.WriteLine(errorMessage);
                errors.Add(errorMessage);
                return errors;
            }

            try
            {
                // Create a DeviceDiscoveredEventArgs from the offline device
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

                // Use the SyncToDevice method to update the physical device
                var syncErrors = await handler.SyncToDevice(deviceInfo);
                if (syncErrors.Any())
                {
                    errors.AddRange(syncErrors);
                    Debug.WriteLine($"Errors during sync to device {offlineDevice.Name}: {string.Join(", ", syncErrors)}");
                }
                else
                {
                    Debug.WriteLine($"Device {offlineDevice.Name} synced successfully");
                }
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error syncing device {offlineDevice.Name}: {ex.Message}";
                Debug.WriteLine(errorMessage);
                errors.Add(errorMessage);
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
            try
            {
                ArgumentNullException.ThrowIfNull(offlineDevice, nameof(offlineDevice));

                // Find appropriate handler for the device's brand
                var handler = GetAppropriateHandler(offlineDevice);
                if (handler == null)
                {
                    throw new Exception($"No handler found for brand {offlineDevice.Brand}");
                }

                // Create a DeviceDiscoveredEventArgs to fetch device data
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

                // Use the handler to fetch the latest data from the physical device
                await handler.HandleDevice(deviceInfo);

                // Update offline device with data from the physical device
                offlineDevice.Name = deviceInfo.Name;
                offlineDevice.Frequency = deviceInfo.Frequency;
                offlineDevice.IpAddress = deviceInfo.IPAddress;
                offlineDevice.SerialNumber = deviceInfo.SerialNumber;

                // Update channels
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
                Debug.WriteLine("SyncFromDevice completed successfully");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error in SyncFromDevice: {ex.Message}");
                throw;
            }
        }

        public async Task<List<string>> SyncAllFromDevice()
        {
            var errors = new List<string>();
            var discoveredDevices = _discoveryService.DiscoveredDevices.ToList();
            var deviceData = DeviceDataJson.GetDeviceData();

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
                        
                        DevicesViewModel.SaveDataDevicesInfo(device);
                        DevicesViewModel.SaveDataChannelsInfo(device);
                        device.IsOnline = true;
                        device.IsSynced = true;
                        var clonedDevice = device.Clone();
                        _devicesViewModel.OperatingDevice = clonedDevice;
                        
                        await _devicesViewModel.SaveDeviceAsync();
                        
                        var savedDevice = _devicesViewModel.Devices.FirstOrDefault(d => d.SerialNumber == device.SerialNumber);
                        if (savedDevice != null)
                        {
                            device.ID = savedDevice.ID;
                        }
                        
                        await SyncFromDevice(device);
                        await _discoveryService.CheckDeviceSync(device);
                        await _devicesViewModel.UpdateDeviceAsync(device);
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
            // Créer une copie de la collection pour éviter les erreurs d'énumération
            var devicesList = _devicesViewModel.Devices.ToList();

            foreach (RFDevice d in devicesList)
            {
                if (d.IsSynced)
                {
                    try
                    {
                        // Synchroniser le périphérique
                        var syncErrors = await SyncToDevice(d);
                        if (syncErrors.Any())
                        {
                            errors.AddRange(syncErrors);
                        }
                        else
                        {
                            // La synchronisation a réussi, définir explicitement l'état correct
                            d.IsOnline = true;
                            d.PendingSync = false;
                            // Sauvegarder l'état mis à jour
                            await _devicesViewModel.UpdateDeviceAsync(d);
                        }
                    }
                    catch (Exception ex)
                    {
                        var errorMessage = $"Error syncing device {d.Name} (IP: {d.IpAddress}): {ex.Message}";
                        Debug.WriteLine(errorMessage);
                        errors.Add(errorMessage);
                    }
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

        public async Task<bool> IsDevicePendingSync(RFDevice device)
        {
            try
            {
                // Find appropriate handler for the device's brand
                var handler = GetAppropriateHandler(device);
                if (handler == null)
                {
                    Debug.WriteLine($"No handler found for brand {device.Brand}");
                    return false;
                }

                // Create a DeviceDiscoveredEventArgs to check sync status
                var deviceInfo = new DeviceDiscoveredEventArgs
                {
                    Name = device.Name,
                    Brand = device.Brand,
                    Type = device.Model,
                    SerialNumber = device.SerialNumber,
                    IPAddress = device.IpAddress,
                    Frequency = device.Frequency,
                    Channels = device.Channels.Select(c => new DeviceDiscoveredEventArgs.ChannelInfo
                    {
                        ChannelNumber = c.chanNumber,
                        Name = c.ChannelName,
                        Frequency = c.Frequency.ToString()
                    }).ToList()
                };

                // Use the handler's IsDevicePendingSync method to check if sync is needed
                var (isEqual, isNotResponding) = await handler.IsDevicePendingSync(deviceInfo);
                
                // If device is not responding, we can't determine if sync is needed
                if (isNotResponding)
                {
                    Debug.WriteLine($"Device {device.Name} is not responding");
                    return false;
                }
                
                // If isEqual is false, the device needs sync
                return !isEqual;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error checking if device {device.Name} is pending sync: {ex.Message}");
                return false;
            }
        }
    }
}
