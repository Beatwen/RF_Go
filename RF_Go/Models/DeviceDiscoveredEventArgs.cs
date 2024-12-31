namespace RF_Go.Models
{
    public class DeviceDiscoveredEventArgs : EventArgs
    {
        public string Name { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
        public string SerialNumber { get; set; }
        public string IPAddress { get; set; }
        public string Frequency { get; set; }
        public List<ChannelInfo> Channels { get; set; } = [];
        public bool IsSynced { get; set; } 

        public class ChannelInfo
        {
            public int ChannelNumber { get; set; }
            public string Name { get; set; }
            public string Frequency { get; set; }
        }
    }
}
