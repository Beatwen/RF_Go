using MudBlazor;
using SQLite;

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
            UpdateRange();
        }
    }

    private DateTime _endTime;
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
            UpdateRange();
        }
    }

    // Properties for binding to MudTimePicker
    public TimeSpan? StartTimeSpan
    {
        get => _startTime.TimeOfDay;
        set
        {
            if (value.HasValue)
            {
                _startTime = _startTime.Date + value.Value;
                UpdateRange();
            }
        }
    }

    public TimeSpan? EndTimeSpan
    {
        get => _endTime.TimeOfDay;
        set
        {
            if (value.HasValue)
            {
                _endTime = _endTime.Date + value.Value;
                UpdateRange();
            }
        }
    }

    private DateRange _range;
    public DateRange Range
    {
        get => _range;
        set
        {
            if (value.Start == null || value.End == null)
            {
                throw new ArgumentException("Both start and end must be set.");
            }

            if (value.Start >= value.End)
            {
                value.End = value.Start.Value.AddMinutes(60);
            }

            _startTime = value.Start.Value;
            _endTime = value.End.Value;
            _range = new DateRange(_startTime, _endTime);
        }
    }

    public TimePeriod(DateTime start, DateTime end)
    {
        _startTime = start;
        _endTime = end;
        _range = new DateRange(_startTime, _endTime);
    }

    private void UpdateRange()
    {
        _range = new DateRange(_startTime, _endTime);
    }

    public override string ToString()
    {
        return $"{StartTime} to {EndTime}";
    }
}
