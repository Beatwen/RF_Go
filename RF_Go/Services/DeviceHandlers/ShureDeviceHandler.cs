using System.Diagnostics;
using RF_Go.Services.Commands;
using System.Text.Json;
using RF_Go.Services.NetworkProtocols;
using RF_Go.Models;


namespace RF_Go.Services.DeviceHandlers
{
    public class ShureDeviceHandler : IDeviceHandler
    {
        public string Brand => "Shure";
        private readonly TCPCommunicationService _communicationService;
        private readonly ShureCommandSet _commandSet;
        private readonly int Port = 2202; 
        
        public ShureDeviceHandler(TCPCommunicationService communicationService, ShureCommandSet commandSet)
        {
            _communicationService = communicationService;
            _commandSet = commandSet;
        }

        public bool CanHandle(string serviceName)
        {
            return serviceName.Contains("Shure") || 
                   serviceName.Contains("ULXD") || 
                   serviceName.Contains("AD4") || 
                   serviceName.Contains("AD610") ||
                   serviceName.Contains("AXT400") ||
                   serviceName.Contains("AXT600") ||
                   serviceName.Contains("AXT610") ||
                   serviceName.Contains("AXT630") ||
                   serviceName.Contains("AXT631") ||
                   serviceName.Contains("AXT900") ||
                   serviceName.Contains("P10T") ||
                   serviceName.Contains("SBRC") ||
                   serviceName.Contains("SBC220") ||
                   serviceName.Contains("SBC240") ||
                   serviceName.Contains("SBC840") ||
                   serviceName.Contains("SBC840M") ||
                   serviceName.Contains("PSM1000") || 
                   serviceName.Contains("UR4D");
        }

        public async Task HandleDevice(DeviceDiscoveredEventArgs deviceInfo)
        {
            Debug.WriteLine($"Handling Shure device: {deviceInfo.Name}");

            if (deviceInfo.IPAddress == null)
            {
                Debug.WriteLine("No IP addresses found for the device.");
                return;
            }

            var ip = deviceInfo.IPAddress;

            // Get model name
            var modelResponse = await _communicationService.SendCommandAsync(ip, Port, _commandSet.GetModelCommand());
            Debug.WriteLine($"Model response: {modelResponse}");
            
            // Parse model from response (format: < REP MODEL {string} >)
            var modelName = ExtractValueFromResponse(modelResponse, "MODEL");
            if (!string.IsNullOrEmpty(modelName))
            {
                deviceInfo.Type = modelName.Trim();
            }

            // Get serial number (via NET_SETTINGS command)
            var serialResponse = await _communicationService.SendCommandAsync(ip, Port, _commandSet.GetSerialCommand());
            var serialNumber = ExtractValueFromResponse(serialResponse, "NET_SETTINGS");
            if (!string.IsNullOrEmpty(serialNumber))
            {
                // Extract MAC address from the end of the response
                // Format: "< REP NET_SETTINGS SC AUTO 192.168.000.036 255.255.255.000 192.168.000.001 00:0E:DD:49:11:C9 >"
                int lastSpaceIndex = serialNumber.LastIndexOf(' ');
                if (lastSpaceIndex > 0)
                {
                    // Get the MAC address and remove colons
                    deviceInfo.SerialNumber = serialNumber.Substring(lastSpaceIndex + 1).Replace(":", "");
                }
            }

            // Determine channel count based on model
            int channelCount = 2; 
            if (deviceInfo.Type?.Contains("ULXD4Q") == true || deviceInfo.Type?.Contains("AD4Q") == true)
            {
                channelCount = 4;
            }
            else if (deviceInfo.Type?.Contains("ULXD4D") == true || deviceInfo.Type?.Contains("AD4D") == true)
            {
                channelCount = 2;
            }
            else if (deviceInfo.Type?.Equals("ULXD4") == true)
            {
                channelCount = 1;
            }

            // Get channel info
            for (int channel = 1; channel <= channelCount; channel++)
            {
                var channelNameCommand = _commandSet.GetChannelNameCommand(channel);
                var channelNameResponse = await _communicationService.SendCommandAsync(ip, Port, channelNameCommand);
                var channelName = ExtractChannelValueFromResponse(channelNameResponse, channel, "CHAN_NAME");
                
                var freqCommand = _commandSet.GetChannelFrequencyCommand(channel);
                var freqResponse = await _communicationService.SendCommandAsync(ip, Port, freqCommand);
                var channelFrequency = ExtractChannelValueFromResponse(freqResponse, channel, "FREQUENCY");

                deviceInfo.Channels.Add(new DeviceDiscoveredEventArgs.ChannelInfo
                {
                    ChannelNumber = channel,
                    Name = channelName.Trim(),
                    Frequency = channelFrequency
                });
            }
        }


        public async Task<(bool IsEqual, bool IsNotResponding)> IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo)
        {
            if (deviceInfo.IPAddress == null)
            {
                Debug.WriteLine("No IP addresses found for the device.");
                return (false, false);
            }

            var ip = deviceInfo.IPAddress;

            // Check device responsiveness first by requesting serial number
            var serialResponse = await _communicationService.SendCommandAsync(ip, Port, _commandSet.GetSerialCommand());
            if (string.IsNullOrEmpty(serialResponse) || !serialResponse.Contains("REP"))
            {
                Debug.WriteLine("Device not responding or invalid response format.");
                return (false, true);  // Not responding
            }

            // Check if any channels need sync
            foreach (var channelInfo in deviceInfo.Channels)
            {
                // Get current channel frequency
                var freqCommand = _commandSet.GetChannelFrequencyCommand(channelInfo.ChannelNumber);
                var freqResponse = await _communicationService.SendCommandAsync(ip, Port, freqCommand);
                var currentFreq = ExtractChannelValueFromResponse(freqResponse, channelInfo.ChannelNumber, "FREQUENCY");
                
                // Get current channel name
                var nameCommand = _commandSet.GetChannelNameCommand(channelInfo.ChannelNumber);
                var nameResponse = await _communicationService.SendCommandAsync(ip, Port, nameCommand);
                var currentName = ExtractChannelValueFromResponse(nameResponse, channelInfo.ChannelNumber, "CHAN_NAME");
                
                // Compare with expected values
                if (channelInfo.Frequency != currentFreq || channelInfo.Name != currentName.Trim())
                {
                    Debug.WriteLine($"Channel {channelInfo.ChannelNumber} needs sync: freq={channelInfo.Frequency}/{currentFreq}, name={channelInfo.Name}/{currentName}");
                    return (false, false);  // Needs sync
                }
            }

            return (true, false);  // All in sync
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
                    // Set channel frequency
                    if (!string.IsNullOrEmpty(channel.Frequency))
                    {
                        var freqValue = channel.Frequency;
                        // Parse frequency string that might be in various formats
                        try
                        {
                            int frequency;
                            
                            // Handle possible MHz format (with decimal point)
                            if (freqValue.Contains(".") && double.TryParse(freqValue, out double freqMHz))
                            {
                                // Convert MHz to kHz
                                frequency = (int)(freqMHz * 1000);
                            }
                            else
                            {
                                frequency = int.Parse(freqValue);
                            }
                            
                            var frequencyCommand = _commandSet.SetChannelFrequencyCommand(channel.ChannelNumber, frequency);
                            var frequencyResponse = await _communicationService.SendCommandAsync(ip, Port, frequencyCommand);
                            Debug.WriteLine($"Frequency set response for channel {channel.ChannelNumber}: {frequencyResponse}");
                            
                            if (frequencyResponse.Contains("ERR"))
                            {
                                errors.Add($"Error setting frequency for channel {channel.ChannelNumber}: {frequencyResponse}");
                            }
                        }
                        catch (FormatException)
                        {
                            Debug.WriteLine($"Unable to parse frequency value: {freqValue}");
                            errors.Add($"Invalid frequency format for channel {channel.ChannelNumber}: {freqValue}");
                        }
                    }
                    else
                    {
                        errors.Add($"Invalid frequency format for channel {channel.ChannelNumber}: {channel.Frequency}");
                    }

                    // Set channel name
                    if (!string.IsNullOrEmpty(channel.Name))
                    {
                        var nameCommand = _commandSet.SetChannelNameCommand(channel.ChannelNumber, channel.Name);
                        var nameResponse = await _communicationService.SendCommandAsync(ip, Port, nameCommand);
                        Debug.WriteLine($"Name set response for channel {channel.ChannelNumber}: {nameResponse}");
                        
                        // Check for errors in response
                        if (nameResponse.Contains("ERR"))
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
                errors.Add($"Exception during sync: {ex.Message}`");
                return errors;
            }
        }

        private string ExtractValueFromResponse(string response, string command)
        {
            try
            {
                if (string.IsNullOrEmpty(response))
                    return string.Empty;
                    
                // Format: < REP COMMAND value > or < REP COMMAND {value} >
                string pattern = @"<\s*REP\s+" + command + @"\s+(?:\{([^}]*)\}|([^\s>]+))";
                var match = System.Text.RegularExpressions.Regex.Match(response, pattern);
                
                if (match.Success)
                {
                    // If the value is in braces {}, return group 1, otherwise group 2
                    return match.Groups[1].Success ? match.Groups[1].Value : match.Groups[2].Value;
                }
                
                // For more complex responses like NET_SETTINGS
                if (command == "NET_SETTINGS" && response.Contains("NET_SETTINGS"))
                {
                    // Extract all content after NET_SETTINGS
                    int startIndex = response.IndexOf("NET_SETTINGS") + "NET_SETTINGS".Length;
                    int endIndex = response.LastIndexOf(">");
                    if (endIndex > startIndex)
                    {
                        return response.Substring(startIndex, endIndex - startIndex).Trim();
                    }
                }
                
                Debug.WriteLine($"Could not extract {command} from: {response}");
                return string.Empty;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error extracting {command} from response: {ex.Message}");
                return string.Empty;
            }
        }

        private string ExtractChannelValueFromResponse(string response, int channel, string command)
        {
            try
            {
                if (string.IsNullOrEmpty(response))
                    return string.Empty;
                
                // Format: < REP x COMMAND value > or < REP x COMMAND {value} >
                string pattern = @"<\s*REP\s+" + channel.ToString() + @"\s+" + command + @"\s+(?:\{([^}]*)\}|([^\s>]+))";
                var match = System.Text.RegularExpressions.Regex.Match(response, pattern);
                
                if (match.Success)
                {
                    // If the value is in braces {}, return group 1, otherwise group 2
                    return match.Groups[1].Success ? match.Groups[1].Value : match.Groups[2].Value;
                }
                
                Debug.WriteLine($"Could not extract channel {channel} {command} from: {response}");
                return string.Empty;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error extracting channel {channel} {command} from response: {ex.Message}");
                return string.Empty;
            }
        }
    }
} 