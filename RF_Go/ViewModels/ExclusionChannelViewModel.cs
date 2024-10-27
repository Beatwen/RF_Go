using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RF_Go.Data;
using RF_Go.Models;
using System.Diagnostics;

namespace RF_Go.ViewModels
{
    public partial class ExclusionChannelViewModel : ObservableObject
    {
        private readonly DatabaseContext _context;

        public ExclusionChannelViewModel(DatabaseContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [ObservableProperty]
        private ObservableCollection<ExclusionChannel> _exclusionChannels = new();

        [ObservableProperty]
        private string _selectedCountry;

        [ObservableProperty]
        private string _searchQuery;

        [ObservableProperty]
        private ExclusionChannel _selectedExclusionChannel = new();

        public async Task LoadExclusionChannelsAsync()
        {
            try
            {
                // Récupère les données brutes depuis la base de données
                var exclusionChannelsFromDb = await _context.GetAllAsync<ExclusionChannel>();

                // Applique les filtres
                FilterExclusionChannels(exclusionChannelsFromDb);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error loading exclusion channels: {ex.Message}");
            }
        }

        private void FilterExclusionChannels(IEnumerable<ExclusionChannel> exclusionChannels)
        {
            // Filtre par pays
            var filteredChannels = exclusionChannels
                .Where(channel => string.IsNullOrEmpty(SelectedCountry) || channel.Country.Equals(SelectedCountry));

            // Filtre par fréquence ou numéro de canal
            if (!string.IsNullOrEmpty(SearchQuery))
            {
                filteredChannels = filteredChannels.Where(channel =>
                    channel.ChannelNumber.ToString().Contains(SearchQuery) ||
                    channel.StartFrequency.Contains(SearchQuery) ||
                    channel.EndFrequency.Contains(SearchQuery));
            }
            Debug.Print("Filtering" + filteredChannels.First().ChannelNumber);
            // Met à jour la collection ObservableCollection
            ExclusionChannels.Clear();
            foreach (var channel in filteredChannels)
            {
                ExclusionChannels.Add(channel);
            }
        }

        [RelayCommand]
        public async Task ApplyFilters()
        {
            // Relance le chargement des données avec les filtres appliqués
            await LoadExclusionChannelsAsync();
        }

        [RelayCommand]
        public async Task SaveExclusionChannelAsync()
        {
            if (SelectedExclusionChannel.ID == 0)
            {
                await _context.AddItemAsync<ExclusionChannel>(SelectedExclusionChannel);
            }
            else
            {
                await _context.UpdateItemAsync<ExclusionChannel>(SelectedExclusionChannel);
            }

            await LoadExclusionChannelsAsync();
        }

        [RelayCommand]
        public async Task DeleteExclusionChannelAsync()
        {
            if (SelectedExclusionChannel != null)
            {
                await _context.DeleteItemAsync<ExclusionChannel>(SelectedExclusionChannel);
                await LoadExclusionChannelsAsync();
            }
        }

        public void NewExclusionChannel()
        {
            SelectedExclusionChannel = new ExclusionChannel();
        }
    }
}
