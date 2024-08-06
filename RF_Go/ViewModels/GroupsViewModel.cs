using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RF_Go.Data;
using RF_Go.Models;
using System.Collections.ObjectModel;
using System.Diagnostics;

namespace RF_Go.ViewModels
{
    public partial class GroupsViewModel(DatabaseContext context) : ObservableObject
    {
        private readonly DatabaseContext _context = context ?? throw new ArgumentNullException(nameof(context));
        [ObservableProperty]
        private ObservableCollection<RFGroup> _groups = new();
        public async Task LoadGroupsAsync()
        {
            Debug.WriteLine("Calling LoadGroups");
            try
            {
                var groups = await _context.GetAllAsync<RFGroup>();
                if (groups != null && groups.Any())
                {
                    Groups.Clear(); // Clear existing groups
                    foreach (var group in groups)
                    {
                        Groups.Add(group);
                    }
                    Debug.WriteLine($"Number of groups loaded: {Groups.Count}");
                }
                else
                {
                    Debug.WriteLine("No groups found in the database.");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error loading groups: {ex.Message}");
                throw; // Rethrow the exception to propagate it
            }
        }

        public string GetGroupName(int groupId)
        {
            var group = Groups.FirstOrDefault(g => g.ID == groupId);
            return group?.Name ?? "Unknown Group";
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
    }
}
