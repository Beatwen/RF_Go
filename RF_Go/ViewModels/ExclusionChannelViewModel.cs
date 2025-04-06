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
        private ObservableCollection<ExclusionChannel> _userAddedChannels = new();

        [ObservableProperty]
        private string _selectedCountry = "Generic-8MHz";
        [ObservableProperty]
        private string _searchQuery;

        [ObservableProperty]
        private ExclusionChannel _selectedExclusionChannel = new();

        public async Task LoadExclusionChannelsAsync()
        {
            try
            {
                var exclusionChannelsFromDb = await _context.GetAllAsync<ExclusionChannel>();
                FilterExclusionChannels(exclusionChannelsFromDb);
                FilterUserAddedChannels(exclusionChannelsFromDb);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error loading exclusion channels: {ex.Message}");
            }
        }

        private void FilterUserAddedChannels(IEnumerable<ExclusionChannel> exclusionChannels)
        {
            var filteredChannels = exclusionChannels
                .Where(channel => channel.Country.Equals("User"));
            if (!string.IsNullOrEmpty(SearchQuery))
            {
                filteredChannels = filteredChannels.Where(channel =>
                    channel.ChannelNumber.ToString().Contains(SearchQuery) ||
                    channel.StartFrequency.ToString().Contains(SearchQuery) ||
                    channel.EndFrequency.ToString().Contains(SearchQuery));
            }
            UserAddedChannels.Clear();
            foreach (var channel in filteredChannels)
            {
                UserAddedChannels.Add(channel);
            }
        }

        private void FilterExclusionChannels(IEnumerable<ExclusionChannel> exclusionChannels)
        {
            var filteredChannels = exclusionChannels
                .Where(channel => string.IsNullOrEmpty(SelectedCountry) || channel.Country.Equals(SelectedCountry));

            if (!string.IsNullOrEmpty(SearchQuery))
            {
                filteredChannels = filteredChannels.Where(channel =>
                    channel.ChannelNumber.ToString().Contains(SearchQuery) ||
                    channel.StartFrequency.ToString().Contains(SearchQuery) ||
                    channel.EndFrequency.ToString().Contains(SearchQuery));
            }
            ExclusionChannels.Clear();
            foreach (var channel in filteredChannels)
            {
                ExclusionChannels.Add(channel);
            }
        }

        [RelayCommand]
        public async Task ApplyFilters()
        {
            await LoadExclusionChannelsAsync();
        }
        [RelayCommand]
        public async Task SaveUserChannelAsync(ExclusionChannel exclusionChannel)
        {
            UserAddedChannels.Add(exclusionChannel);
            await _context.AddItemAsync<ExclusionChannel>(exclusionChannel);
        }

        [RelayCommand]
        public async Task SaveExclusionChannelAsync()
        {

            await _context.UpdateItemAsync<ExclusionChannel>(SelectedExclusionChannel);
            await LoadExclusionChannelsAsync();
        }

        [RelayCommand]
        public async Task SaveByIDExclusionChannelAsync(ExclusionChannel chan)
        {
            if (chan.ID == 0)
            {
                await _context.AddItemAsync<ExclusionChannel>(chan);
            }
            else
            {
                await _context.UpdateItemAsync<ExclusionChannel>(chan);
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
