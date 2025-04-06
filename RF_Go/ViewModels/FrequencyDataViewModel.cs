using LiveChartsCore.SkiaSharpView.Drawing.Geometries;
using LiveChartsCore.SkiaSharpView;
using LiveChartsCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using RF_Go.Data;
using System.Collections.ObjectModel;
using RF_Go.Models;
using System.Diagnostics;

namespace RF_Go.ViewModels
{
    public partial class FrequencyDataViewModel : ObservableObject
    {
        private readonly DatabaseContext _context;

        public FrequencyDataViewModel(DatabaseContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [ObservableProperty]
        private FrequencyData _frequencyData = new();
        [ObservableProperty]
        private bool _isBusy;
        [ObservableProperty]
        private string _busyText;

        public async Task LoadFrequencyDataAsync()
        {
            try
            {
                var frequencyData = await _context.GetAllAsync<FrequencyData>();
                if (frequencyData != null && frequencyData.Any())
                {
                    FrequencyData = frequencyData.First();
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error loading frequency data: {ex.Message}");
                throw; // Rethrow the exception to propagate it
            }
        }

        public async Task SaveFrequencyDataAsync()
        {
            var busyText = "Saving Frequency Data...";
            await ExecuteAsync(async () =>
            {
                if (FrequencyData.ID == 0)
                {
                    // Create FrequencyData
                    await _context.AddItemAsync(FrequencyData);
                }
                else
                {
                    // Update FrequencyData
                    await _context.UpdateItemAsync(FrequencyData);
                }
            }, busyText);
        }

        private async Task ExecuteAsync(Func<Task> operation, string busyText = null)
        {
            IsBusy = true;
            BusyText = busyText ?? "Processing...";
            try
            {
                await operation?.Invoke();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error: {ex.Message}");
                throw; // Rethrow the exception to propagate it
            }
            finally
            {
                IsBusy = false;
                BusyText = null;
            }
        }
    }
}
