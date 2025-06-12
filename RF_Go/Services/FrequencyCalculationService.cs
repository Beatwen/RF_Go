using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RF_Go.Models;
using RF_Go.ViewModels;

namespace RF_Go.Services
{
    public class FrequencyCalculationService
    {
        private readonly DevicesViewModel _devicesViewModel;
        private readonly GroupsViewModel _groupsViewModel;
        private readonly BackupFrequenciesViewModel _backupFrequenciesViewModel;
        private readonly ExclusionChannelViewModel _exclusionChannelViewModel;
        private readonly FrequencyDataViewModel _frequencyDataViewModel;

        public FrequencyCalculationService(
            DevicesViewModel devicesViewModel,
            GroupsViewModel groupsViewModel,
            BackupFrequenciesViewModel backupFrequenciesViewModel,
            ExclusionChannelViewModel exclusionChannelViewModel,
            FrequencyDataViewModel frequencyDataViewModel)
        {
            _devicesViewModel = devicesViewModel;
            _groupsViewModel = groupsViewModel;
            _backupFrequenciesViewModel = backupFrequenciesViewModel;
            _exclusionChannelViewModel = exclusionChannelViewModel;
            _frequencyDataViewModel = frequencyDataViewModel;
        }

        public async Task CalculateFrequenciesAsync()
        {
            await _devicesViewModel.LoadDevicesAsync();
            await _groupsViewModel.LoadGroupsAsync();
            
            var groupCalculationPlan = BuildGroupCalculationPlan();
            var excludedRanges = GetExcludedRanges();

            // Clear all existing data completely - fresh start every time
            _frequencyDataViewModel.FrequencyData.UsedFrequencies.Clear();
            _frequencyDataViewModel.FrequencyData.TwoTX3rdOrder.Clear();
            _frequencyDataViewModel.FrequencyData.TwoTX5rdOrder.Clear();
            _frequencyDataViewModel.FrequencyData.TwoTX7rdOrder.Clear();
            _frequencyDataViewModel.FrequencyData.TwoTX9rdOrder.Clear();
            _frequencyDataViewModel.FrequencyData.ThreeTX3rdOrder.Clear();
            
            // Clear group data
            _frequencyDataViewModel.FrequencyData.GroupData.Clear();

            var calculationStepData = new Dictionary<string, FrequencyData>();
            
            // Global frequency tracking for cumulative effect
            var globalUsedFrequencies = new HashSet<int>();
            var globalIntermodulations = new Dictionary<string, HashSet<int>>
            {
                ["TwoTX3rdOrder"] = new HashSet<int>(),
                ["TwoTX5rdOrder"] = new HashSet<int>(),
                ["TwoTX7rdOrder"] = new HashSet<int>(),
                ["TwoTX9rdOrder"] = new HashSet<int>(),
                ["ThreeTX3rdOrder"] = new HashSet<int>()
            };

            // Define colors for different calculation steps
            var stepColors = new[]
            {
                "#00FF00", // Green
                "#0000FF", // Blue
                "#800000", // Maroon
                "#FF0000", // Red
                "#800080", // Purple
                "#FFA500", // Orange
                "#ADFF2F", // Green Yellow
                "#FFFF00", // Yellow
                "#FF00FF", // Magenta
                "#00FFFF", // Cyan
            };

            int stepIndex = 0;
            foreach (var calculationStep in groupCalculationPlan)
            {
                var groupData = new FrequencyData
                {
                    UsedFrequencies = new HashSet<int>(),
                    TwoTX3rdOrder = new HashSet<int>(),
                    TwoTX5rdOrder = new HashSet<int>(),
                    TwoTX7rdOrder = new HashSet<int>(),
                    TwoTX9rdOrder = new HashSet<int>(),
                    ThreeTX3rdOrder = new HashSet<int>()
                };

                // Copy existing frequencies from overlapping groups that should be preserved
                // BUT ONLY if they were calculated in previous steps (not from old calculation runs)
                var preservedGroupData = new Dictionary<int, FrequencyData>();
                foreach (var existingGroupId in calculationStep.PreserveFrequenciesFromGroups)
                {
                    // Find this group's data from previous calculation steps
                    foreach (var (stepKey, stepData) in calculationStepData)
                    {
                        if (stepKey.Contains($"Groupe {existingGroupId}"))
                        {
                            preservedGroupData[existingGroupId] = stepData;
                            // Copy frequencies to current calculation
                            foreach (var freq in stepData.UsedFrequencies)
                                groupData.UsedFrequencies.Add(freq);
                            foreach (var freq in stepData.TwoTX3rdOrder)
                                groupData.TwoTX3rdOrder.Add(freq);
                            foreach (var freq in stepData.TwoTX5rdOrder)
                                groupData.TwoTX5rdOrder.Add(freq);
                            foreach (var freq in stepData.TwoTX7rdOrder)
                                groupData.TwoTX7rdOrder.Add(freq);
                            foreach (var freq in stepData.TwoTX9rdOrder)
                                groupData.TwoTX9rdOrder.Add(freq);
                            foreach (var freq in stepData.ThreeTX3rdOrder)
                                groupData.ThreeTX3rdOrder.Add(freq);
                            break;
                        }
                    }
                }

                var devicesInGroups = GetDevicesForGroupSet(calculationStep.GroupsToCalculate);

                // Reset all channels first - ensure fresh calculation
                foreach (RFDevice device in devicesInGroups)
                {
                    foreach (RFChannel chan in device.Channels)
                    {
                        chan.Checked = false;
                        // Don't preserve locked state from preserved groups anymore - recalculate everything
                    }
                }

                // First pass: handle locked frequencies
                foreach (RFDevice device in devicesInGroups)
                {
                    foreach (RFChannel chan in device.Channels)
                    {
                        if (chan.IsLocked)
                        {
                            chan.SetRandomFrequency(
                                groupData.UsedFrequencies,
                                groupData.TwoTX3rdOrder,
                                groupData.TwoTX5rdOrder,
                                groupData.TwoTX7rdOrder,
                                groupData.TwoTX9rdOrder,
                                groupData.ThreeTX3rdOrder,
                                excludedRanges);
                        }
                    }
                }

                // Second pass: assign frequencies to unlocked channels
                foreach (RFDevice device in devicesInGroups)
                {
                    foreach (RFChannel chan in device.Channels)
                    {
                        if (!chan.IsLocked)
                        {
                            chan.SetRandomFrequency(
                                groupData.UsedFrequencies,
                                groupData.TwoTX3rdOrder,
                                groupData.TwoTX5rdOrder,
                                groupData.TwoTX7rdOrder,
                                groupData.TwoTX9rdOrder,
                                groupData.ThreeTX3rdOrder,
                                excludedRanges);
                        }
                    }
                }

                // Create calculation step name based on groups involved
                var stepName = CreateCalculationStepName(calculationStep);
                var stepColor = stepColors[stepIndex % stepColors.Length];

                // Store calculation step data for SciChart
                var stepDataCopy = new FrequencyData
                {
                    UsedFrequencies = new HashSet<int>(groupData.UsedFrequencies),
                    TwoTX3rdOrder = new HashSet<int>(groupData.TwoTX3rdOrder),
                    TwoTX5rdOrder = new HashSet<int>(groupData.TwoTX5rdOrder),
                    TwoTX7rdOrder = new HashSet<int>(groupData.TwoTX7rdOrder),
                    TwoTX9rdOrder = new HashSet<int>(groupData.TwoTX9rdOrder),
                    ThreeTX3rdOrder = new HashSet<int>(groupData.ThreeTX3rdOrder),
                    Color = stepColor
                };
                calculationStepData[stepName] = stepDataCopy;

                // Add this step's frequencies to global tracking
                foreach (var freq in groupData.UsedFrequencies)
                    globalUsedFrequencies.Add(freq);
                foreach (var freq in groupData.TwoTX3rdOrder)
                    globalIntermodulations["TwoTX3rdOrder"].Add(freq);
                foreach (var freq in groupData.TwoTX5rdOrder)
                    globalIntermodulations["TwoTX5rdOrder"].Add(freq);
                foreach (var freq in groupData.TwoTX7rdOrder)
                    globalIntermodulations["TwoTX7rdOrder"].Add(freq);
                foreach (var freq in groupData.TwoTX9rdOrder)
                    globalIntermodulations["TwoTX9rdOrder"].Add(freq);
                foreach (var freq in groupData.ThreeTX3rdOrder)
                    globalIntermodulations["ThreeTX3rdOrder"].Add(freq);

                // Calculate backup frequencies
                foreach (RFDevice device in devicesInGroups)
                {
                    var deviceBackupFrequencies = _backupFrequenciesViewModel.GetBackupFrequenciesForDeviceType(
                        device.Brand, device.Model, device.Frequency);
                    foreach (var backupFreq in deviceBackupFrequencies)
                    {
                        // Create a temporary channel for the backup frequency
                        var tempChannel = new RFChannel
                        {
                            Range = new List<int> { (int)backupFreq.MinRange, (int)backupFreq.MaxRange, 0, (int)backupFreq.Step },
                            Step = (int)backupFreq.Step,
                            SelfSpacing = device.Channels[0].SelfSpacing,
                            ThirdOrderSpacing = device.Channels[0].ThirdOrderSpacing,
                            FifthOrderSpacing = device.Channels[0].FifthOrderSpacing,
                            SeventhOrderSpacing = device.Channels[0].SeventhOrderSpacing,
                            NinthOrderSpacing = device.Channels[0].NinthOrderSpacing,
                            ThirdOrderSpacing3Tx = device.Channels[0].ThirdOrderSpacing3Tx
                        };

                        // Use the same logic as regular channels
                        tempChannel.SetRandomFrequency(
                            groupData.UsedFrequencies,
                            groupData.TwoTX3rdOrder,
                            groupData.TwoTX5rdOrder,
                            groupData.TwoTX7rdOrder,
                            groupData.TwoTX9rdOrder,
                            groupData.ThreeTX3rdOrder,
                            excludedRanges
                        );

                        // Save the calculated frequency
                        backupFreq.BackupFrequency = tempChannel.Frequency;
                        await _backupFrequenciesViewModel.SaveBackupFrequencyAsync(backupFreq);
                    }
                }

                stepIndex++;
            }

            // Update BOTH the global FrequencyData AND the CalculationStepData for proper SciChart display
            foreach (var freq in globalUsedFrequencies)
                _frequencyDataViewModel.FrequencyData.UsedFrequencies.Add(freq);
            foreach (var freq in globalIntermodulations["TwoTX3rdOrder"])
                _frequencyDataViewModel.FrequencyData.TwoTX3rdOrder.Add(freq);
            foreach (var freq in globalIntermodulations["TwoTX5rdOrder"])
                _frequencyDataViewModel.FrequencyData.TwoTX5rdOrder.Add(freq);
            foreach (var freq in globalIntermodulations["TwoTX7rdOrder"])
                _frequencyDataViewModel.FrequencyData.TwoTX7rdOrder.Add(freq);
            foreach (var freq in globalIntermodulations["TwoTX9rdOrder"])
                _frequencyDataViewModel.FrequencyData.TwoTX9rdOrder.Add(freq);
            foreach (var freq in globalIntermodulations["ThreeTX3rdOrder"])
                _frequencyDataViewModel.FrequencyData.ThreeTX3rdOrder.Add(freq);

            // Set the calculation step data for SciChart visualization
            _frequencyDataViewModel.FrequencyData.GroupData = ConvertCalculationStepDataToGroupData(calculationStepData);

            await _devicesViewModel.SaveAllDevicesAsync();
            await _frequencyDataViewModel.SaveFrequencyDataAsync();
        }

        private string CreateCalculationStepName(GroupCalculationStep calculationStep)
        {
            var groupNames = calculationStep.GroupsToCalculate
                .Select(g => _groupsViewModel.Groups.FirstOrDefault(group => group.ID == g.ID)?.Name ?? $"Groupe {g.ID}")
                .ToList();

            if (groupNames.Count == 1)
            {
                return groupNames[0];
            }
            else
            {
                return string.Join(" & ", groupNames);
            }
        }

        private Dictionary<int, FrequencyData> ConvertCalculationStepDataToGroupData(Dictionary<string, FrequencyData> calculationStepData)
        {
            var groupData = new Dictionary<int, FrequencyData>();
            int fakeGroupId = 1000; // Start with high number to avoid conflicts with real group IDs

            foreach (var (stepName, stepData) in calculationStepData)
            {
                // Create a fake group entry for SciChart compatibility
                // Store the step name in a custom property for JavaScript access
                var frequencyDataCopy = new FrequencyData
                {
                    UsedFrequencies = new HashSet<int>(stepData.UsedFrequencies),
                    TwoTX3rdOrder = new HashSet<int>(stepData.TwoTX3rdOrder),
                    TwoTX5rdOrder = new HashSet<int>(stepData.TwoTX5rdOrder),
                    TwoTX7rdOrder = new HashSet<int>(stepData.TwoTX7rdOrder),
                    TwoTX9rdOrder = new HashSet<int>(stepData.TwoTX9rdOrder),
                    ThreeTX3rdOrder = new HashSet<int>(stepData.ThreeTX3rdOrder),
                    Color = stepData.Color
                };

                groupData[fakeGroupId] = frequencyDataCopy;
                fakeGroupId++;
            }

            // Store calculation step names for JavaScript access
            _calculationStepNames = calculationStepData.Keys.ToList();

            return groupData;
        }

        private List<string> _calculationStepNames = new List<string>();

        public List<string> GetCalculationStepNames()
        {
            return _calculationStepNames ?? new List<string>();
        }

        private List<GroupCalculationStep> BuildGroupCalculationPlan()
        {
            var sortedGroups = _groupsViewModel.Groups
                .Where(g => g.TimePeriods != null && g.TimePeriods.Any())
                .OrderBy(g => g.TimePeriods.Min(tp => tp.StartTime))
                .ToList();

            var groupsWithoutTimePeriods = _groupsViewModel.Groups
                .Where(g => g.TimePeriods == null || !g.TimePeriods.Any())
                .ToList();

            var calculationPlan = new List<GroupCalculationStep>();
            var processedGroupCombinations = new HashSet<string>();

            foreach (var group in sortedGroups)
            {
                // Find all groups that overlap with this group
                var overlappingGroups = new List<RFGroup>();
                
                foreach (var otherGroup in sortedGroups)
                {
                    if (group.ID == otherGroup.ID)
                        continue;

                    if (DoGroupsOverlap(group, otherGroup))
                    {
                        overlappingGroups.Add(otherGroup);
                    }
                }

                // For each overlapping group, create a calculation step
                foreach (var overlappingGroup in overlappingGroups)
                {
                    // Only process if this group started before the overlapping group (chronological order)
                    var groupStartTime = group.TimePeriods.Min(tp => tp.StartTime);
                    var overlappingStartTime = overlappingGroup.TimePeriods.Min(tp => tp.StartTime);
                    
                    if (groupStartTime <= overlappingStartTime)
                    {
                        // Create a unique key for this combination to avoid duplicates
                        var combinationKey = $"{Math.Min(group.ID, overlappingGroup.ID)}-{Math.Max(group.ID, overlappingGroup.ID)}";
                        
                        if (!processedGroupCombinations.Contains(combinationKey))
                        {
                            var step = new GroupCalculationStep
                            {
                                GroupsToCalculate = new List<RFGroup> { group, overlappingGroup },
                                PreserveFrequenciesFromGroups = new List<int>()
                            };

                            calculationPlan.Add(step);
                            processedGroupCombinations.Add(combinationKey);
                        }
                    }
                }

                // If group has no overlaps, calculate it alone
                if (overlappingGroups.Count == 0)
                {
                    var step = new GroupCalculationStep
                    {
                        GroupsToCalculate = new List<RFGroup> { group },
                        PreserveFrequenciesFromGroups = new List<int>()
                    };
                    calculationPlan.Add(step);
                }
            }

            // Add groups without time periods as separate calculation steps
            foreach (var group in groupsWithoutTimePeriods)
            {
                calculationPlan.Add(new GroupCalculationStep
                {
                    GroupsToCalculate = new List<RFGroup> { group },
                    PreserveFrequenciesFromGroups = new List<int>()
                });
            }

            return calculationPlan;
        }

        private class GroupCalculationStep
        {
            public List<RFGroup> GroupsToCalculate { get; set; } = new List<RFGroup>();
            public List<int> PreserveFrequenciesFromGroups { get; set; } = new List<int>();
        }

        private List<RFDevice> GetDevicesForGroupSet(List<RFGroup> groupSet)
        {
            var groupIds = groupSet.Select(g => g.ID).ToList();
            return _devicesViewModel.Devices.Where(device => groupIds.Contains(device.GroupID)).ToList();
        }

        private List<List<RFGroup>> FindOverlappingGroups()
        {
            var processedGroups = new HashSet<RFGroup>();
            var overlappingGroups = new List<List<RFGroup>>();

            foreach (var group in _groupsViewModel.Groups)
            {
                if (processedGroups.Contains(group))
                    continue;

                var overlappingSet = new List<RFGroup> { group };
                processedGroups.Add(group);

                foreach (var otherGroup in _groupsViewModel.Groups)
                {
                    if (group == otherGroup || processedGroups.Contains(otherGroup))
                        continue;

                    if (DoGroupsOverlap(group, otherGroup))
                    {
                        overlappingSet.Add(otherGroup);
                        processedGroups.Add(otherGroup);
                    }
                }
                overlappingGroups.Add(overlappingSet);
            }

            return overlappingGroups;
        }

        private bool DoGroupsOverlap(RFGroup group1, RFGroup group2)
        {
            foreach (var period1 in group1.TimePeriods)
            {
                foreach (var period2 in group2.TimePeriods)
                {
                    if (DoPeriodsOverlap(period1, period2))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        private bool DoPeriodsOverlap(TimePeriod period1, TimePeriod period2)
        {
            return period1.StartTime < period2.EndTime && period1.EndTime > period2.StartTime;
        }

        private List<(float StartFrequency, float EndFrequency)> GetExcludedRanges()
        {
            var excludedChannels = _exclusionChannelViewModel.ExclusionChannels
                .Where(channel => channel.Exclude)
                .Concat(_exclusionChannelViewModel.UserAddedChannels.Where(channel => channel.Exclude))
                .Select(channel => (channel.StartFrequency, channel.EndFrequency))
                .ToList();

            return excludedChannels;
        }
    }
} 