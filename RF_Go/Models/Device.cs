using Newtonsoft.Json;
using SQLite;


namespace RF_Go.Models
{
    public class RFDeviceService
    {
        public List<RFDevice> Devices { get; set; } = new List<RFDevice>();
    }
    public class RFDevice
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }
        public bool Selected { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Frequency { get; set; }
        [Ignore] // Exclude from database mapping
        public List<float> Range { get; set; }

        public string RangeSerialized
        {
            get => JsonConvert.SerializeObject(Range);
            set => Range = JsonConvert.DeserializeObject<List<float>>(value);
        }
        public int Quantity { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }

        public RFDevice Clone() => MemberwiseClone() as RFDevice;

        public (bool IsValid, string ErrorMessage) Validate()
        {
            if(string.IsNullOrWhiteSpace(Name))
            {
                return (false, $"{nameof(Name)} is required.");
            }
            else if(Price <= 0)
            {
                return (false, $"{nameof(Price)} should be greater than 0.");
            }
            return (true, string.Empty);
        }
    }
}
