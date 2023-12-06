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
        public bool FrequencyIsSetup { get; set; }
        public bool Checked { get; set; }
        public string ChannelName { get; set; }
        private bool _isLocked;
        public bool IsLocked 
        {
            get { return _isLocked; }
            set
            {   
                if (Frequency == 0)
                {
                    _isLocked = false;
                }
                else
                {
                    _isLocked = value;
                }
            }
        }

        public RFChannel Clone() => MemberwiseClone() as RFChannel;

    }
}
