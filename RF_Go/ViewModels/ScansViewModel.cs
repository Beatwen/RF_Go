using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RF_Go.Data;
using RF_Go.Models;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Text.Json;

namespace RF_Go.ViewModels
{
    public partial class ScansViewModel : ObservableObject
    {
        private readonly DatabaseContext _context;

        [ObservableProperty]
        private ObservableCollection<ScanData> _scans = new();

        [ObservableProperty]
        private ScanData _operatingScan = new();

        [ObservableProperty]
        private bool _isBusy;

        [ObservableProperty]
        private string _busyText;

        public ScansViewModel(DatabaseContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task LoadScansAsync()
        {
            try
            {
                var scans = await _context.GetAllAsync<ScanData>();
                if (scans != null && scans.Any())
                {
                    Scans.Clear();
                    foreach (var scan in scans)
                    {
                        Scans.Add(scan);
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error loading scans: {ex.Message}");
                throw;
            }
        }

        public async Task AddScanAsync(ScanData scan)
        {
            try
            {
                if (scan == null)
                    return;

                await _context.AddItemAsync(scan);
                Scans.Add(scan);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error adding scan: {ex.Message}");
                throw;
            }
        }

        public async Task DeleteScanAsync(ScanData scan)
        {
            try
            {
                if (scan == null)
                    return;

                await _context.DeleteItemAsync(scan);
                Scans.Remove(scan);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error deleting scan: {ex.Message}");
                throw;
            }
        }

        public async Task UpdateScanAsync(ScanData scan)
        {
            try
            {
                if (scan == null)
                    return;

                await _context.UpdateItemAsync(scan);
                var index = Scans.IndexOf(scan);
                if (index != -1)
                {
                    Scans[index] = scan;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error updating scan: {ex.Message}");
                throw;
            }
        }

        public async Task ToggleScanVisibility(ScanData scan)
        {
            if (scan == null)
                return;

            scan.IsVisible = !scan.IsVisible;
            await _context.UpdateItemAsync(scan);
        }

        public bool IsScanVisible(ScanData scan)
        {
            return scan != null && scan.IsVisible;
        }

        [RelayCommand]
        public void SetOperatingScan(ScanData scan)
        {
            OperatingScan = scan ?? new();
        }

        public async Task ExecuteAsync(Func<Task> action, string busyText = "")
        {
            try
            {
                IsBusy = true;
                BusyText = busyText;
                await action();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"An error occurred during the execution: {ex.Message}");
                throw;
            }
            finally
            {
                IsBusy = false;
                BusyText = "";
            }
        }

        public List<double> GetFrequencies(ScanData scan)
        {
            if (string.IsNullOrEmpty(scan.FrequenciesJson))
                return new List<double>();
            return JsonSerializer.Deserialize<List<double>>(scan.FrequenciesJson);
        }

        public List<double> GetValues(ScanData scan)
        {
            if (string.IsNullOrEmpty(scan.ValuesJson))
                return new List<double>();
            return JsonSerializer.Deserialize<List<double>>(scan.ValuesJson);
        }
    }
} 