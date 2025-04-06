using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Services.Commands
{
    public class SennheiserCommandSet : IDeviceCommandSet
    {
        public string GetModelCommand() => @"{""device"":{""identity"":{""product"":null}}}";
        public string GetFrequencyCodeCommand() => @"{""device"":{""frequency_code"":null}}";
        public string GetSerialCommand() => @"{""device"":{""identity"":{""serial"":null}}}";
        public string GetChannelNameCommand(int channel) => $@"{{""rx{channel}"":{{""name"":null}}}}";
        public string GetChannelFrequencyCommand(int channel) => $@"{{""rx{channel}"":{{""frequency"":null}}}}";
        public string GetSignalQualityCommand(int channel) => $@"{{""m"":{{""rx{channel}"":{{""rsqi"":null}}}}}}";
        public string SetChannelFrequencyCommand(int channel, int frequency) => $@"{{""rx{channel}"":{{""frequency"":{frequency}}}}}";
        public string SetChannelNameCommand(int channel, string name) => $@"{{""rx{channel}"":{{""name"":""{name}""}}}}";
        public string SetSignalQualityCommand(int channel, int quality) => $@"{{""m"":{{""rx{channel}"":{{""rsqi"":{quality}}}}}}}";
    }

}
