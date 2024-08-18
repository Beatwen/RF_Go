using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace RF_Go.Models
{
    public class TimePeriod
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }
        
        private string _name = "Unnamed Timeperiod";
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
        private DateTime _startTime;
        private DateTime _endTime;
        public DateTime StartTime
        {
            get => _startTime;
            set
            {
                if (_endTime != default(DateTime) && value >= _endTime)
                {
                    throw new ArgumentException("Start time must be less than end time.");
                }
                _startTime = value;
            }
        }

        public DateTime EndTime
        {
            get => _endTime;
            set
            {
                if (_startTime != default(DateTime) && value <= _startTime)
                {
                    throw new ArgumentException("End time must be greater than start time.");
                }
                _endTime = value;
            }
        }
        public TimePeriod(DateTime start, DateTime end)
        {
            StartTime = start;
            EndTime = end; 
        }
        public override string ToString()
        {
            return $"{StartTime} to {EndTime}";
        }
    }
}
