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

                var devicesInGroups = GetDevicesForGroupSet(calculationStep.GroupsToCalculate);

                // Reset seulement les canaux des groupes NON-préservés
                foreach (RFDevice device in devicesInGroups)
                {
                    // Ne réinitialiser que si le device n'appartient pas à un groupe préservé
                    if (!calculationStep.PreserveFrequenciesFromGroups.Contains(device.GroupID))
                    {
                        foreach (RFChannel chan in device.Channels)
                        {
                            chan.Checked = false;
                        }
                    }
                }

                // First pass: handle locked frequencies (seulement pour les groupes non-préservés)
                foreach (RFDevice device in devicesInGroups)
                {
                    if (!calculationStep.PreserveFrequenciesFromGroups.Contains(device.GroupID))
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
                }

                // Second pass: assign frequencies to unlocked channels (seulement pour les groupes non-préservés)
                foreach (RFDevice device in devicesInGroups)
                {
                    if (!calculationStep.PreserveFrequenciesFromGroups.Contains(device.GroupID))
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
                .OrderBy(name => name) // Tri pour cohérence
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

        /// <summary>
        /// Algorithme optimisé pour l'allocation de fréquences :
        /// 1. Trie les groupes par heure de début
        /// 2. Pour chaque groupe non-calculé, trouve les groupes qui chevauchent avec lui
        /// 3. Si un groupe qui chevauche est déjà calculé, on le préserve (pas de recalcul)
        /// 4. Calcule ensemble : nouveaux groupes + groupes déjà calculés (préservés)
        /// 
        /// Exemple: A(19h-20h), B(19h50-21h), C(20h45-22h35)
        /// - Étape 1: A  B (se chevauchent) → calcul normal
        /// - Étape 2: C chevauche B (déjà calculé) → calcul C avec préservation de B
        /// </summary>
        private List<GroupCalculationStep> BuildGroupCalculationPlan()
        {
            var groupsWithTimePeriods = _groupsViewModel.Groups
                .Where(g => g.TimePeriods != null && g.TimePeriods.Any())
                .OrderBy(g => g.TimePeriods.Min(tp => tp.StartTime))
                .ToList();

            var groupsWithoutTimePeriods = _groupsViewModel.Groups
                .Where(g => g.TimePeriods == null || !g.TimePeriods.Any())
                .ToList();

            var calculationPlan = new List<GroupCalculationStep>();
            var processedGroups = new HashSet<int>(); // IDs des groupes déjà calculés

            foreach (var currentGroup in groupsWithTimePeriods)
            {
                if (processedGroups.Contains(currentGroup.ID))
                    continue;

                var overlappingGroups = new List<RFGroup>();
                var preserveFromGroups = new List<int>();

                foreach (var otherGroup in groupsWithTimePeriods)
                {
                    // Ne pas inclure le groupe actuel
                    if (otherGroup.ID == currentGroup.ID)
                        continue;

                    if (DoGroupsOverlap(currentGroup, otherGroup))
                    {
                        if (processedGroups.Contains(otherGroup.ID))
                        {
                            // Groupe déjà calculé → à préserver
                            preserveFromGroups.Add(otherGroup.ID);
                            overlappingGroups.Add(otherGroup);
                        }
                        else
                        {
                            overlappingGroups.Add(otherGroup);
                        }
                    }
                }

                // Créer une étape de calcul
                var groupsToCalculate = new List<RFGroup> { currentGroup };
                groupsToCalculate.AddRange(overlappingGroups);

                var step = new GroupCalculationStep
                {
                    GroupsToCalculate = groupsToCalculate,
                    PreserveFrequenciesFromGroups = preserveFromGroups
                };

                calculationPlan.Add(step);

                processedGroups.Add(currentGroup.ID);
                foreach (var group in overlappingGroups)
                {
                    if (!processedGroups.Contains(group.ID))
                    {
                        processedGroups.Add(group.ID);
                    }
                }
            }

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


        // Méthodes helper pour le debugging
        private string GetGroupTimeRange(RFGroup group)
        {
            if (group.TimePeriods == null || !group.TimePeriods.Any())
                return "Pas de période définie";

            var start = group.TimePeriods.Min(tp => tp.StartTime);
            var end = group.TimePeriods.Max(tp => tp.EndTime);
            return $"{start:HH:mm}-{end:HH:mm}";
        }

        private string GetOverlapReason(List<RFGroup> groups)
        {
            if (groups.Count == 1)
                return "Aucun chevauchement - calcul isolé";

            var timeRanges = groups.Select(g => GetGroupTimeRange(g)).ToList();
            return $"Chevauchement temporel détecté entre: {string.Join(", ", timeRanges)}";
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