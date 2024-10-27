using SQLite;

public class ExclusionChannel
{
    [PrimaryKey, AutoIncrement]
    public int ID { get; set; }
    public string Country { get; set; }
    public int ChannelNumber { get; set; }
    public string StartFrequency { get; set; }
    public string EndFrequency { get; set; }
    public string Type { get; set; }
    public bool Exclude { get; set; }
    public int ChannelWidth { get; set; }
}
