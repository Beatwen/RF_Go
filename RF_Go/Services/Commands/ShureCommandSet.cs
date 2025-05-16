using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.Services.Commands
{
    public class ShureCommandSet : IDeviceCommandSet
    {
        public string GetModelCommand() => "< GET MODEL >";
        public string GetFrequencyCodeCommand() => ""; // Pas applicable, Shure ne retourne pas un code de fréquence mais la fréquence elle-même
        public string GetSerialCommand() => "< GET NET_SETTINGS sc >";
        public string GetChannelNameCommand(int channel) => $"< GET {channel} CHAN_NAME >";
        public string GetChannelFrequencyCommand(int channel) => $"< GET {channel} FREQUENCY >";
        public string GetSignalQualityCommand(int channel) => $"< GET {channel} RX_RF_LVL >";
        public string GetMuteCommand(int channel) => $"< GET {channel} AUDIO_MUTE >";
        public string GetSensitivityCommand(int channel) => ""; // Non disponible
        public string GetModeCommand(int channel) => $"< GET FREQUENCY_DIVERSITY_MODE >"; // Global, pas par canal

        public string SetChannelFrequencyCommand(int channel, int frequency) => $"< SET {channel} FREQUENCY {frequency} >";
        public string SetChannelNameCommand(int channel, string name) => $"< SET {channel} CHAN_NAME {{{name}}} >";
        public string SetSignalQualityCommand(int channel, int quality) => ""; // Non modifiable

        public string SetMuteCommand(int channel, bool mute) => $"< SET {channel} AUDIO_MUTE {(mute ? "ON" : "OFF")} >";
        public string SetSensitivityCommand(int channel, int sensitivity) => ""; // Non disponible
        public string SetModeCommand(int channel, bool stereo) => ""; // Non applicable tel quel

        public string GetPushCommand(int timeoutSeconds, int cycleMilliseconds, int updateMode) => ""; // Non applicable chez Shure
        public string GetBankListCommand(int bankNumber) => ""; // Non applicable chez Shure
    }
}
