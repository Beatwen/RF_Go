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
                // don't forget to reassign devices to default group
                    try
                    {
                        if (group == null)
                            return;

                        if (group.ID == 1)
                        {
                            Debug.WriteLine("Cannot delete Default Group");
                            return;
                        }

                        var devicesToReassign = await _context.GetAllAsync<RFDevice>();
                        var affectedDevices = devicesToReassign.Where(d => d.GroupID == group.ID).ToList();

                        foreach (var device in affectedDevices)
                        {
                            device.GroupID = 1;
                            await _context.UpdateItemAsync(device);
                            Debug.WriteLine($"Device {device.Name} reassigned to Default Group");
                        }

                        await _context.DeleteItemAsync(group);
                        Groups.Remove(group);
                        
                        Debug.WriteLine($"Group '{group.Name}' deleted and {affectedDevices.Count} devices reassigned to Default Group");
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
                    Debug.WriteLine("Starting LoadGroupsAsync");
                    var groups = await _context.GetAllAsync<RFGroup>();
                    
                    if (groups != null && groups.Any())
                    {
                        Groups.Clear();
                        foreach (var group in groups)
                        {
                            Groups.Add(group);
                        }
                        Debug.WriteLine($"Added {Groups.Count} groups to collection");
                    }
                    else
                    {
                        Debug.WriteLine("No groups found in database, creating default group");
                        // Créer un groupe par défaut si aucun n'existe
                        var defaultGroup = new RFGroup { Name = "Default Group" };
                        await _context.AddItemAsync(defaultGroup);
                        Groups.Clear();
                        Groups.Add(defaultGroup);
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Error loading groups: {ex.Message}");
                    Debug.WriteLine($"Stack trace: {ex.StackTrace}");
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
