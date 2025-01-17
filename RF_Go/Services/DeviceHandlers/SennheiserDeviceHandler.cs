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
            if (serialNumber == string.Empty)
            {// A FAIRE : on await mais si on a pas réponse en fait on fait rien... Donc faut set le true différemment!
                return (false,true);
            }
            if (serialNumber != deviceInfo.SerialNumber)
            {
                return (false,false);
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
