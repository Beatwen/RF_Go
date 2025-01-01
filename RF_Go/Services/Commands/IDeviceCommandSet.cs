using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Services.Commands
{
    public interface IDeviceCommandSet
    {
        string GetModelCommand();
        string GetFrequencyCodeCommand();
        string GetSerialCommand();
        string GetChannelFrequencyCommand(int channel);
        string GetChannelNameCommand(int channel);
        string GetSignalQualityCommand(int channel);
        string SetChannelFrequencyCommand(int channel, int frequency);
        string SetChannelNameCommand(int channel, string name);
        string SetSignalQualityCommand(int channel, int quality);
    }
}
