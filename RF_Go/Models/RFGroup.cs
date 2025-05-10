using System.Text.Json;
using SQLite;

namespace RF_Go.Models
{
    public class RFGroup
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }
        private string _name = "Unnamed Group";

        private readonly List<TimePeriod> _timePeriods = [];

        [Ignore]
        public IReadOnlyList<TimePeriod> TimePeriods => _timePeriods;
        public string TimePeriodsSerialized
        {
            get => JsonSerializer.Serialize(_timePeriods);
            set
            {
                var periods = JsonSerializer.Deserialize<List<TimePeriod>>(value);
                if (periods != null)
                {
                    _timePeriods.Clear();
                    _timePeriods.AddRange(periods);
                }
            }
        }

        public void AddTimePeriod(TimePeriod period)
        {
            if (period != null)
            {
                _timePeriods.Add(period);
            }
        }
        public void DeleteTimePeriod(TimePeriod period)
        {
            if (_timePeriods.Contains(period) && period != null)
            {
                _timePeriods.Remove(period);
            }
        }

        public string Name
        {
            get => _name;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new ArgumentException("Name is required.");
                }
                _name = value;
            }
        }
        private readonly List<RFDevice> _devices = [];
        public IReadOnlyList<RFDevice> Devices => _devices;

        public void AddDevice(RFDevice device)
        {
            if (device != null && !_devices.Contains(device))
            {
                _devices.Add(device);
                device.GroupID = this.ID;
            }
        }
        public void RemoveDevice(RFDevice device)
        {
            if (device != null && _devices.Contains(device))
            {
                _devices.Remove(device);
                device.GroupID = this.ID;
            }
        }
        public RFGroup Clone() => MemberwiseClone() as RFGroup;
    }
}
