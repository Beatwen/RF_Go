using System.Diagnostics;
using RF_Go.Services.Commands;
using System.Text.Json;
using RF_Go.Services.NetworkProtocols;
using RF_Go.Models;

namespace RF_Go.Services.DeviceHandlers
{
    public class SennheiserDeviceHandler : IDeviceHandler
    {
        public string Brand => "Sennheiser";
        private readonly UDPCommunicationService _communicationService;
        private readonly SennheiserCommandSet _commandSet;
        private readonly int Port = 45;
        public SennheiserDeviceHandler(UDPCommunicationService communicationService, SennheiserCommandSet commandSet)
        {
            _communicationService = communicationService;
            _commandSet = commandSet;
        }

        public bool CanHandle(string serviceName)
        {
            return serviceName.Contains("_ssc");
        }

        public async Task HandleDevice(DeviceDiscoveredEventArgs deviceInfo)
        {
            Debug.WriteLine($"Handling Sennheiser device: {deviceInfo.Name}");

            if (deviceInfo.IPAddress == null)
            {
                Debug.WriteLine("No IP addresses found for the device.");
                return;
            }

            var ip = deviceInfo.IPAddress;

            var modelName = await SendCommandAndExtractValueAsync(ip, Port, _commandSet.GetModelCommand(), "device", "identity", "product");
            deviceInfo.Type = modelName;

            var frequencyName = await SendCommandAndExtractValueAsync(ip, Port, _commandSet.GetFrequencyCodeCommand(), "device", "frequency_code");
            deviceInfo.Frequency = frequencyName;

            var serialName = await SendCommandAndExtractValueAsync(ip, Port, _commandSet.GetSerialCommand(), "device", "identity", "serial");
            deviceInfo.SerialNumber = serialName;

            for (int channel = 1; channel <= 2; channel++)
            {
                var channelName = await SendCommandAndExtractValueAsync(ip, Port, _commandSet.GetChannelNameCommand(channel), $"rx{channel}", "name");
                var channelFrequency = await SendCommandAndExtractValueAsync(ip, Port, _commandSet.GetChannelFrequencyCommand(channel), $"rx{channel}", "frequency");

                deviceInfo.Channels.Add(new DeviceDiscoveredEventArgs.ChannelInfo
                {
                    ChannelNumber = channel,
                    Name = channelName,
                    Frequency = channelFrequency
                });
            }
        }

        public async Task<(bool IsEqual,bool IsNotResponding)> IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo)
        {
            if (deviceInfo.IPAddress == null)
            {
                Debug.WriteLine("No IP addresses found for the device.");
                return (false,false);
            }

            var ip = deviceInfo.IPAddress;

            var serialNumber = await SendCommandAndExtractValueAsync(ip, Port, _commandSet.GetSerialCommand(), "device", "identity", "serial");
            Debug.Print("Réponse du device : " + serialNumber);
            if (serialNumber == null)
            {
                return (false, true);
            }
            if (serialNumber == string.Empty)
            {// A FAIRE : on await mais si on a pas réponse en fait on fait rien... Donc faut set le true différemment!
                return (false,true);
            }
            

            for (int channel = 1; channel <= 2; channel++)
            {
                var channelFrequency = await SendCommandAndExtractValueAsync(ip, Port, _commandSet.GetChannelFrequencyCommand(channel), $"rx{channel}", "frequency");

                var channelName = await SendCommandAndExtractValueAsync(ip, Port, _commandSet.GetChannelNameCommand(channel), $"rx{channel}", "name");

                var channelInfo = deviceInfo.Channels.FirstOrDefault(c => c.ChannelNumber == channel);
                if (channelInfo != null && (channelInfo.Frequency != channelFrequency || channelInfo.Name != channelName))
                {
                    return (false, false);
                }
            }

            return (true, false);
        }

        public async Task<List<string>> SyncToDevice(DeviceDiscoveredEventArgs deviceInfo)
        {
            var errors = new List<string>();
            
            if (deviceInfo.IPAddress == null)
            {
                Debug.WriteLine("No IP addresses found for the device.");
                errors.Add("No IP address found for the device.");
                return errors;
            }

            var ip = deviceInfo.IPAddress;

            try
            {
                foreach (var channel in deviceInfo.Channels)
                {
                    if (channel.ChannelNumber < 1 || channel.ChannelNumber > 2)
                    {
                        errors.Add($"Invalid channel number: {channel.ChannelNumber}. Sennheiser devices support channels 1-2.");
                        continue;
                    }

                    // Set channel frequency
                    if (!string.IsNullOrEmpty(channel.Frequency) && int.TryParse(channel.Frequency, out int frequency))
                    {
                        var frequencyCommand = _commandSet.SetChannelFrequencyCommand(channel.ChannelNumber, frequency);
                        var frequencyResponse = await _communicationService.SendCommandAsync(ip, Port, frequencyCommand);
                        Debug.WriteLine($"Frequency set response for channel {channel.ChannelNumber}: {frequencyResponse}");
                        
                        // Check for errors in response
                        if (frequencyResponse.Contains("error") || frequencyResponse.Contains("Error"))
                        {
                            errors.Add($"Error setting frequency for channel {channel.ChannelNumber}: {frequencyResponse}");
                        }
                    }
                    else
                    {
                        errors.Add($"Invalid frequency format for channel {channel.ChannelNumber}: {channel.Frequency}");
                    }

                    // Set channel name
                    if (!string.IsNullOrEmpty(channel.Name))
                    {
                        // Validate channel name
                        var validChannelName = channel.Name;
                        // Truncate if too long
                        if (validChannelName.Length > 8)
                        {
                            validChannelName = validChannelName.Substring(0, 8);
                            Debug.WriteLine($"Channel name truncated to 8 characters: {validChannelName}");
                        }
                        
                        var nameCommand = _commandSet.SetChannelNameCommand(channel.ChannelNumber, validChannelName);
                        var nameResponse = await _communicationService.SendCommandAsync(ip, Port, nameCommand);
                        Debug.WriteLine($"Name set response for channel {channel.ChannelNumber}: {nameResponse}");
                        
                        // Check for errors in response
                        if (nameResponse.Contains("error") || nameResponse.Contains("Error"))
                        {
                            errors.Add($"Error setting name for channel {channel.ChannelNumber}: {nameResponse}");
                        }
                    }
                }

                Debug.WriteLine($"Sync completed for device at {ip}");
                return errors;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during sync to device: {ex.Message}");
                errors.Add($"Exception during sync: {ex.Message}");
                return errors;
            }
        }

        private string ExtractValue(string json, params string[] keys)
        {
            try
            {
                using var jsonDoc = JsonDocument.Parse(json);
                var element = jsonDoc.RootElement;
                foreach (var key in keys)
                {
                    if (element.TryGetProperty(key, out var childElement))
                    {
                        element = childElement;
                    }
                    else
                    {
                        Debug.WriteLine($"Key '{key}' not found in JSON.");
                        Debug.WriteLine(json);
                        return string.Empty;
                    }
                }
                return element.ValueKind == JsonValueKind.String ? element.GetString() : element.ToString();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error parsing JSON: {ex.Message}");
                return string.Empty;
            }
        }
        private async Task<string> SendCommandAndExtractValueAsync(string ip, int port, string command, params string[] keys)
        {
            var response = await _communicationService.SendCommandAsync(ip, port, command);
            return ExtractValue(response, keys);
        }

    }
}
