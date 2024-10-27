using SQLite;

public class CountryChannelConfig
{
    [PrimaryKey, AutoIncrement]
    public int ID { get; set; }
    public string Country { get; set; }
    public int ChannelWidth { get; set; } 
    public int StartChannel { get; set; } 
    public int EndChannel { get; set; }  
    public string DefaultFrequencyRange { get; set; } 
}
