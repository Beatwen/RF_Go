using Newtonsoft.Json;
using SQLite;


namespace RF_Go.Models
{
    public class RFchannelService
    {
        public List<RFChannel> Channels { get; set; } = new List<RFChannel>();
    }
    public class RFChannel
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }
        public bool Selected { get; set; }
        public int Frequency { get; set; }
        public string ChannelName { get; set; }

        public RFChannel Clone() => MemberwiseClone() as RFChannel;

    }
}
