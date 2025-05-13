using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace RF_Go.Services.Commands
{
    public class SennheiserG4CommandSet : IDeviceCommandSet
    {
        public string GetModelCommand() => "FirmwareRevision\r";
        public string GetFrequencyCodeCommand() => "RfConfig\r";
        public string GetSerialCommand() => ""; // Non disponible via protocole
        public string GetChannelNameCommand(int channel) => "Name\r";
        public string GetChannelFrequencyCommand(int channel) => "Frequency\r";
        public string GetSignalQualityCommand(int channel) => "AF\r"; // AF contient pic, picHold et mute
        public string GetMuteCommand(int channel) => "Mute\r";
        public string GetSensitivityCommand(int channel) => "Sensitivity\r";
        public string GetModeCommand(int channel) => "Mode\r";

        public string SetChannelFrequencyCommand(int channel, int frequency) => $"Frequency {frequency}\r";
        public string SetChannelNameCommand(int channel, string name) => $"Name {name}\r";
        public string SetSignalQualityCommand(int channel, int quality) => ""; // Pas modifiable

        public string SetMuteCommand(int channel, bool mute) => $"Mute {(mute ? 1 : 0)}\r";
        public string SetSensitivityCommand(int channel, int sensitivity) => $"Sensitivity {sensitivity}\r";
        public string SetModeCommand(int channel, bool stereo) => $"Mode {(stereo ? 1 : 0)}\r";

        public string GetPushCommand(int timeoutSeconds, int cycleMilliseconds, int updateMode)
            => $"Push {timeoutSeconds} {cycleMilliseconds} {updateMode}\r";

        public string GetBankListCommand(int bankNumber) => $"BankList {bankNumber}\r";
    }
}
