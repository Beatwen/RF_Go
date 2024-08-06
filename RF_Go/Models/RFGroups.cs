using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace RF_Go.Models
{
    public class RFGroup
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }

        private string _name = "Unnamed Group";
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
    }
}
