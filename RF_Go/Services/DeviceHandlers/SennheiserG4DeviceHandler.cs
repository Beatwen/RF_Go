using System.Diagnostics;
using RF_Go.Services.Commands;
using System.Text;
using RF_Go.Services.NetworkProtocols;
using RF_Go.Models;
using System.Text.RegularExpressions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using RF_Go.Data;

namespace RF_Go.Services.DeviceHandlers
{
    public class SennheiserG4DeviceHandler : IDeviceHandler
    {
        private readonly SennheiserG4CommandSet _commandSet;
        private readonly UDPCommunicationService _communicationService;
        private readonly DeviceData _deviceData;

        public string Brand => "Sennheiser";

        public SennheiserG4DeviceHandler(SennheiserG4CommandSet commandSet, UDPCommunicationService communicationService, DeviceData deviceData)
        {
            _commandSet = commandSet ?? throw new ArgumentNullException(nameof(commandSet));
            _communicationService = communicationService ?? throw new ArgumentNullException(nameof(communicationService));
            _deviceData = deviceData ?? throw new ArgumentNullException(nameof(deviceData));
        }

        public bool CanHandle(string serviceName)
        {
            // Be much more specific to ensure we only handle actual G4 devices
            return serviceName.Contains("SR-IEMG4") || 
                   serviceName.Contains("G4 IEM") || 
                   serviceName.EndsWith("G4") ||
                   (serviceName.Contains("G4") && serviceName.Contains("Sennheiser"));
        }

        public async Task HandleDevice(DeviceDiscoveredEventArgs deviceInfo)
        {
            try
            {
                if (string.IsNullOrEmpty(deviceInfo.IPAddress))
                {
                    Debug.WriteLine($"No IP address for device {deviceInfo.Name}");
                    return;
                }

                var frequencyResponse = await _communicationService.SendG4CommandAsync(deviceInfo.IPAddress, _commandSet.GetFrequencyCodeCommand());
                if (frequencyResponse != null)
                {
                    var frequencyMatch = Regex.Match(frequencyResponse, @"RfConfig (\d+) (\d+) (\d+)");
                    if (frequencyMatch.Success)
                    {
                        int minFreq = int.Parse(frequencyMatch.Groups[1].Value);
                        int maxFreq = int.Parse(frequencyMatch.Groups[2].Value);
                        
                        string bandCode = DetermineFrequencyBand(minFreq, maxFreq);
                        deviceInfo.Frequency = bandCode;

                        var nameResponse = await _communicationService.SendG4CommandAsync(deviceInfo.IPAddress, _commandSet.GetChannelNameCommand(1));
                        var nameParts = nameResponse.Split(new[] { ' ' }, 2);
                        string channelName = nameParts[1].Trim();
                                          

                        var chanFrequencyResponse = await _communicationService.SendG4CommandAsync(deviceInfo.IPAddress, _commandSet.GetChannelFrequencyCommand(1));
                        if (chanFrequencyResponse != null)
                        {
                            string chanFrequency = chanFrequencyResponse;
                            var match = Regex.Match(chanFrequencyResponse, @"Frequency (\d+)");
                            if (match.Success)
                            {
                                chanFrequency = match.Groups[1].Value;
                            }
                            else
                            {
                                match = Regex.Match(chanFrequencyResponse, @"(\d+)");
                                if (match.Success)
                                {
                                    chanFrequency = match.Groups[1].Value;
                                }
                            }
                            
                            Debug.WriteLine($"Extracted channel frequency: {chanFrequency} from response: {chanFrequencyResponse}");
                            deviceInfo.Channels.Add(new DeviceDiscoveredEventArgs.ChannelInfo
                            {
                                ChannelNumber = 1,
                                Name = channelName,
                                Frequency = chanFrequency
                            });
                        }
                    }
                }


            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error handling G4 device {deviceInfo.Name}: {ex.Message}");
            }
        }

        private string DetermineFrequencyBand(int minFreq, int maxFreq)
        {
            // G4 devices return raw frequency ranges instead of band labels
            // We need to match these to the known frequency bands
            
            // Check against known bands from device data
            if (_deviceData?.Brands != null && 
                _deviceData.Brands.TryGetValue("Sennheiser", out var brand) &&
                brand.TryGetValue("SR-IEMG4", out var models))
            {
                foreach (var bandEntry in models)
                {
                    string bandName = bandEntry.Key;
                    var bandValues = bandEntry.Value;
                    
                    if (bandValues.Count >= 2)
                    {
                        int bandMin = bandValues[0];
                        int bandMax = bandValues[1];
                        
                        // If there's a close match (within 5MHz), consider it a match
                        if (Math.Abs(bandMin - minFreq) <= 5000 && Math.Abs(bandMax - maxFreq) <= 5000)
                        {
                            return bandName;
                        }
                    }
                }
            }
            
            // If no exact match, return a descriptive range instead
            return $"{minFreq/1000}-{maxFreq/1000}MHz";
        }

        public async Task<(bool IsEqual, bool IsNotResponding)> IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo)
        {
            try
            {
                if (string.IsNullOrEmpty(deviceInfo.IPAddress))
                {
                    Debug.WriteLine($"No IP address for G4 device {deviceInfo.Name}");
                    return (false, true);
                }

                var frequencyResponse = await _communicationService.SendG4CommandAsync(deviceInfo.IPAddress, _commandSet.GetFrequencyCodeCommand());
                if (frequencyResponse == null || string.IsNullOrEmpty(frequencyResponse))
                {
                    Debug.WriteLine($"Device {deviceInfo.Name} not responding");
                    return (false, true); // Device is not responding
                }

                // Process frequency band
                var frequencyMatch = Regex.Match(frequencyResponse, @"RfConfig (\d+) (\d+) (\d+)");
                if (frequencyMatch.Success && frequencyMatch.Groups.Count >= 4)
                {
                    int minFreq = int.Parse(frequencyMatch.Groups[1].Value);
                    int maxFreq = int.Parse(frequencyMatch.Groups[2].Value);
                    int currentFreq = int.Parse(frequencyMatch.Groups[3].Value);
                    
                    // Get the current band based on min/max like in HandleDevice
                    string currentBand = DetermineFrequencyBand(minFreq, maxFreq);
                    
                    // Check if band matches
                    if (currentBand != deviceInfo.Frequency)
                    {
                        Debug.WriteLine($"Band mismatch: current={currentBand}, stored={deviceInfo.Frequency}");
                        return (false, false);
                    }
                    
                    if (deviceInfo.Channels != null && deviceInfo.Channels.Count > 0)
                    {
                        var nameResponse = await _communicationService.SendG4CommandAsync(deviceInfo.IPAddress, _commandSet.GetChannelNameCommand(1));
                        var chanFrequency = await _communicationService.SendG4CommandAsync(deviceInfo.IPAddress, _commandSet.GetChannelFrequencyCommand(1));
                        string currentChannelName = string.Empty;
                        if (nameResponse != null)
                        {
                            var nameParts = nameResponse.Split(new[] { ' ' }, 2);
                            if (nameParts.Length >= 2)
                            {
                                currentChannelName = nameParts[1].Trim();
                            }
                        }
                        else
                        {
                            Debug.WriteLine($"Could not retrieve channel name for {deviceInfo.Name}");
                            return (false, true); // Device stopped responding
                        }

                        foreach (var channel in deviceInfo.Channels)
                        {
                            if (channel.ChannelNumber == 1)
                            {
                                bool frequencyMatches = false;
                                
                                // Extraire la fréquence du canal de la même façon que dans HandleDevice
                                string currentChanFrequency = chanFrequency;
                                var freqMatch = Regex.Match(chanFrequency, @"Frequency (\d+)");
                                if (freqMatch.Success)
                                {
                                    currentChanFrequency = freqMatch.Groups[1].Value;
                                }
                                else
                                {
                                    // Try to extract just the first number if the format is different
                                    freqMatch = Regex.Match(chanFrequency, @"(\d+)");
                                    if (freqMatch.Success)
                                    {
                                        currentChanFrequency = freqMatch.Groups[1].Value;
                                    }
                                }
                                
                                // Comparer avec la fréquence stockée
                                frequencyMatches = channel.Frequency == currentChanFrequency;
                                
                                // Check if name matches
                                bool nameMatches = channel.Name == currentChannelName;
                                
                                Debug.WriteLine($"Channel frequency check: stored={channel.Frequency}, current={currentChanFrequency}, match={frequencyMatches}");
                                Debug.WriteLine($"Channel name check: stored={channel.Name}, current={currentChannelName}, match={nameMatches}");
                                
                                // If either doesn't match, sync is needed
                                if (!frequencyMatches || !nameMatches)
                                {
                                    Debug.WriteLine($"Mismatch detected - Frequency match: {frequencyMatches}, Name match: {nameMatches}");
                                    return (false, false);
                                }
                            }
                        }
                    }
                    else
                    {
                        // No channels stored, can't be equal
                        return (false, false);
                    }
                }
                else
                {
                    Debug.WriteLine($"Could not parse frequency response: {frequencyResponse}");
                    return (false, false);
                }

                // If we got here, everything matches
                return (true, false);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error checking G4 device sync status for {deviceInfo.Name}: {ex.Message}");
                return (false, true);
            }
        }

        public async Task<List<string>> SyncToDevice(DeviceDiscoveredEventArgs deviceInfo)
        {
            var errors = new List<string>();
            
            if (string.IsNullOrEmpty(deviceInfo.IPAddress))
            {
                Debug.WriteLine($"No IP address for G4 device {deviceInfo.Name}");
                errors.Add("No IP address found for the device.");
                return errors;
            }

            try
            {
                var channel = deviceInfo.Channels.FirstOrDefault(c => c.ChannelNumber == 1);
                if (channel == null)
                {
                    Debug.WriteLine("No channel 1 found in device info");
                    errors.Add("No channel information found for G4 device.");
                    return errors;
                }

                // Set channel frequency
                if (!string.IsNullOrEmpty(channel.Frequency) && int.TryParse(channel.Frequency, out int frequency))
                {
                    var frequencyCommand = _commandSet.SetChannelFrequencyCommand(1, frequency);
                    var frequencyResponse = await _communicationService.SendG4CommandAsync(deviceInfo.IPAddress, frequencyCommand);
                    Debug.WriteLine($"G4 frequency set response: {frequencyResponse}");
                    
                    // Check for errors in response
                    if (string.IsNullOrEmpty(frequencyResponse) || frequencyResponse.Contains("error") || frequencyResponse.Contains("Error"))
                    {
                        errors.Add($"Error setting frequency: {frequencyResponse ?? "No response"}");
                    }
                }
                else
                {
                    errors.Add($"Invalid frequency format: {channel.Frequency}");
                }

                // Set channel name
                if (!string.IsNullOrEmpty(channel.Name))
                {
                    // Validate channel name
                    var validChannelName = channel.Name;
                    // G4 has different name constraints than standard Sennheiser
                    if (validChannelName.Length > 12) // G4 supports longer names
                    {
                        validChannelName = validChannelName.Substring(0, 12);
                        Debug.WriteLine($"Channel name truncated to 12 characters: {validChannelName}");
                    }
                    
                    var nameCommand = _commandSet.SetChannelNameCommand(1, validChannelName);
                    var nameResponse = await _communicationService.SendG4CommandAsync(deviceInfo.IPAddress, nameCommand);
                    Debug.WriteLine($"G4 name set response: {nameResponse}");
                    
                    // Check for errors in response
                    if (string.IsNullOrEmpty(nameResponse) || nameResponse.Contains("error") || nameResponse.Contains("Error"))
                    {
                        errors.Add($"Error setting name: {nameResponse ?? "No response"}");
                    }
                }

                // If we have any other channels in the device info, log a warning
                if (deviceInfo.Channels.Count > 1)
                {
                    Debug.WriteLine($"Warning: G4 device only supports 1 channel, but {deviceInfo.Channels.Count} channels were provided.");
                }

                Debug.WriteLine($"G4 sync completed for device at {deviceInfo.IPAddress}");
                return errors;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during G4 sync to device: {ex.Message}");
                errors.Add($"Exception during sync: {ex.Message}");
                return errors;
            }
        }
    }
} 