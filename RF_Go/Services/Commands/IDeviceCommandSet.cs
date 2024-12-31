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
        string GetserialCommand();
        string GetChannelFrequencyCommand(int channel);
        string GetChannelNameCommand(int channel);
        string GetSignalQualityCommand(int channel);
    }
}
