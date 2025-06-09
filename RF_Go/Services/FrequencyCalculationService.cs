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
            var sortedGroups = GetGroupsSortedByStartTime();
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
                "#00FFFF", // Cyan
                "#0000FF", // Blue
                "#800000", // Maroon
                "#FF0000", // Red
                "#800080", // Purple
                "#FFA500", // Orange
                "#008000", // Green
                "#FFFF00", // Yellow
                "#FF00FF", // Magenta
                "#00CED1", // Dark Turquoise
            };

            foreach (var currentGroup in sortedGroups)
            {
                // Find only groups that overlap DIRECTLY with current group and have already been processed
                var overlappingProcessedGroups = GetDirectlyOverlappingProcessedGroups(currentGroup, groupFrequencyData.Keys);

                var groupData = new FrequencyData
                {
                    UsedFrequencies = new HashSet<int>(),
                    TwoTX3rdOrder = new HashSet<int>(),
                    TwoTX5rdOrder = new HashSet<int>(),
                    TwoTX7rdOrder = new HashSet<int>(),
                    TwoTX9rdOrder = new HashSet<int>(),
                    ThreeTX3rdOrder = new HashSet<int>(),
                    Color = groupColors[currentGroup.ID % groupColors.Length]
                };

                var tempUsedFrequencies = new HashSet<int>();
                var tempTwoTX3rdOrder = new HashSet<int>();
                var tempTwoTX5rdOrder = new HashSet<int>();
                var tempTwoTX7rdOrder = new HashSet<int>();
                var tempTwoTX9rdOrder = new HashSet<int>();
                var tempThreeTX3rdOrder = new HashSet<int>();

                foreach (var overlappingGroupId in overlappingProcessedGroups)
                {
                    var overlappingData = groupFrequencyData[overlappingGroupId];
                    foreach (var freq in overlappingData.UsedFrequencies)
                        tempUsedFrequencies.Add(freq);
                    foreach (var freq in overlappingData.TwoTX3rdOrder)
                        tempTwoTX3rdOrder.Add(freq);
                    foreach (var freq in overlappingData.TwoTX5rdOrder)
                        tempTwoTX5rdOrder.Add(freq);
                    foreach (var freq in overlappingData.TwoTX7rdOrder)
                        tempTwoTX7rdOrder.Add(freq);
                    foreach (var freq in overlappingData.TwoTX9rdOrder)
                        tempTwoTX9rdOrder.Add(freq);
                    foreach (var freq in overlappingData.ThreeTX3rdOrder)
                        tempThreeTX3rdOrder.Add(freq);
                }

                var devicesInGroup = GetDevicesForGroup(currentGroup);

                // First pass: lock frequencies
                foreach (RFDevice device in devicesInGroup)
                {
                    foreach (RFChannel chan in device.Channels)
                    {
                        chan.Checked = false;
                        if (chan.IsLocked)
                        {
                            chan.SetRandomFrequency(
                                tempUsedFrequencies,
                                tempTwoTX3rdOrder,
                                tempTwoTX5rdOrder,
                                tempTwoTX7rdOrder,
                                tempTwoTX9rdOrder,
                                tempThreeTX3rdOrder,
                                excludedRanges);

                            if (chan.Frequency > 0)
                            {
                                AddFrequencyToGroupData(chan, groupData);
                                // Also add to temp sets so other channels in same group see this frequency as used
                                AddFrequencyToTempSets(chan, tempUsedFrequencies, tempTwoTX3rdOrder, tempTwoTX5rdOrder,
                                                     tempTwoTX7rdOrder, tempTwoTX9rdOrder, tempThreeTX3rdOrder);
                            }
                        }
                    }
                }

                foreach (RFDevice device in devicesInGroup)
                {
                    foreach (RFChannel chan in device.Channels)
                    {
                        if (!chan.IsLocked)
                        {
                            chan.SetRandomFrequency(
                                tempUsedFrequencies,
                                tempTwoTX3rdOrder,
                                tempTwoTX5rdOrder,
                                tempTwoTX7rdOrder,
                                tempTwoTX9rdOrder,
                                tempThreeTX3rdOrder,
                                excludedRanges);

                            if (chan.Frequency > 0)
                            {
                                AddFrequencyToGroupData(chan, groupData);
                                AddFrequencyToTempSets(chan, tempUsedFrequencies, tempTwoTX3rdOrder, tempTwoTX5rdOrder,
                                                     tempTwoTX7rdOrder, tempTwoTX9rdOrder, tempThreeTX3rdOrder);
                            }
                        }
                    }
                }

                // Fusionner les HashSet temporaires dans groupData pour conserver toutes les intermodulations
                groupData.UsedFrequencies.UnionWith(tempUsedFrequencies);
                groupData.TwoTX3rdOrder.UnionWith(tempTwoTX3rdOrder);
                groupData.TwoTX5rdOrder.UnionWith(tempTwoTX5rdOrder);
                groupData.TwoTX7rdOrder.UnionWith(tempTwoTX7rdOrder);
                groupData.TwoTX9rdOrder.UnionWith(tempTwoTX9rdOrder);
                groupData.ThreeTX3rdOrder.UnionWith(tempThreeTX3rdOrder);

                // On ne garde que les intermodulations issues des fréquences réellement utilisées
                groupData.TwoTX3rdOrder.Clear();
                groupData.TwoTX5rdOrder.Clear();
                groupData.TwoTX7rdOrder.Clear();
                groupData.TwoTX9rdOrder.Clear();
                groupData.ThreeTX3rdOrder.Clear();

                RFChannel.CalculAllIntermodSet(
                    groupData.UsedFrequencies,
                    groupData.TwoTX3rdOrder,
                    groupData.TwoTX5rdOrder,
                    groupData.TwoTX7rdOrder,
                    groupData.TwoTX9rdOrder,
                    groupData.ThreeTX3rdOrder
                );

                groupFrequencyData[currentGroup.ID] = groupData;

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
                            tempUsedFrequencies,
                            tempTwoTX3rdOrder,
                            tempTwoTX5rdOrder,
                            tempTwoTX7rdOrder,
                            tempTwoTX9rdOrder,
                            tempThreeTX3rdOrder,
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

        private void AddFrequencyToGroupData(RFChannel channel, FrequencyData groupData)
        {
            // Add ONLY the main frequency used by this channel to the group data
            groupData.UsedFrequencies.Add(channel.Frequency);

            // Note: Intermodulations are calculated by SetRandomFrequency method internally
            // We don't need to add them manually here as they are already handled
        }

        private void AddFrequencyToTempSets(RFChannel channel, HashSet<int> tempUsedFrequencies,
            HashSet<int> tempTwoTX3rdOrder, HashSet<int> tempTwoTX5rdOrder, HashSet<int> tempTwoTX7rdOrder,
            HashSet<int> tempTwoTX9rdOrder, HashSet<int> tempThreeTX3rdOrder)
        {
            // Add the main frequency
            tempUsedFrequencies.Add(channel.Frequency);

            // Add intermodulation frequencies that need to be blocked for other channels
            // This should match the logic used in SetRandomFrequency method
            var freq = channel.Frequency;

            // Add spacing-based blocked frequencies
            if (channel.SelfSpacing > 0)
            {
                for (int i = 1; i <= 5; i++) // Reduced range to avoid too many blocked frequencies
                {
                    tempUsedFrequencies.Add(freq + (i * channel.SelfSpacing));
                    tempUsedFrequencies.Add(freq - (i * channel.SelfSpacing));
                }
            }

            if (channel.ThirdOrderSpacing > 0)
            {
                tempTwoTX3rdOrder.Add(freq + channel.ThirdOrderSpacing);
                tempTwoTX3rdOrder.Add(freq - channel.ThirdOrderSpacing);
            }

            if (channel.FifthOrderSpacing > 0)
            {
                tempTwoTX5rdOrder.Add(freq + channel.FifthOrderSpacing);
                tempTwoTX5rdOrder.Add(freq - channel.FifthOrderSpacing);
            }

            if (channel.SeventhOrderSpacing > 0)
            {
                tempTwoTX7rdOrder.Add(freq + channel.SeventhOrderSpacing);
                tempTwoTX7rdOrder.Add(freq - channel.SeventhOrderSpacing);
            }

            if (channel.NinthOrderSpacing > 0)
            {
                tempTwoTX9rdOrder.Add(freq + channel.NinthOrderSpacing);
                tempTwoTX9rdOrder.Add(freq - channel.NinthOrderSpacing);
            }

            if (channel.ThirdOrderSpacing3Tx > 0)
            {
                tempThreeTX3rdOrder.Add(freq + channel.ThirdOrderSpacing3Tx);
                tempThreeTX3rdOrder.Add(freq - channel.ThirdOrderSpacing3Tx);
            }
        }

        private List<RFDevice> GetDevicesForGroup(RFGroup group)
        {
            return _devicesViewModel.Devices.Where(device => device.GroupID == group.ID).ToList();
        }

        private List<RFGroup> GetGroupsSortedByStartTime()
        {
            // Séparer les groupes avec et sans time slots
            var groupsWithTimeSlots = _groupsViewModel.Groups
                .Where(g => g.TimePeriods != null && g.TimePeriods.Any())
                .OrderBy(g => g.TimePeriods.Min(tp => tp.StartTime))
                .ToList();

            var groupsWithoutTimeSlots = _groupsViewModel.Groups
                .Where(g => g.TimePeriods == null || !g.TimePeriods.Any())
                .ToList();

            // Mettre les groupes sans time slots à la fin
            return groupsWithTimeSlots.Concat(groupsWithoutTimeSlots).ToList();
        }

        private List<int> GetDirectlyOverlappingProcessedGroups(RFGroup currentGroup, IEnumerable<int> processedGroupIds)
        {
            var directlyOverlappingGroups = new List<int>();

            foreach (var processedGroupId in processedGroupIds)
            {
                var processedGroup = _groupsViewModel.Groups.FirstOrDefault(g => g.ID == processedGroupId);
                if (processedGroup != null && DoGroupsOverlapDirectly(currentGroup, processedGroup))
                {
                    directlyOverlappingGroups.Add(processedGroupId);
                }
            }

            return directlyOverlappingGroups;
        }

        private bool DoGroupsOverlapDirectly(RFGroup group1, RFGroup group2)
        {
            // Si l'un des groupes n'a pas de time slots, il ne se chevauche jamais
            if (group1.TimePeriods == null || group2.TimePeriods == null ||
                !group1.TimePeriods.Any() || !group2.TimePeriods.Any())
            {
                return false;
            }

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