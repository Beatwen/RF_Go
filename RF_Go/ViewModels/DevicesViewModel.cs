using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RF_Go.Data;
using RF_Go.Models;
using System.Collections.ObjectModel;
using System.Diagnostics;

namespace RF_Go.ViewModels
{
    public partial class DevicesViewModel(DatabaseContext context) : ObservableObject
    {
        private readonly DatabaseContext _context = context ?? throw new ArgumentNullException(nameof(context));
        [ObservableProperty]
        private ObservableCollection<RFDevice> _devices = new();

        [ObservableProperty]
        public RFDevice _operatingDevice = new();

        [ObservableProperty]
        private bool _isBusy;

        [ObservableProperty]
        private string _busyText;

        public async Task LoadDevicesAsync()
        {
            Debug.WriteLine("calling loaddevice");
            try
            {
                var devices = await _context.GetAllAsync<RFDevice>();
                if (devices != null && devices.Any())
                {
                    Devices.Clear(); // Clear existing devices
                    foreach (var device in devices)
                    {
                        Devices.Add(device);
                    }
                    Debug.WriteLine($"Number of devices loaded: {Devices.Count}");
                }
                else
                {
                    Debug.WriteLine("No devices found in the database.");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error loading devices: {ex.Message}");
                throw; // Rethrow the exception to propagate it
            }
        }

        [RelayCommand]
        public void SetOperatingDevice(RFDevice Device)
        {
            System.Diagnostics.Debug.WriteLine("edit device!");
            OperatingDevice = Device ?? new();
        }


        [RelayCommand]
        public async Task SaveDeviceAsync()
        {
            Debug.WriteLine("Save function called !");
            Debug.WriteLine(_context == null);
            Debug.WriteLine(OperatingDevice.ChannelName);
            OperatingDevice.ID = 0;
            if (OperatingDevice is null)
                return;

            var (isValid, errorMessage) = OperatingDevice.Validate();
            if (!isValid)
            {
                await Shell.Current.DisplayAlert("Validation Error", errorMessage, "Ok");
                return;
            }
            
            var busyText = OperatingDevice.ID == 0 ? "Creating Device..." : "Updating Device...";
            await ExecuteAsync(async () =>
            {
                if (OperatingDevice.ID == 0)
                {
                    // Create Device
                    await _context.AddItemAsync<RFDevice>(OperatingDevice);
                    evices.Add(OperatingDevice);
                }
                else
                {
                    // Update Device
                    if(await _context.UpdateItemAsync<RFDevice>(OperatingDevice))
                    {
                        var DeviceCopy = OperatingDevice.Clone();

                        var index = Devices.IndexOf(OperatingDevice);
                        Devices.RemoveAt(index);

                        Devices.Insert(index, DeviceCopy);
                    }
                    else
                    {
                        await Shell.Current.DisplayAlert("Error", "Device updation error", "Ok");
                        return;
                    }
                }
                //SetOperatingDeviceCommand.Execute(new());
            }, busyText);
        }

        [RelayCommand]
        public async Task DeleteDeviceAsync(int id)
        {
            await ExecuteAsync(async () =>
            {
                if (await _context.DeleteItemByKeyAsync<RFDevice>(id))
                {
                    var Device = Devices.FirstOrDefault(p => p.ID == id);
                    Devices.Remove(Device);
                }
                else
                {
                    await Shell.Current.DisplayAlert("Delete Error", "Device was not deleted", "Ok");
                }
            }, "Deleting Device...");
        }

        private async Task ExecuteAsync(Func<Task> operation, string busyText = null)
        {
            IsBusy = true;
            BusyText = busyText ?? "Processing...";
            try
            {
                await operation?.Invoke();
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Error loading devices: {ex.Message}");


                throw; // Rethrow the exception to propagate it
                /*
                 * {System.TypeInitializationException: The type initializer for 'SQLite.SQLiteConnection' threw an exception.
                 ---> System.IO.FileNotFoundException: Could not load file or assembly 'SQLitePCLRaw.provider.dynamic_cdecl, Version=2.0.4.976, Culture=neutral, PublicKeyToken=b68184102cba0b3b' or one of its dependencies.
                File name: 'SQLitePCLRaw.provider.dynamic_cdecl, Version=2.0.4.976, Culture=neutral, PublicKeyToken=b68184102cba0b3b'
                   at SQLitePCL.Batteries_V2.Init()
                   at SQLite.SQLiteConnection..cctor()
                   --- End of inner exception stack trace ---
                   at SQLite.SQLiteConnectionWithLock..ctor(SQLiteConnectionString connectionString)
                   at SQLite.SQLiteConnectionPool.Entry..ctor(SQLiteConnectionString connectionString)
                   at SQLite.SQLiteConnectionPool.GetConnectionAndTransactionLock(SQLiteConnectionString connectionString, Object& transactionLock)
                   at SQLite.SQLiteConnectionPool.GetConnection(SQLiteConnectionString connectionString)
                   at SQLite.SQLiteAsyncConnection.GetConnection()
                   at SQLite.SQLiteAsyncConnection.<>c__DisplayClass33_0`1[[SQLite.CreateTableResult, SQLite-net, Version=1.8.116.0, Culture=neutral, PublicKeyToken=null]].<WriteAsync>b__0()
                   at System.Threading.Tasks.Task`1[[SQLite.CreateTableResult, SQLite-net, Version=1.8.116.0, Culture=neutral, PublicKeyToken=null]].InnerInvoke()
                   at System.Threading.Tasks.Task.<>c.<.cctor>b__273_0(Object obj)
                   at System.Threading.ExecutionContext.RunFromThreadPoolDispatchLoop(Thread threadPoolThread, ExecutionContext executionContext, ContextCallback callback, Object state)
                --- End of stack trace from previous location ---
                   at System.Threading.ExecutionContext.RunFromThreadPoolDispatchLoop(Thread threadPoolThread, ExecutionContext executionContext, ContextCallback callback, Object state)
                   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)
                --- End of stack trace from previous location ---
                   at MAUISql.Data.DatabaseContext.<CreateTableIfNotExists>d__6`1[[MAUISql.Models.Device, MAUISql, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]].MoveNext() in D:\MAUI\MAUISql\MAUISql\Data\DatabaseContext.cs:line 18
                   at MAUISql.Data.DatabaseContext.<GetTableAsync>d__7`1[[MAUISql.Models.Device, MAUISql, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]].MoveNext() in D:\MAUI\MAUISql\MAUISql\Data\DatabaseContext.cs:line 23
                   at MAUISql.Data.DatabaseContext.<GetAllAsync>d__8`1[[MAUISql.Models.Device, MAUISql, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]].MoveNext() in D:\MAUI\MAUISql\MAUISql\Data\DatabaseContext.cs:line 29
                   at MAUISql.ViewModels.DevicesViewModel.<LoadDevicesAsync>b__6_0() in D:\MAUI\MAUISql\MAUISql\ViewModels\DevicesViewModel.cs:line 34
                   at MAUISql.ViewModels.DevicesViewModel.ExecuteAsync(Func`1 operation, String busyText) in D:\MAUI\MAUISql\MAUISql\ViewModels\DevicesViewModel.cs:line 103}
                 */
            }
            finally
            {
                IsBusy = false;
                BusyText = "Processing...";
            }
        }
    }
}
