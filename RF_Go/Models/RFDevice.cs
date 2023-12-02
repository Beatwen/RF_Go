using Newtonsoft.Json;
using SQLite;
using System;
using System.Diagnostics;
using System.Threading.Channels;


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
        [Ignore] 
        public List<float> Range { get; set; }
        public string RangeSerialized
        {
            get => JsonConvert.SerializeObject(Range);
            set => Range = JsonConvert.DeserializeObject<List<float>>(value);
        }
        [Ignore]
        public List<RFChannel> Channels { get; set; } = new List<RFChannel>();
        public string ChannelsSerialized
        {
            get => JsonConvert.SerializeObject(Channels);
            set => Channels = JsonConvert.DeserializeObject<List<RFChannel>>(value);
        }

        public string ChannelName { get; set; }
        public string IpAddress { get; set; }
        public string InclusionGroup { get; set; }
        public string Tags { get; set; }
        public string RFZone {  get; set; }
        public int numberOfChannels { get; set; }

        public int step { get; set; }

        public RFDevice Clone() => MemberwiseClone() as RFDevice;

        public (bool IsValid, string ErrorMessage) Validate()
        {
            if(string.IsNullOrWhiteSpace(Brand))
            {
                return (false, $"{nameof(ID)} brand is required.");
            }
            return (true, string.Empty);
        }
        public void SetRandomFrequency()
        {
            Channels = new List<RFChannel>();
            List<int> UsedFrequencies = [];
            List<int> TwoTX3rdOrder = [];
            List<int> TwoTX5rdOrder = [];
            List<int> TwoTX7rdOrder = [];
            List<int> TwoTX9rdOrder = [];
            List<int> ThreeTX3rdOrder = [];

            for (int i = 0; i < numberOfChannels; i++)
            {

                Channels.Add(new RFChannel());
                Channels[i].Frequency = GetRandomFrequency();
                int f1 = Channels[i].Frequency;
                Debug.WriteLine($"First f is : {f1}");

                foreach (int f2 in UsedFrequencies)
                {
                    int max = (int)MathF.Max(f1, f2);
                    int min = (int)MathF.Min(f1, f2);
                    int gap = max-min;
                    TwoTX3rdOrder.Add(max + gap);
                    TwoTX3rdOrder.Add(min - gap);
                    TwoTX5rdOrder.Add(max + (gap*2));
                    TwoTX5rdOrder.Add(min - (gap*2));
                    TwoTX7rdOrder.Add(max + (gap*3));
                    TwoTX7rdOrder.Add(min - (gap*3));
                    TwoTX9rdOrder.Add(max + (gap*4));
                    TwoTX9rdOrder.Add(min - (gap*4));
                }
                UsedFrequencies.Add(f1);  
            }
            foreach (int f in TwoTX3rdOrder)
            {
                Debug.WriteLine($"thirdOrder = {f}");
            }
            foreach (int f in TwoTX5rdOrder)
            {
                Debug.WriteLine($"fifthOrder = {f}");
            }
            foreach (int f in TwoTX7rdOrder)
            {
                Debug.WriteLine($"seventhOrder = {f}");
            }
            foreach (int f in TwoTX9rdOrder)
            {
                Debug.WriteLine($"ninthOrder = {f}");
            }

        }
        public int GetRandomFrequency()
        {
            Random random = new Random();
            int numberOfValue = (int)((Range[1]-Range[0]) / Range[3]);
            int randomIndex = random.Next(0, numberOfValue);
            return (int)(Range[0] + (randomIndex * Range[3]));
        }
    }
}
