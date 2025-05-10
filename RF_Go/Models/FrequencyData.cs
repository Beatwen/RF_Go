using SQLite;
using System.Collections.Generic;
using System.Text.Json;

namespace RF_Go.Models
{
    public class FrequencyDataService
    {
        public FrequencyData FrequencyData { get; set; }
    }
    public class FrequencyData
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }

        public string Color { get; set; } = "#0000FF";

        [Ignore]
        public HashSet<int> UsedFrequencies { get; set; } = new HashSet<int>();
        public string UsedFrequenciesSerialized
        {
            get => JsonSerializer.Serialize(UsedFrequencies);
            set => UsedFrequencies = JsonSerializer.Deserialize<HashSet<int>>(value);
        }

        [Ignore]
        public HashSet<int> TwoTX3rdOrder { get; set; } = new HashSet<int>();
        public string TwoTX3rdOrderSerialized
        {
            get => JsonSerializer.Serialize(TwoTX3rdOrder);
            set => TwoTX3rdOrder = JsonSerializer.Deserialize<HashSet<int>>(value);
        }

        [Ignore]
        public HashSet<int> TwoTX5rdOrder { get; set; } = new HashSet<int>();
        public string TwoTX5rdOrderSerialized
        {
            get => JsonSerializer.Serialize(TwoTX5rdOrder);
            set => TwoTX5rdOrder = JsonSerializer.Deserialize<HashSet<int>>(value);
        }

        [Ignore]
        public HashSet<int> TwoTX7rdOrder { get; set; } = new HashSet<int>();
        public string TwoTX7rdOrderSerialized
        {
            get => JsonSerializer.Serialize(TwoTX7rdOrder);
            set => TwoTX7rdOrder = JsonSerializer.Deserialize<HashSet<int>>(value);
        }

        [Ignore]
        public HashSet<int> TwoTX9rdOrder { get; set; } = new HashSet<int>();
        public string TwoTX9rdOrderSerialized
        {
            get => JsonSerializer.Serialize(TwoTX9rdOrder);
            set => TwoTX9rdOrder = JsonSerializer.Deserialize<HashSet<int>>(value);
        }

        [Ignore]
        public HashSet<int> ThreeTX3rdOrder { get; set; } = new HashSet<int>();
        public string ThreeTX3rdOrderSerialized
        {
            get => JsonSerializer.Serialize(ThreeTX3rdOrder);
            set => ThreeTX3rdOrder = JsonSerializer.Deserialize<HashSet<int>>(value);
        }

        [Ignore]
        public Dictionary<int, FrequencyData> GroupData { get; set; } = new Dictionary<int, FrequencyData>();
        public string GroupDataSerialized
        {
            get => JsonSerializer.Serialize(GroupData);
            set => GroupData = JsonSerializer.Deserialize<Dictionary<int, FrequencyData>>(value);
        }
    }
}