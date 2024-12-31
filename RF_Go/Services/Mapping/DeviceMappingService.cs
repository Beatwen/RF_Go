using RF_Go.Models;
using System.Diagnostics;
using RF_Go.Services.Commands;
using RF_Go.Services.NetworkProtocols;
using System.Threading.Tasks;

namespace RF_Go.Services.Mapping
{
    public class DeviceMappingService
    {
        private readonly UDPCommunicationService _communicationService;
        private readonly IDeviceCommandSet _commandSet;

        public DeviceMappingService(UDPCommunicationService communicationService, IDeviceCommandSet commandSet)
        {
            _communicationService = communicationService;
            _commandSet = commandSet;
        }

        public async Task SyncToDevice(RFDevice offlineDevice, DeviceDiscoveredEventArgs onlineDevice)
        {
            if (offlineDevice == null || onlineDevice == null)
            {
                throw new ArgumentNullException("Device cannot be null");
            }

            var ip = onlineDevice.IPAddress;
            var port = 45;

            var frequencyCommand = _commandSet.GetFrequencyCodeCommand();
            await _communicationService.SendCommandAsync(ip, port, frequencyCommand.Replace("{frequency}", offlineDevice.Frequency));

            foreach (var channel in offlineDevice.Channels)
            {
                var channelFrequencyCommand = _commandSet.GetChannelFrequencyCommand(channel.chanNumber);
                await _communicationService.SendCommandAsync(ip, port, channelFrequencyCommand.Replace("{frequency}", channel.Frequency.ToString()));

                var channelNameCommand = _commandSet.GetChannelNameCommand(channel.chanNumber);
                await _communicationService.SendCommandAsync(ip, port, channelNameCommand.Replace("{name}", channel.ChannelName));
            }
        }

        public static void SyncFromDevice(RFDevice offlineDevice, DeviceDiscoveredEventArgs onlineDevice)
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
                offlineDevice.IpAddress = onlineDevice.IPAddress;
                offlineDevice.SerialNumber = onlineDevice.SerialNumber;


                foreach (var channel in onlineDevice.Channels)
                {
                    Debug.WriteLine($"Channel Number: {channel.ChannelNumber}, Name: {channel.Name}, Frequency: {channel.Frequency}");
                    if (offlineDevice.Channels.Count >= channel.ChannelNumber)
                    {
                        offlineDevice.Channels[channel.ChannelNumber - 1].ChannelName = channel.Name;
                        if (int.TryParse(channel.Frequency, out int frequency))
                        {
                            offlineDevice.Channels[channel.ChannelNumber - 1].Frequency = frequency;
                        }
                        else
                        {
                            Debug.WriteLine($"Failed to parse frequency: {channel.Frequency}");
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
    }
}
