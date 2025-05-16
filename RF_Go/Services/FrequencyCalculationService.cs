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
            var overlappingGroups = FindOverlappingGroups();
            var excludedRanges = GetExcludedRanges();

            _frequencyDataViewModel.FrequencyData.UsedFrequencies.Clear();
            _frequencyDataViewModel.FrequencyData.TwoTX3rdOrder.Clear();
            _frequencyDataViewModel.FrequencyData.TwoTX5rdOrder.Clear();
            _frequencyDataViewModel.FrequencyData.TwoTX7rdOrder.Clear();
            _frequencyDataViewModel.FrequencyData.TwoTX9rdOrder.Clear();
            _frequencyDataViewModel.FrequencyData.ThreeTX3rdOrder.Clear();

            var groupFrequencyData = new Dictionary<int, FrequencyData>();

            // Define colors for different groups
            var groupColors = new[]
            {
                "#00FFFF", // Dark Green
                "#0000FF", // Blue
                "#800000",  // Maroon
                "#FF0000", // Red
                "#800080", // Purple
                "#FFA500", // Orange
                "#00FFFF", // Green
                "#FFFF00", // Yellow
                "#FF00FF", // Magenta
                "#00FFFF", // Cyan
            };

            foreach (var groupSet in overlappingGroups)
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

                var devicesInGroup = GetDevicesForGroupSet(groupSet);

                // First pass: lock frequencies
                foreach (RFDevice device in devicesInGroup)
                {
                    foreach (RFChannel chan in device.Channels)
                    {
                        chan.Checked = false;
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
                foreach (RFDevice device in devicesInGroup)
                {
                    foreach (RFChannel chan in device.Channels)
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

                // Store the group data with color
                foreach (var group in groupSet)
                {
                    groupData.Color = groupColors[group.ID % groupColors.Length];
                    groupFrequencyData[group.ID] = groupData;
                }

                // Third pass: assign frequencies to backup frequencies
                foreach (RFDevice device in devicesInGroup)
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
            }

            // Update the FrequencyDataViewModel with the grouped data
            _frequencyDataViewModel.FrequencyData.GroupData = groupFrequencyData;

            await _devicesViewModel.SaveAllDevicesAsync();
            await _frequencyDataViewModel.SaveFrequencyDataAsync();
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