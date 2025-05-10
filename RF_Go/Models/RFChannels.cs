using SQLite;
using System.Diagnostics;
using System.Text.Json;


namespace RF_Go.Models
{
    public class RFchannelService
    {
        public List<RFChannel> Channels { get; set; } = new List<RFChannel>();
    }
    public class RFChannel
    {
        [PrimaryKey, AutoIncrement]
        public int ID { get; set; }
        public bool Selected { get; set; }
        public int chanNumber { get; set; }
        public int Frequency { get; set; }
        [Ignore]
        public List<int> Range { get; set; }
        public string RangeSerialized
        {
            get => JsonSerializer.Serialize(Range);
            set => Range = JsonSerializer.Deserialize<List<int>>(value);
        }
        public int Step { get; set; }
        public int SelfSpacing { get; set; }
        public int ThirdOrderSpacing { get; set; }
        public bool ThirdOrderSpacingEnable = true;
        public int FifthOrderSpacing { get; set; }
        public bool FifthOrderSpacingEnable = true;
        public int SeventhOrderSpacing { get; set; }
        public bool SeventhOrderSpacingEnable;
        public int NinthOrderSpacing { get; set; }
        public bool NinthOrderSpacingEnable;
        public int ThirdOrderSpacing3Tx { get; set; }
        public bool ThirdOrderSpacing3TxEnable = true;


        public bool Checked { get; set; }
        public string ChannelName { get; set; }
        private bool _isLocked;
        public bool IsLocked 
        {
            get { return _isLocked; }
            set
            {   
                if (Frequency == 0)
                {
                    _isLocked = false;
                }
                else
                {
                    _isLocked = value;
                }
            }
        }
        public void SetRandomFrequency(HashSet<int> UsedFrequencies, HashSet<int> TwoTX3rdOrder, HashSet<int> TwoTX5rdOrder, HashSet<int> TwoTX7rdOrder, HashSet<int> TwoTX9rdOrder, HashSet<int> ThreeTX3rdOrder, List<(float StartFrequency, float EndFrequency)> excludedRanges)
        {
            int f1;
                if (!Checked && !IsLocked)
                {
                    
                    f1 = LoopForFreeFrequency(UsedFrequencies, TwoTX3rdOrder, TwoTX5rdOrder, TwoTX7rdOrder, TwoTX9rdOrder, ThreeTX3rdOrder, excludedRanges);
                    Debug.WriteLine("Channel Added to Device");
                    Debug.WriteLine("Calcul intermod of unlocked freq");
                }
                else if (Frequency != 0 && IsLocked && !Checked)
                {

                    f1 = Frequency;
                    if (CheckFreeFrequency(f1, UsedFrequencies, TwoTX3rdOrder, TwoTX5rdOrder, TwoTX7rdOrder, TwoTX9rdOrder, ThreeTX3rdOrder, excludedRanges))
                    {
                        CalculAllIntermod(f1, UsedFrequencies, TwoTX3rdOrder, TwoTX5rdOrder, TwoTX7rdOrder, TwoTX9rdOrder, ThreeTX3rdOrder);
                        UsedFrequencies.Add(f1);
                        Checked = true;
                        Debug.WriteLine("Calcul intermod of locked freq.");
                    }
                    else
                    {
                        Debug.WriteLine("Frequency is not setup ! wrong freq");
                        Checked = false;
                    }
                }
                Debug.WriteLine("was device locked ? " + IsLocked + "count of usedFreq = " + UsedFrequencies.Count() + "count of 2tx3 = " + TwoTX3rdOrder.Count());

                if (Frequency == 0)
                {
                    Debug.WriteLine(" Entering last chance!");
                    for (int j = Range[0]; j < Range[1]; j+=Step)
                    {
                        if (CheckFreeFrequency(j, UsedFrequencies, TwoTX3rdOrder, TwoTX5rdOrder, TwoTX7rdOrder, TwoTX9rdOrder, ThreeTX3rdOrder, excludedRanges))
                        {
                            Frequency = j;
                            Debug.WriteLine(j + " est assignée par la loop all.");
                            CalculAllIntermod(j, UsedFrequencies, TwoTX3rdOrder, TwoTX5rdOrder, TwoTX7rdOrder, TwoTX9rdOrder, ThreeTX3rdOrder);
                            UsedFrequencies.Add(j);
                            Checked = true;
                            break;
                        }
                    }
                }
        }
        public int GetRandomFrequency()
        {
            Random random = new Random();
            int numberOfValue = (Range[1]-Range[0]) / Range[3];
            int randomIndex = random.Next(0, numberOfValue);
            return (Range[0] + (randomIndex * Range[3]));
        }
        public int LoopForFreeFrequency(HashSet<int> UsedFrequencies, HashSet<int> TwoTX3rdOrder, HashSet<int> TwoTX5rdOrder, HashSet<int> TwoTX7rdOrder, HashSet<int> TwoTX9rdOrder, HashSet<int> ThreeTX3rdOrder, List<(float StartFrequency, float EndFrequency)> excludedRanges)
        {
            int f1;
            int count = 0;
            int maxAttempt = 100;
            while (count < maxAttempt)
            {
                f1 = GetRandomFrequency();
                count++;
                if (CheckFreeFrequency(f1, UsedFrequencies, TwoTX3rdOrder, TwoTX5rdOrder, TwoTX7rdOrder, TwoTX9rdOrder, ThreeTX3rdOrder, excludedRanges))
                {
                    Frequency = f1;
                    CalculAllIntermod(f1, UsedFrequencies, TwoTX3rdOrder, TwoTX5rdOrder, TwoTX7rdOrder, TwoTX9rdOrder, ThreeTX3rdOrder);
                    UsedFrequencies.Add(f1);
                    Checked = true;
                    return f1;
                }
                else
                {
                    Frequency = 0;
                    Checked = false;
                }
            }

            return 0;
        }
        public bool CheckFreeFrequency(int f1, HashSet<int> UsedFrequencies, HashSet<int> TwoTX3rdOrder, HashSet<int> TwoTX5rdOrder, HashSet<int> TwoTX7rdOrder, HashSet<int> TwoTX9rdOrder, HashSet<int> ThreeTX3rdOrder, List<(float StartFrequency, float EndFrequency)> excludedRanges)
        {
            // Check if the frequency falls within any of the exclusion ranges

            bool isInExclusionRange = excludedRanges.Any(range => f1 >= range.StartFrequency*1000 && f1 <= range.EndFrequency*1000);
            if (isInExclusionRange)
            {
                return false; // Frequency is within an excluded range
            }

            // Original checks for spacing and used frequencies
            return ((SpacingEnable(f1, TwoTX3rdOrder, ThirdOrderSpacingEnable, ThirdOrderSpacing))
                        && (SpacingEnable(f1, TwoTX5rdOrder, FifthOrderSpacingEnable, FifthOrderSpacing))
                            && (SpacingEnable(f1, TwoTX7rdOrder, SeventhOrderSpacingEnable, SeventhOrderSpacing))
                                && (SpacingEnable(f1, TwoTX9rdOrder, NinthOrderSpacingEnable, NinthOrderSpacing))
                                    && (SpacingEnable(f1, ThreeTX3rdOrder, ThirdOrderSpacing3TxEnable, ThirdOrderSpacing3Tx))
                                        && !UsedFrequencies.Any(f => Math.Abs(f - f1) <= SelfSpacing));
        }
        public bool SpacingEnable(int f1, HashSet<int>freqs, bool OrderSpacingEnable, int OrderSpacing)
        {
            if(OrderSpacingEnable) 
            {
                return !freqs.Any(f => Math.Abs(f-f1) <= OrderSpacing);
            }
            else
            {
                return true;
            }
        }
        public static void CalculAllIntermod(int f1, HashSet<int> UsedFrequencies, HashSet<int> TwoTX3rdOrder, HashSet<int> TwoTX5rdOrder, HashSet<int> TwoTX7rdOrder, HashSet<int> TwoTX9rdOrder, HashSet<int> ThreeTX3rdOrder)
        {
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
        }
        public RFChannel Clone() => MemberwiseClone() as RFChannel;
    }
}
