
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
        public void SetRandomFrequency(HashSet<int> UsedFrequencies, HashSet<int> TwoTX3rdOrder, HashSet<int> TwoTX5rdOrder, HashSet<int> TwoTX7rdOrder, HashSet<int> TwoTX9rdOrder, HashSet<int> ThreeTX3rdOrder)
        {
            int maxAttempt = 10000;
            int f1 = 0;
            //Channels = new List<RFChannel>();


            for (int i = 0; i < numberOfChannels; i++)
            {
                int count = 0;
                if (Channels.Count != numberOfChannels)
                {
                    Channels.Add(new RFChannel());
                    f1 = GetRandomFrequency();
                }
                else if (Channels[i].Frequency != 0 && Channels[i].IsLocked)
                {
                    f1 = Channels[i].Frequency;
                }
                else
                {
                    f1 = GetRandomFrequency();
                }

                while (count < maxAttempt)
                {
                    count++;
                    if (!TwoTX3rdOrder.Any(f => Math.Abs(f-f1) <= 250)
                            && !TwoTX5rdOrder.Any(f => f == f1)
                                && !TwoTX7rdOrder.Any(f => f == f1)
                                    && !TwoTX9rdOrder.Any(f => f == f1)
                                        && !UsedFrequencies.Any(f => Math.Abs(f-f1) <= 350))
                    {
                        Channels[i].Frequency = f1;
                        Debug.WriteLine("Number of attempts to find a frequencies = " + count);
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
                            foreach (int f3 in UsedFrequencies)
                            {
                                if (f1 != f2 && f2 != f3 && f1 != f3)
                                {
                                    ThreeTX3rdOrder.Add(f1 + Math.Abs(f3 - f2));
                                    ThreeTX3rdOrder.Add(f1 - Math.Abs(f2 - f3));       
                                    ThreeTX3rdOrder.Add(f2 + Math.Abs(f3 - f1));    
                                    ThreeTX3rdOrder.Add(f2 - Math.Abs(f1 - f3));         
                                    ThreeTX3rdOrder.Add(f3 + Math.Abs(f2 - f1));   
                                    ThreeTX3rdOrder.Add(f3 - Math.Abs(f1 - f2));
                                }
                            }
                        }
                        UsedFrequencies.Add(f1);
                        break;
                    }
                    else 
                    {
                        
                    }
                }
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
