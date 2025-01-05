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
        private readonly IDeviceCommandSet _commandSet;
        private readonly int Port = 45;
        public SennheiserDeviceHandler(UDPCommunicationService communicationService, IDeviceCommandSet commandSet)
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


            var modelCommand = _commandSet.GetModelCommand();
            var modelResponse = await _communicationService.SendCommandAsync(ip, Port, modelCommand);
            string modelName = ExtractValue(modelResponse, "device", "identity", "product");
            deviceInfo.Type = modelName;

            var frequencyCommand = _commandSet.GetFrequencyCodeCommand();
            var frequencyResponse = await _communicationService.SendCommandAsync(ip, Port, frequencyCommand);
            string frequencyName = ExtractValue(frequencyResponse, "device", "frequency_code");
            deviceInfo.Frequency = frequencyName;

            var serialCommand = _commandSet.GetSerialCommand();
            var serialResponse = await _communicationService.SendCommandAsync(ip, Port, serialCommand);
            string serialName = ExtractValue(serialResponse, "device", "identity", "serial");
            deviceInfo.SerialNumber = serialName;

            for (int channel = 1; channel <= 2; channel++)
            {
                // A FAIRE : FAIRE UNE METHODE POUR RECUPERER LES COMMANDES ET UN POUR LES ENVOYER, ici on utilise en double dans IsDeviceSynced et ici..
                var nameCommand = _commandSet.GetChannelNameCommand(channel);
                var nameResponse = await _communicationService.SendCommandAsync(ip, Port, nameCommand);

                var freqCommand = _commandSet.GetChannelFrequencyCommand(channel);
                var freqResponse = await _communicationService.SendCommandAsync(ip, Port, freqCommand);

                string channelName = ExtractValue(nameResponse, $"rx{channel}", "name");
                string channelFrequency = ExtractValue(freqResponse, $"rx{channel}", "frequency");

                deviceInfo.Channels.Add(new DeviceDiscoveredEventArgs.ChannelInfo
                {
                    ChannelNumber = channel,
                    Name = channelName,
                    Frequency = channelFrequency
                });
            }
        }

        public async Task<bool> IsDeviceSync(DeviceDiscoveredEventArgs deviceInfo)
        {
            if (deviceInfo.IPAddress == null)
            {
                Debug.WriteLine("No IP addresses found for the device.");
                return false;
            }

            var ip = deviceInfo.IPAddress;

            var serialCommand = _commandSet.GetSerialCommand();
            var serialResponse = await _communicationService.SendCommandAsync(ip, Port, serialCommand);
            Debug.Print("Réponse du device : " + serialResponse);
            string serialNumber = ExtractValue(serialResponse, "device", "identity", "serial");

            if (serialNumber != deviceInfo.SerialNumber)
            {
                return false;
            }

            for (int channel = 1; channel <= 2; channel++)
            {
                var freqCommand = _commandSet.GetChannelFrequencyCommand(channel);
                var freqResponse = await _communicationService.SendCommandAsync(ip, Port, freqCommand);
                string channelFrequency = ExtractValue(freqResponse, $"rx{channel}", "frequency");
                Debug.Print("Réponse du device : " + channelFrequency);

                var nameCommand = _commandSet.GetChannelNameCommand(channel);
                var nameResponse = await _communicationService.SendCommandAsync(ip, Port, nameCommand);
                string channelName = ExtractValue(nameResponse, $"rx{channel}", "name");
                Debug.Print("Réponse du device : " + channelName);

                var channelInfo = deviceInfo.Channels.FirstOrDefault(c => c.ChannelNumber == channel);
                if (channelInfo != null && channelInfo.Frequency != channelFrequency || channelInfo.Name != channelName)
                {
                    return false;
                }
            }

            return true;
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
    }
}
