
using System.ComponentModel;
using SQLite;
using System;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Threading.Channels;
using System.Text.Json;


namespace RF_Go.Models
{
    public class RFDeviceService
    {
        public List<RFDevice> Devices { get; set; } = new List<RFDevice>();
    }
    public class RFDevice : INotifyPropertyChanged
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }
        public string SerialNumber { get; set; } = null;
        public bool Selected { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Name { get; set; }
        public string Frequency { get; set; }
        [Ignore]
        public List<int> Range { get; set; }
        public string RangeSerialized
        {
            get => JsonSerializer.Serialize(Range);
            set => Range = JsonSerializer.Deserialize<List<int>>(value);
        }
        [Ignore]
        public List<RFChannel> Channels { get; set; } = new List<RFChannel>();
        public string ChannelsSerialized
        {
            get => JsonSerializer.Serialize(Channels);
            set => Channels = JsonSerializer.Deserialize<List<RFChannel>>(value);
        }
        public string IpAddress { get; set; } = "0.0.0.0";
        public string Calendar { get; set; }
        public string Stage { get; set; }
        private bool _isSynced;
        public bool IsSynced
        {
            get => _isSynced;
            set
            {
                if (_isSynced != value)
                {
                    _isSynced = value;
                    OnPropertyChanged(nameof(IsSynced));
                }
            }
        }
        private bool _isOnline { get; set; }
        public bool IsOnline
        {
            get => _isOnline;
            set
            {
                if (_isOnline != value)
                {
                    _isOnline = value;
                    OnPropertyChanged(nameof(IsOnline));
                }
            }
        }

        private bool _pendingSync;
        public bool PendingSync
        {
            get => _pendingSync;
            set
            {
                if (_pendingSync != value)
                {
                    _pendingSync = value;
                    OnPropertyChanged(nameof(PendingSync));
                }
            }
        }
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

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
            Debug.Print("property changed " + propertyName);
        }
    }
}
