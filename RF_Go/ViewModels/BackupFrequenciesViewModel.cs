using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using RF_Go.Models;
using RF_Go.Data;
using CommunityToolkit.Mvvm.ComponentModel;
using System.Diagnostics;
using System.Text.Json.Serialization;
using System.Linq;
using System.Text.Json;

namespace RF_Go.ViewModels
{
    public partial class BackupFrequenciesViewModel : ObservableObject
    {
        private readonly DatabaseContext _context;
        private DeviceData _deviceData;

        [ObservableProperty]
        private ObservableCollection<RFBackupFrequency> _backupFrequencies = new();

        private Dictionary<(string Brand, string Model, string Frequency), int> _backupCounts = new();

        public BackupFrequenciesViewModel(DatabaseContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            LoadDeviceData();
        }

        private void LoadDeviceData()
        {
            try
            {
                _deviceData = DeviceDataJson.GetDeviceData();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error loading device data: {ex.Message}");
                _deviceData = new DeviceData();
            }
        }

        public async Task LoadBackupFrequenciesAsync()
        {
            var frequencies = await _context.GetAllAsync<RFBackupFrequency>();
            if (frequencies != null && frequencies.Any())
            {
                BackupFrequencies.Clear();
                foreach (var frequency in frequencies)
                {
                    BackupFrequencies.Add(frequency);
                }
            }
        }

        public async Task SaveBackupFrequencyCountAsync(string brand, string model, string frequency, int count)
        {
            try
            {
                // Update the in-memory dictionary
                _backupCounts[(brand, model, frequency)] = count;

                // Delete existing backup frequencies for this device type
                var existingFrequencies = BackupFrequencies
                    .Where(f => f.Brand == brand && f.Model == model && f.Frequency == frequency)
                    .ToList();
                foreach (var existing in existingFrequencies)
                {
                    await DeleteBackupFrequencyAsync(existing);
                }

                // Create backup frequencies for each channel
                for (int channelIndex = 0; channelIndex < count; channelIndex++)
                {
                    var backupFrequency = new RFBackupFrequency
                    {
                        Brand = brand,
                        Model = model,
                        Frequency = frequency,
                        ChannelIndex = channelIndex,
                        BackupFrequency = 0, // Will be set when frequencies are generated
                        IsUsed = false,
                        MinRange = _deviceData.Brands[brand][model][frequency][0],
                        MaxRange = _deviceData.Brands[brand][model][frequency][1],
                        Step = _deviceData.Brands[brand][model][frequency][3]
                    };

                    await _context.AddItemAsync(backupFrequency);
                    BackupFrequencies.Add(backupFrequency);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error saving backup frequency count: {ex.Message}");
                throw;
            }
        }

        public async Task LoadBackupFrequencyCountsAsync()
        {
            try
            {
                // Load all configurations (where ChannelIndex is -1)
                var configs = await _context.GetFilteredAsync<RFBackupFrequency>(
                    f => f.ChannelIndex == -1);

                _backupCounts.Clear();
                foreach (var config in configs)
                {
                    _backupCounts[(config.Brand, config.Model, config.Frequency)] = config.BackupFrequency;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error loading backup frequency counts: {ex.Message}");
                throw;
            }
        }

        public int GetBackupFrequencyCount(string brand, string model, string frequency)
        {
            return _backupCounts.TryGetValue((brand, model, frequency), out var count) ? count : 0;
        }

        public async Task GenerateBackupFrequenciesAsync(FrequencyDataViewModel frequencyData, List<(float Start, float End)> excludedRanges)
        {
            foreach (var deviceType in _backupCounts)
            {
                var count = deviceType.Value;
                if (count == 0) continue;

                var (brand, model, frequency) = deviceType.Key;
                var range = _deviceData.Brands[brand][model][frequency];
                var minRange = range[0];
                var maxRange = range[1];
                var step = range[2];

                // Delete existing backup frequencies for this device type
                var existingFrequencies = BackupFrequencies
                    .Where(f => f.Brand == brand && f.Model == model && f.Frequency == frequency)
                    .ToList();
                foreach (var existing in existingFrequencies)
                {
                    await DeleteBackupFrequencyAsync(existing);
                }

                for (int channelIndex = 0; channelIndex < count; channelIndex++)
                {
                    var backupFrequency = new RFBackupFrequency
                    {
                        Brand = brand,
                        Model = model,
                        Frequency = frequency,
                        ChannelIndex = channelIndex,
                        BackupFrequency = 0,
                        IsUsed = false,
                        MinRange = minRange,
                        MaxRange = maxRange,
                        Step = step
                    };

                    await SaveBackupFrequencyAsync(backupFrequency);
                }
            }
        }

        private int CalculateBackupFrequency(float min, float max, float step, FrequencyDataViewModel frequencyData, List<(float Start, float End)> excludedRanges)
        {
            var random = new Random();
            int frequency;
            bool isValid;

            do
            {
                // Generate a random frequency within the range
                var range = max - min;
                var steps = (int)(range / step);
                var randomStep = random.Next(0, steps + 1);
                frequency = (int)(min + (randomStep * step));

                // Check if the frequency is valid
                isValid = !frequencyData.FrequencyData.UsedFrequencies.Contains(frequency) &&
                         !frequencyData.FrequencyData.TwoTX3rdOrder.Contains(frequency) &&
                         !frequencyData.FrequencyData.TwoTX5rdOrder.Contains(frequency) &&
                         !frequencyData.FrequencyData.TwoTX7rdOrder.Contains(frequency) &&
                         !frequencyData.FrequencyData.TwoTX9rdOrder.Contains(frequency) &&
                         !frequencyData.FrequencyData.ThreeTX3rdOrder.Contains(frequency) &&
                         !IsInExcludedRange(frequency, excludedRanges);

            } while (!isValid);

            return frequency;
        }

        private bool IsInExcludedRange(int frequency, List<(float Start, float End)> excludedRanges)
        {
            return excludedRanges.Any(range => frequency >= range.Start && frequency <= range.End);
        }

        public List<RFBackupFrequency> GetBackupFrequenciesForDeviceType(string brand, string model, string frequency)
        {
            return BackupFrequencies
                .Where(f => f.Brand == brand && f.Model == model && f.Frequency == frequency)
                .ToList();
        }

        public async Task SaveBackupFrequencyAsync(RFBackupFrequency frequency)
        {
            if (frequency.ID == 0)
            {
                await _context.AddItemAsync(frequency);
                BackupFrequencies.Add(frequency);
            }
            else
            {
                await _context.UpdateItemAsync(frequency);
                var index = BackupFrequencies.IndexOf(BackupFrequencies.First(f => f.ID == frequency.ID));
                if (index != -1)
                {
                    BackupFrequencies[index] = frequency;
                }
            }
        }

        public async Task DeleteBackupFrequencyAsync(RFBackupFrequency frequency)
        {
            await _context.DeleteItemAsync(frequency);
            BackupFrequencies.Remove(frequency);
        }
        public async Task DeleteBackupFrequenciesForDeviceTypeAsync(string brand, string model, string frequency)
        {
            var frequencies = await _context.GetFilteredAsync<RFBackupFrequency>(
                f => f.Brand == brand && f.Model == model && f.Frequency == frequency);
            foreach (var f in frequencies)
            {
                await DeleteBackupFrequencyAsync(f);
            }
        }
        public async Task DeleteAllBackupFrequenciesAsync()
        {
            await _context.DeleteAllAsync<RFBackupFrequency>();
            BackupFrequencies.Clear();
        }
    }
} 