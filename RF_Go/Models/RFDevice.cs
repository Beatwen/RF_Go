
using Newtonsoft.Json;
using SQLite;
using System;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Threading.Channels;


namespace RF_Go.Models
{
    public class RFDeviceService
    {
        public List<RFDevice> Devices { get; set; } = new List<RFDevice>();
    }
    public class RFDevice
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }
        public bool Selected { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Name { get; set; }
        public string Frequency { get; set; }
        [Ignore]
        public List<int> Range { get; set; }
        public string RangeSerialized
        {
            get => JsonConvert.SerializeObject(Range);
            set => Range = JsonConvert.DeserializeObject<List<int>>(value);
        }
        [Ignore]
        public List<RFChannel> Channels { get; set; } = new List<RFChannel>();
        public string ChannelsSerialized
        {
            get => JsonConvert.SerializeObject(Channels);
            set => Channels = JsonConvert.DeserializeObject<List<RFChannel>>(value);
        }
        public string IpAddress { get; set; }
        public string Calendar { get; set; }
        public string Stage { get; set; }
        public int NumberOfChannels { get; set; }
        private int _groupID = 1;
        public int GroupID
        {
            get => _groupID;
            set => _groupID = value;
        }
        [Ignore]
        public RFGroup Group { get; set; }

        public int Step { get; set; }

        public RFDevice Clone() => MemberwiseClone() as RFDevice;

        public (bool IsValid, string ErrorMessage) Validate()
        {
            if (string.IsNullOrWhiteSpace(Brand))
            {
                return (false, $"{nameof(ID)} brand is required.");
            }
            return (true, string.Empty);
        }


    }   
}
