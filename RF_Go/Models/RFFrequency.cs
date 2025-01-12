using SQLite;

public class FrequencyData
{
    public HashSet<int> UsedFrequencies { get; set; } = [];
    public HashSet<int> TwoTX3rdOrder { get; set; } = [];
    public HashSet<int> TwoTX5rdOrder { get; set; } = [];
    public HashSet<int> TwoTX7rdOrder { get; set; } = [];
    public HashSet<int> TwoTX9rdOrder { get; set; } = [];
    public HashSet<int> ThreeTX3rdOrder { get; set; } = [];
}
