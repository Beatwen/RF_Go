using Newtonsoft.Json;
using SQLite;

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

        [Ignore]
        public HashSet<int> UsedFrequencies { get; set; } = new HashSet<int>();
        public string UsedFrequenciesSerialized
        {
            get => JsonConvert.SerializeObject(UsedFrequencies);
            set => UsedFrequencies = JsonConvert.DeserializeObject<HashSet<int>>(value);
        }

        [Ignore]
        public HashSet<int> TwoTX3rdOrder { get; set; } = new HashSet<int>();
        public string TwoTX3rdOrderSerialized
        {
            get => JsonConvert.SerializeObject(TwoTX3rdOrder);
            set => TwoTX3rdOrder = JsonConvert.DeserializeObject<HashSet<int>>(value);
        }

        [Ignore]
        public HashSet<int> TwoTX5rdOrder { get; set; } = new HashSet<int>();
        public string TwoTX5rdOrderSerialized
        {
            get => JsonConvert.SerializeObject(TwoTX5rdOrder);
            set => TwoTX5rdOrder = JsonConvert.DeserializeObject<HashSet<int>>(value);
        }

        [Ignore]
        public HashSet<int> TwoTX7rdOrder { get; set; } = new HashSet<int>();
        public string TwoTX7rdOrderSerialized
        {
            get => JsonConvert.SerializeObject(TwoTX7rdOrder);
            set => TwoTX7rdOrder = JsonConvert.DeserializeObject<HashSet<int>>(value);
        }

        [Ignore]
        public HashSet<int> TwoTX9rdOrder { get; set; } = new HashSet<int>();
        public string TwoTX9rdOrderSerialized
        {
            get => JsonConvert.SerializeObject(TwoTX9rdOrder);
            set => TwoTX9rdOrder = JsonConvert.DeserializeObject<HashSet<int>>(value);
        }

        [Ignore]
        public HashSet<int> ThreeTX3rdOrder { get; set; } = new HashSet<int>();
        public string ThreeTX3rdOrderSerialized
        {
            get => JsonConvert.SerializeObject(ThreeTX3rdOrder);
            set => ThreeTX3rdOrder = JsonConvert.DeserializeObject<HashSet<int>>(value);
        }
    }
}