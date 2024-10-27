using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RF_Go.Data;
using RF_Go.Models;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Formats.Asn1;


namespace RF_Go.ViewModels
    {
        public partial class GroupsViewModel(DatabaseContext context) : ObservableObject
        {
            private readonly DatabaseContext _context = context ?? throw new ArgumentNullException(nameof(context));
            [ObservableProperty]
            private ObservableCollection<RFGroup> _groups = new();

            [ObservableProperty]
            private RFGroup _operatingGroup = new();
            [ObservableProperty]
            private bool _isBusy;

            [ObservableProperty]
            private string _busyText;
            public async Task AddGroupAsync(RFGroup group)
        {
                try
            {
                    if (group == null)
                        return;

                    await _context.AddItemAsync(group);
                    Groups.Add(group);
                }
                catch (Exception ex)
            {
                    Debug.WriteLine($"Error adding group: {ex.Message}");
                    throw;
                }
            }
            public async Task DeleteGroupAsync(RFGroup group)
            {
                    try
                    {
                        if (group == null)
                            return;

                        await _context.DeleteItemAsync(group);
                        Groups.Remove(group);
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine($"Error deleting group: {ex.Message}");
                        throw;
                    }
            }
            public async Task UpdateGroupAsync(RFGroup group)
            {
            
                try
                {
                    if (group == null)
                        return;
                    Debug.Print("Updating group");
                    await _context.UpdateItemAsync(group);

                    // Find the group by ID instead of using IndexOf
                    for (int i = 0; i < Groups.Count; i++)
                    {
                        if (Groups[i].ID == group.ID)
                        {
                            Groups[i] = group.Clone();
                            return; // Exit the method after updating the group
                        }
                    }

                    // Optionally, handle the case where no group matches the ID
                    Debug.WriteLine("No matching group found to update.");
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Error updating group: {ex.Message}");
                    throw;
                }
            }
            public async Task LoadGroupsAsync()
                {
                    try
                    {
                        var groups = await _context.GetAllAsync<RFGroup>();
                        if (groups != null && groups.Any())
                        {
                            Groups.Clear();
                            foreach (var group in groups)
                            {
                                Groups.Add(group);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine($"Error loading groups: {ex.Message}");
                        throw;
                    }
                }
            [RelayCommand]
            public void SetOperatingGroup(RFGroup group)
            {
                OperatingGroup = group ?? new();
            }
            [RelayCommand]
            public async Task SaveGroupAsync(string name)
            {
                if (OperatingGroup == null)
                    return;

                var busyText = OperatingGroup.ID == 0 ? "Creating Group..." : "Updating Group...";
                await ExecuteAsync(async () =>
                {
                    if (OperatingGroup.ID == 0)
                    {
                        await _context.AddItemAsync<RFGroup>(OperatingGroup);
                        Groups.Add(OperatingGroup);
                    }
                    else
                    {
                        if (await _context.UpdateItemAsync<RFGroup>(OperatingGroup))
                        {
                            var index = Groups.IndexOf(OperatingGroup);
                            Groups[index] = OperatingGroup.Clone(); 
                        }
                    }
                }, busyText);
            }
            public string GetGroupName(int groupId)
            {
                var group = Groups.FirstOrDefault(g => g.ID == groupId);
                return group?.Name ?? "Unnamed Group";
            }
            public async Task UpdateDeviceGroupAsync(RFDevice device, int newGroupId)
            {
                var oldGroup = await _context.GetGroupById(device.GroupID);
                var newGroup = await _context.GetGroupById(newGroupId);

                if (oldGroup != null)
                {
                    oldGroup.RemoveDevice(device);
                }

                if (newGroup != null)
                {
                    newGroup.AddDevice(device);
                    device.GroupID = newGroupId;
                    device.Group = newGroup;
                    await _context.UpdateItemAsync(device);
                }
                else
                {
                    device.GroupID = 0;
                    device.Group = null;
                    await _context.UpdateItemAsync(device);
                }
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
                    await Application.Current.MainPage.DisplayAlert("Error", "An unexpected error occurred.", "OK");
                }
                finally
                {
                    IsBusy = false;
                    BusyText = "";
                }
            }
    }
}
