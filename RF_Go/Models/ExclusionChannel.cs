using SQLite;

public class ExclusionChannel
{
    [PrimaryKey, AutoIncrement]
    public int ID { get; set; }
    public string Country { get; set; }
    public int ChannelNumber { get; set; }
    public float StartFrequency { get; set; }
    public float EndFrequency { get; set; }
    public string Type { get; set; }
    public bool Exclude { get; set; }
    public float ChannelWidth { get; set; }
}
