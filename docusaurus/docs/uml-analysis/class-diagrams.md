# Diagrammes de classes

Les diagrammes de classes de RF.Go illustrent l'**architecture orientée objet** complète du système. Cette modélisation détaille la structure statique, les relations entre classes, et les patterns de conception utilisés pour créer une architecture robuste et extensible basée sur l'analyse du code source réel.

## Vue d'ensemble de l'application

```mermaid
classDiagram
    %% Modèles de Base de Données (Réels)
    class RFDevice {
        +int ID
        +string SerialNumber
        +bool Selected
        +string Brand
        +string Model
        +string Name
        +string Frequency
        +List~int~ Range
        +string RangeSerialized
        +List~RFChannel~ Channels
        +string ChannelsSerialized
        +string IpAddress
        +string Calendar
        +string Stage
        +bool IsSynced
        +bool IsOnline
        +bool PendingSync
        +int NumberOfChannels
        +int GroupID
        +RFGroup Group
        +int Step
        +Clone() RFDevice
        +Validate() (bool IsValid, string ErrorMessage)
        +OnPropertyChanged(string propertyName)
    }

    class RFChannel {
        +int ID
        +bool Selected
        +int chanNumber
        +int Frequency
        +List~int~ Range
        +string RangeSerialized
        +int Step
        +int SelfSpacing
        +int ThirdOrderSpacing
        +bool ThirdOrderSpacingEnable
        +int FifthOrderSpacing
        +bool FifthOrderSpacingEnable
        +int SeventhOrderSpacing
        +bool SeventhOrderSpacingEnable
        +int NinthOrderSpacing
        +bool NinthOrderSpacingEnable
        +int ThirdOrderSpacing3Tx
        +bool ThirdOrderSpacing3TxEnable
        +bool Checked
        +string ChannelName
        +bool IsLocked
        +SetRandomFrequency(HashSet~int~ usedFreqs, HashSet~int~ intermod3rd, HashSet~int~ intermod5th, HashSet~int~ intermod7th, HashSet~int~ intermod9th, HashSet~int~ intermod3tx, List excludedRanges)
        +GetRandomFrequency(int min, int max, int step) int
        +LoopForFreeFrequency(HashSet~int~ usedFreqs, HashSet~int~ intermodulations, List excludedRanges) bool
        +CheckFreeFrequency(int frequency, HashSet~int~ usedFreqs, HashSet~int~ intermodulations) bool
        +SpacingEnable() bool
        +CalculAllIntermod(int frequency, HashSet~int~ usedFreqs) (HashSet~int~, HashSet~int~, HashSet~int~, HashSet~int~, HashSet~int~)
        +Clone() RFChannel
    }

    class RFGroup {
        +int ID
        +string Name
        +IReadOnlyList~TimePeriod~ TimePeriods
        +string TimePeriodsSerialized
        +IReadOnlyList~RFDevice~ Devices
        +AddTimePeriod(TimePeriod period)
        +DeleteTimePeriod(TimePeriod period)
        +AddDevice(RFDevice device)
        +RemoveDevice(RFDevice device)
        +Clone() RFGroup
    }

    class TimePeriod {
        +int ID
        +string Name
        +DateTime StartTime
        +DateTime EndTime
        +TimeSpan? StartTimeSpan
        +TimeSpan? EndTimeSpan
        +DateRange Range
        +UpdateRange()
        +ToString() string
    }

    class ExclusionChannel {
        +int ID
        +string Country
        +int ChannelNumber
        +float StartFrequency
        +float EndFrequency
        +string Type
        +bool Exclude
        +float ChannelWidth
    }

    class CountryChannelConfig {
        +int ID
        +string Country
        +int ChannelWidth
        +int StartChannel
        +int EndChannel
        +string DefaultFrequencyRange
    }

    class FrequencyData {
        +int ID
        +HashSet~int~ UsedFrequencies
        +string UsedFrequenciesSerialized
        +HashSet~int~ TwoTX3rdOrder
        +string TwoTX3rdOrderSerialized
        +HashSet~int~ TwoTX5rdOrder
        +string TwoTX5rdOrderSerialized
        +HashSet~int~ TwoTX7rdOrder
        +string TwoTX7rdOrderSerialized
        +HashSet~int~ TwoTX9rdOrder
        +string TwoTX9rdOrderSerialized
        +HashSet~int~ ThreeTX3rdOrder
        +string ThreeTX3rdOrderSerialized
        +Dictionary~int,FrequencyData~ GroupData
    }

    class RFBackupFrequency {
        +int ID
        +string Brand
        +string Model
        +string Frequency
        +int ChannelIndex
        +int BackupFrequency
        +bool IsUsed
        +float MinRange
        +float MaxRange
        +float Step
    }

    class DeviceDiscoveredEventArgs {
        +string Name
        +string Brand
        +string Type
        +string SerialNumber
        +string IPAddress
        +string Frequency
        +List~ChannelInfo~ Channels
        +bool IsSynced
    }

    class ChannelInfo {
        +int ChannelNumber
        +string Name
        +string Frequency
    }

    %% Services Réels
    class RFDeviceService {
        +List~RFDevice~ Devices
    }

    class RFchannelService {
        +List~RFChannel~ Channels
    }

    class FrequencyDataService {
        +FrequencyData FrequencyData
    }

    class FrequencyCalculationService {
        -DevicesViewModel _devicesViewModel
        -GroupsViewModel _groupsViewModel
        -BackupFrequenciesViewModel _backupFrequenciesViewModel
        -ExclusionChannelViewModel _exclusionChannelViewModel
        -FrequencyDataViewModel _frequencyDataViewModel
        +CalculateFrequenciesAsync() Task
        +FindOverlappingGroups() List~List~RFGroup~~
        +DoGroupsOverlap(RFGroup group1, RFGroup group2) bool
        +GetExcludedRanges() List~(float Start, float End)~
        +GetDevicesForGroupSet(List~RFGroup~ groupSet) List~RFDevice~
    }

    class DeviceMappingService {
        -UDPCommunicationService _communicationService
        -IDeviceCommandSet _commandSet
        -IEnumerable~IDeviceHandler~ _deviceHandlers
        -DevicesViewModel _devicesViewModel
        -DiscoveryService _discoveryService
        +CastDeviceDiscoveredToRFDevice(DeviceDiscoveredEventArgs device) RFDevice
        +FirstSyncToDevice(RFDevice offlineDevice, RFDevice onlineDevice) Task~List~string~~
        +SyncToDevice(RFDevice device) Task~List~string~~
        +FirstSyncFromDevice(RFDevice device) Task
        +SyncFromDevice(RFDevice device) Task
        +SyncAllFromDevice() Task~List~string~~
        +SyncAllToDevice() Task~List~string~~
        +FetchDeviceData(RFDevice device) Task~DeviceDiscoveredEventArgs~
        +IsDevicePendingSync(RFDevice device) Task~bool~
        -GetAppropriateHandler(RFDevice device) IDeviceHandler
    }

    class DiscoveryService {
        -MulticastService _multicastService
        -ServiceDiscovery _serviceDiscovery
        -List~IDeviceHandler~ _handlers
        -DevicesViewModel _devicesViewModel
        -Timer _syncTimer
        +List~DeviceDiscoveredEventArgs~ DiscoveredDevices
        +event EventHandler~DeviceDiscoveredEventArgs~ DeviceDiscovered
        +StartDiscovery() Task
        +StopDiscovery() Task
        +DetectDevicesAsync() Task
        +CheckDeviceSync(object state) Task
        +TriggerSennheiserDiscovery() Task
        +TriggerG4Discovery() Task
        +TriggerShureDiscovery() Task
        -OnServiceDiscovered(object sender, ServiceInstanceEventArgs e)
        -OnServiceInstanceDiscovered(object sender, ServiceInstanceEventArgs e)
        -GetAppropriateHandler(RFDevice device) IDeviceHandler
        -GetAppropriateHandlerForType(string brand, string type) IDeviceHandler
        -CheckSingleDeviceSync(RFDevice device) Task
    }

    %% Interfaces Réelles
    class IDeviceHandler {
        <<interface>>
        +string Brand
        +CanHandle(string serviceName) bool
        +HandleDevice(DeviceDiscoveredEventArgs deviceInfo) Task
        +IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo) Task~(bool IsEqual, bool IsNotResponding)~
        +SyncToDevice(DeviceDiscoveredEventArgs deviceInfo) Task~List~string~~
    }

    class IDeviceCommandSet {
        <<interface>>
        +GetModelCommand() string
        +GetFrequencyCodeCommand() string
        +GetSerialCommand() string
        +GetChannelFrequencyCommand(int channel) string
        +GetChannelNameCommand(int channel) string
        +GetSignalQualityCommand(int channel) string
        +SetChannelFrequencyCommand(int channel, int frequency) string
        +SetChannelNameCommand(int channel, string name) string
        +SetSignalQualityCommand(int channel, int quality) string
    }

    %% Handlers Réels
    class SennheiserDeviceHandler {
        -UDPCommunicationService _communicationService
        -SennheiserCommandSet _commandSet
        -int Port = 45
        +string Brand = "Sennheiser"
        +CanHandle(string serviceName) bool
        +HandleDevice(DeviceDiscoveredEventArgs deviceInfo) Task
        +IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo) Task~(bool, bool)~
        +SyncToDevice(DeviceDiscoveredEventArgs deviceInfo) Task~List~string~~
        +SendCommandAndExtractValueAsync(string ip, int port, string command, params string[] jsonPath) Task~string~
    }

    class SennheiserG4DeviceHandler {
        -UDPCommunicationService _communicationService
        -SennheiserG4CommandSet _commandSet
        -DeviceData _deviceData
        +string Brand = "Sennheiser"
        +CanHandle(string serviceName) bool
        +HandleDevice(DeviceDiscoveredEventArgs deviceInfo) Task
        +IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo) Task~(bool, bool)~
        +SyncToDevice(DeviceDiscoveredEventArgs deviceInfo) Task~List~string~~
        -DetermineFrequencyBand(int minFreq, int maxFreq) string
    }

    class ShureDeviceHandler {
        -TCPCommunicationService _communicationService
        -ShureCommandSet _commandSet
        +string Brand = "Shure"
        +CanHandle(string serviceName) bool
        +HandleDevice(DeviceDiscoveredEventArgs deviceInfo) Task
        +IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo) Task~(bool, bool)~
        +SyncToDevice(DeviceDiscoveredEventArgs deviceInfo) Task~List~string~~
        +SendCommandAndExtractValueAsync(string ip, string command) Task~string~
    }

    %% Command Sets Réels
    class SennheiserCommandSet {
        +GetModelCommand() string
        +GetFrequencyCodeCommand() string
        +GetSerialCommand() string
        +GetChannelNameCommand(int channel) string
        +GetChannelFrequencyCommand(int channel) string
        +GetSignalQualityCommand(int channel) string
        +SetChannelFrequencyCommand(int channel, int frequency) string
        +SetChannelNameCommand(int channel, string name) string
        +SetSignalQualityCommand(int channel, int quality) string
    }

    class SennheiserG4CommandSet {
        +GetModelCommand() string
        +GetFrequencyCodeCommand() string
        +GetSerialCommand() string
        +GetChannelNameCommand(int channel) string
        +GetChannelFrequencyCommand(int channel) string
        +GetSignalQualityCommand(int channel) string
        +GetMuteCommand(int channel) string
        +GetSensitivityCommand(int channel) string
        +GetModeCommand(int channel) string
        +SetChannelFrequencyCommand(int channel, int frequency) string
        +SetChannelNameCommand(int channel, string name) string
        +SetMuteCommand(int channel, bool mute) string
        +SetSensitivityCommand(int channel, int sensitivity) string
        +SetModeCommand(int channel, bool stereo) string
        +GetPushCommand(int timeoutSeconds, int cycleMilliseconds, int updateMode) string
        +GetBankListCommand(int bankNumber) string
    }

    class ShureCommandSet {
        +GetModelCommand() string
        +GetFrequencyCodeCommand() string
        +GetSerialCommand() string
        +GetChannelNameCommand(int channel) string
        +GetChannelFrequencyCommand(int channel) string
        +GetSignalQualityCommand(int channel) string
        +SetChannelFrequencyCommand(int channel, int frequency) string
        +SetChannelNameCommand(int channel, string name) string
        +SetSignalQualityCommand(int channel, int quality) string
    }

    %% Relations Réelles
    RFDevice "1" --> "*" RFChannel : contains
    RFDevice "*" --> "1" RFGroup : belongs to
    RFGroup "1" --> "*" TimePeriod : contains
    RFGroup "1" --> "*" RFDevice : contains
    DeviceDiscoveredEventArgs "1" --> "*" ChannelInfo : contains
    
    RFDeviceService "1" --> "*" RFDevice : manages
    RFchannelService "1" --> "*" RFChannel : manages
    FrequencyDataService "1" --> "1" FrequencyData : manages
    
    DiscoveryService "1" --> "*" IDeviceHandler : uses
    DiscoveryService "1" --> "*" DeviceDiscoveredEventArgs : discovers
    DeviceMappingService "1" --> "*" IDeviceHandler : uses
    FrequencyCalculationService --> DevicesViewModel : uses
    FrequencyCalculationService --> GroupsViewModel : uses
    FrequencyCalculationService --> BackupFrequenciesViewModel : uses
    
    IDeviceHandler <|.. SennheiserDeviceHandler : implements
    IDeviceHandler <|.. SennheiserG4DeviceHandler : implements
    IDeviceHandler <|.. ShureDeviceHandler : implements
    
    IDeviceCommandSet <|.. SennheiserCommandSet : implements
    IDeviceCommandSet <|.. SennheiserG4CommandSet : implements
    IDeviceCommandSet <|.. ShureCommandSet : implements
    
    SennheiserDeviceHandler --> SennheiserCommandSet : uses
    SennheiserG4DeviceHandler --> SennheiserG4CommandSet : uses
    ShureDeviceHandler --> ShureCommandSet : uses
```

## 1. Vue d'ensemble de l'architecture

### Architecture en couches avec séparation des responsabilités

```mermaid
classDiagram
    class PresentationLayer {
        <<abstract>>
        +DevicesViewModel
        +GroupsViewModel
        +BackupFrequenciesViewModel
        +FrequencyDataViewModel
        +ExclusionChannelViewModel
        +ScansViewModel
    }
    
    class ApplicationLayer {
        <<abstract>>
        +FrequencyCalculationService
        +DeviceMappingService
        +DiscoveryService
        +DatabaseImportExportService
        +ScanImportExportService
    }
    
    class DomainLayer {
        <<abstract>>
        +RFDevice
        +RFChannel
        +RFGroup
        +TimePeriod
        +ExclusionChannel
        +FrequencyData
        +RFBackupFrequency
    }
    
    class InfrastructureLayer {
        <<abstract>>
        +IDeviceHandler Implementations
        +IDeviceCommandSet Implementations
        +DatabaseContext
        +NetworkProtocols
        +Communication Services
    }
    
    PresentationLayer ..> ApplicationLayer : Uses
    ApplicationLayer ..> DomainLayer : Uses
    ApplicationLayer ..> InfrastructureLayer : Uses
    InfrastructureLayer ..> DomainLayer : Implements
```

## 2. Modèles métier (domain layer) - code réel

### Entités principales RF

```mermaid
classDiagram
    class RFDevice {
        +int ID
        +string SerialNumber
        +bool Selected
        +string Brand
        +string Model
        +string Name
        +string Frequency
        +List~int~ Range
        +string RangeSerialized
        +List~RFChannel~ Channels
        +string ChannelsSerialized
        +string IpAddress
        +string Calendar
        +string Stage
        +bool IsSynced
        +bool IsOnline
        +bool PendingSync
        +int NumberOfChannels
        +int GroupID
        +RFGroup Group
        +int Step
        
        +RFDevice Clone()
        +(bool IsValid, string ErrorMessage) Validate()
        +void OnPropertyChanged(string propertyName)
    }
    
    class RFChannel {
        +int ID
        +bool Selected
        +int chanNumber
        +int Frequency
        +List~int~ Range
        +string RangeSerialized
        +int Step
        +int SelfSpacing
        +int ThirdOrderSpacing
        +bool ThirdOrderSpacingEnable
        +int FifthOrderSpacing
        +bool FifthOrderSpacingEnable
        +int SeventhOrderSpacing
        +bool SeventhOrderSpacingEnable
        +int NinthOrderSpacing
        +bool NinthOrderSpacingEnable
        +int ThirdOrderSpacing3Tx
        +bool ThirdOrderSpacing3TxEnable
        +bool Checked
        +string ChannelName
        +bool IsLocked
        
        +void SetRandomFrequency(HashSet~int~ usedFreqs, HashSet~int~ intermod3rd, HashSet~int~ intermod5th, HashSet~int~ intermod7th, HashSet~int~ intermod9th, HashSet~int~ intermod3tx, List excludedRanges)
        +int GetRandomFrequency(int min, int max, int step)
        +bool LoopForFreeFrequency(HashSet~int~ usedFreqs, HashSet~int~ intermodulations, List excludedRanges)
        +bool CheckFreeFrequency(int frequency, HashSet~int~ usedFreqs, HashSet~int~ intermodulations)
        +bool SpacingEnable()
        +(HashSet~int~, HashSet~int~, HashSet~int~, HashSet~int~, HashSet~int~) CalculAllIntermod(int frequency, HashSet~int~ usedFreqs)
        +RFChannel Clone()
    }
    
    class RFGroup {
        +int ID
        +string Name
        +IReadOnlyList~TimePeriod~ TimePeriods
        +string TimePeriodsSerialized
        +IReadOnlyList~RFDevice~ Devices
        
        +void AddTimePeriod(TimePeriod period)
        +void DeleteTimePeriod(TimePeriod period)
        +void AddDevice(RFDevice device)
        +void RemoveDevice(RFDevice device)
        +RFGroup Clone()
    }
    
    class TimePeriod {
        +int ID
        +string Name
        +DateTime StartTime
        +DateTime EndTime
        +TimeSpan? StartTimeSpan
        +TimeSpan? EndTimeSpan
        +DateRange Range
        
        +void UpdateRange()
        +string ToString()
    }
    
    class ExclusionChannel {
        +int ID
        +string Country
        +int ChannelNumber
        +float StartFrequency
        +float EndFrequency
        +string Type
        +bool Exclude
        +float ChannelWidth
    }
    
    class RFBackupFrequency {
        +int ID
        +string Brand
        +string Model
        +string Frequency
        +int ChannelIndex
        +int BackupFrequency
        +bool IsUsed
        +float MinRange
        +float MaxRange
        +float Step
    }
    
    class CountryChannelConfig {
        +int ID
        +string Country
        +int ChannelWidth
        +int StartChannel
        +int EndChannel
        +string DefaultFrequencyRange
    }
    
    RFDevice "1" --> "*" RFChannel : contains
    RFGroup "1" --> "*" RFDevice : contains
    RFGroup "1" --> "*" TimePeriod : contains
    RFDevice "*" --> "1" RFGroup : belongs to
```

### Modèles de calcul RF et fréquences

```mermaid
classDiagram
    class FrequencyData {
        +int ID
        +HashSet~int~ UsedFrequencies
        +string UsedFrequenciesSerialized
        +HashSet~int~ TwoTX3rdOrder
        +string TwoTX3rdOrderSerialized
        +HashSet~int~ TwoTX5rdOrder
        +string TwoTX5rdOrderSerialized
        +HashSet~int~ TwoTX7rdOrder
        +string TwoTX7rdOrderSerialized
        +HashSet~int~ TwoTX9rdOrder
        +string TwoTX9rdOrderSerialized
        +HashSet~int~ ThreeTX3rdOrder
        +string ThreeTX3rdOrderSerialized
        +Dictionary~int,FrequencyData~ GroupData
        +string Color
        
        +bool IsFrequencyAvailable(int frequency)
        +void AddUsedFrequency(int frequency)
        +void RemoveUsedFrequency(int frequency)
        +bool HasConflict(int frequency)
        +void ClearAllData()
    }
    
    class DeviceDiscoveredEventArgs {
        +string Name
        +string Brand
        +string Type
        +string SerialNumber
        +string IPAddress
        +string Frequency
        +List~ChannelInfo~ Channels
        +bool IsSynced
    }
    
    class ChannelInfo {
        +int ChannelNumber
        +string Name
        +string Frequency
    }
    
    class DeviceData {
        +Dictionary~string,Dictionary~string,Dictionary~string,List~int~~~~ Brands
        
        +List~int~ GetFrequencyRange(string brand, string model, string frequency)
        +bool IsValidConfiguration(string brand, string model, string frequency)
        +List~string~ GetAvailableModels(string brand)
        +List~string~ GetAvailableFrequencies(string brand, string model)
    }
    
    DeviceDiscoveredEventArgs "1" --> "*" ChannelInfo : contains
    FrequencyData --> RFBackupFrequency : references
```

## 3. Services de domaine (application layer) - implémentation réelle

### Services RF et gestion des appareils

```mermaid
classDiagram
    class IFrequencyCalculationService {
        <<interface>>
        +Task CalculateFrequenciesAsync()
        +List~List~RFGroup~~ FindOverlappingGroups()
        +bool DoGroupsOverlap(RFGroup group1, RFGroup group2)
        +List~(float Start, float End)~ GetExcludedRanges()
    }
    
    class FrequencyCalculationService {
        -DevicesViewModel _devicesViewModel
        -GroupsViewModel _groupsViewModel
        -BackupFrequenciesViewModel _backupFrequenciesViewModel
        -ExclusionChannelViewModel _exclusionChannelViewModel
        -FrequencyDataViewModel _frequencyDataViewModel
        
        +Task CalculateFrequenciesAsync()
        +List~List~RFGroup~~ FindOverlappingGroups()
        +bool DoGroupsOverlap(RFGroup group1, RFGroup group2)
        +List~(float Start, float End)~ GetExcludedRanges()
        +List~RFDevice~ GetDevicesForGroupSet(List~RFGroup~ groupSet)
        +bool DoPeriodsOverlap(TimePeriod period1, TimePeriod period2)
        -void ProcessLockedChannels(List~RFDevice~ devices, FrequencyData groupData, List excludedRanges)
        -void ProcessUnlockedChannels(List~RFDevice~ devices, FrequencyData groupData, List excludedRanges)
        -void ProcessBackupFrequencies(List~RFDevice~ devices, FrequencyData groupData, List excludedRanges)
    }
    
    class IDiscoveryService {
        <<interface>>
        +event EventHandler~DeviceDiscoveredEventArgs~ DeviceDiscovered
        +Task StartDiscoveryAsync()
        +Task StopDiscoveryAsync()
        +List~DeviceDiscoveredEventArgs~ GetDiscoveredDevices()
        +Task CheckDeviceSync(object state)
    }
    
    class DiscoveryService {
        -MulticastService _multicastService
        -ServiceDiscovery _serviceDiscovery
        -List~IDeviceHandler~ _handlers
        -DevicesViewModel _devicesViewModel
        -Timer _syncTimer
        -UdpClient _g4UdpClient
        -CancellationTokenSource _g4DiscoveryCts
        -UdpClient _shureUdpClient
        -CancellationTokenSource _shureDiscoveryCts
        
        +List~DeviceDiscoveredEventArgs~ DiscoveredDevices
        +event EventHandler~DeviceDiscoveredEventArgs~ DeviceDiscovered
        +Task StartDiscoveryAsync()
        +Task StopDiscoveryAsync()
        +Task DetectDevicesAsync()
        +Task CheckDeviceSync(object state)
        +Task TriggerSennheiserDiscovery()
        +Task TriggerG4Discovery()
        +Task TriggerShureDiscovery()
        -void OnServiceDiscovered(object sender, ServiceInstanceEventArgs e)
        -void OnServiceInstanceDiscovered(object sender, ServiceInstanceEventArgs e)
        -IDeviceHandler GetAppropriateHandler(RFDevice device)
        -IDeviceHandler GetAppropriateHandlerForType(string brand, string type)
        -Task CheckSingleDeviceSync(RFDevice device)
        -DeviceDiscoveredEventArgs ParseShureSLPResponse(byte[] data)
    }
    
    IFrequencyCalculationService <|.. FrequencyCalculationService
    IDiscoveryService <|.. DiscoveryService
```

### Services de synchronisation et mapping

```mermaid
classDiagram
    class ISynchronizationService {
        <<interface>>
        +Task~List~string~~ SyncDeviceAsync(RFDevice device)
        +Task~List~string~~ SyncAllDevicesAsync()
        +Task SyncFromDeviceAsync(RFDevice device)
        +Task~bool~ IsDevicePendingSync(RFDevice device)
    }
    
    class DeviceMappingService {
        -UDPCommunicationService _communicationService
        -IDeviceCommandSet _commandSet
        -IEnumerable~IDeviceHandler~ _deviceHandlers
        -DevicesViewModel _devicesViewModel
        -DiscoveryService _discoveryService
        
        +Task~List~string~~ FirstSyncToDevice(RFDevice offlineDevice, RFDevice onlineDevice)
        +Task~List~string~~ SyncToDevice(RFDevice device)
        +Task FirstSyncFromDevice(RFDevice device)
        +Task SyncFromDevice(RFDevice device)
        +Task~List~string~~ SyncAllFromDevice()
        +Task~List~string~~ SyncAllToDevice()
        +Task~DeviceDiscoveredEventArgs~ FetchDeviceData(RFDevice device)
        +Task~bool~ IsDevicePendingSync(RFDevice device)
        +RFDevice CastDeviceDiscoveredToRFDevice(DeviceDiscoveredEventArgs device)
        -IDeviceHandler GetAppropriateHandler(RFDevice device)
    }
    
    class DatabaseImportExportService {
        -DatabaseContext _context
        
        +Task ExportDatabaseAsync()
        +Task ImportDatabaseAsync()
        -ImportData CreateExportData()
        -Task RestoreFromImportData(ImportData data)
        -Dictionary~int,int~ CreateGroupIdMapping(List~RFGroup~ importedGroups)
        -void ApplyGroupIdMapping(List~RFDevice~ devices, Dictionary~int,int~ groupIdMapping)
    }
    
    class ScanImportExportService {
        -DatabaseContext _context
        
        +Task ExportScansAsync()
        +Task ImportScansAsync()
        +Task~ScanData~ CreateScanExportData()
        +Task RestoreFromScanData(ScanData data)
    }
    
    ISynchronizationService <|.. DeviceMappingService
```

## 4. Handlers et adaptateurs (infrastructure layer) - patterns réels

### Handlers de protocoles réseau

```mermaid
classDiagram
    class IDeviceHandler {
        <<interface>>
        +string Brand
        +bool CanHandle(string serviceName)
        +Task HandleDevice(DeviceDiscoveredEventArgs deviceInfo)
        +Task~(bool IsEqual, bool IsNotResponding)~ IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo)
        +Task~List~string~~ SyncToDevice(DeviceDiscoveredEventArgs deviceInfo)
    }
    
    class SennheiserDeviceHandler {
        -UDPCommunicationService _communicationService
        -SennheiserCommandSet _commandSet
        -int Port = 45
        
        +string Brand = "Sennheiser"
        +bool CanHandle(string serviceName)
        +Task HandleDevice(DeviceDiscoveredEventArgs deviceInfo)
        +Task~(bool IsEqual, bool IsNotResponding)~ IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo)
        +Task~List~string~~ SyncToDevice(DeviceDiscoveredEventArgs deviceInfo)
        +Task~string~ SendCommandAndExtractValueAsync(string ip, int port, string command, params string[] jsonPath)
    }
    
    class SennheiserG4DeviceHandler {
        -UDPCommunicationService _communicationService
        -SennheiserG4CommandSet _commandSet
        -DeviceData _deviceData
        -int Port = 53212
        
        +string Brand = "Sennheiser"
        +bool CanHandle(string serviceName)
        +Task HandleDevice(DeviceDiscoveredEventArgs deviceInfo)
        +Task~(bool IsEqual, bool IsNotResponding)~ IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo)
        +Task~List~string~~ SyncToDevice(DeviceDiscoveredEventArgs deviceInfo)
        -string DetermineFrequencyBand(int minFreq, int maxFreq)
    }
    
    class ShureDeviceHandler {
        -TCPCommunicationService _communicationService
        -ShureCommandSet _commandSet
        -int Port = 2202
        
        +string Brand = "Shure"
        +bool CanHandle(string serviceName)
        +Task HandleDevice(DeviceDiscoveredEventArgs deviceInfo)
        +Task~(bool IsEqual, bool IsNotResponding)~ IsDevicePendingSync(DeviceDiscoveredEventArgs deviceInfo)
        +Task~List~string~~ SyncToDevice(DeviceDiscoveredEventArgs deviceInfo)
        +Task~string~ SendCommandAndExtractValueAsync(string ip, string command)
    }
    
    IDeviceHandler <|.. SennheiserDeviceHandler
    IDeviceHandler <|.. SennheiserG4DeviceHandler
    IDeviceHandler <|.. ShureDeviceHandler
```

### Command sets et patterns de commande

```mermaid
classDiagram
    class IDeviceCommandSet {
        <<interface>>
        +string GetModelCommand()
        +string GetFrequencyCodeCommand()
        +string GetSerialCommand()
        +string GetChannelFrequencyCommand(int channel)
        +string GetChannelNameCommand(int channel)
        +string GetSignalQualityCommand(int channel)
        +string SetChannelFrequencyCommand(int channel, int frequency)
        +string SetChannelNameCommand(int channel, string name)
        +string SetSignalQualityCommand(int channel, int quality)
    }
    
    class SennheiserCommandSet {
        +string GetModelCommand()
        +string GetFrequencyCodeCommand()
        +string GetSerialCommand()
        +string GetChannelNameCommand(int channel)
        +string GetChannelFrequencyCommand(int channel)
        +string GetSignalQualityCommand(int channel)
        +string SetChannelFrequencyCommand(int channel, int frequency)
        +string SetChannelNameCommand(int channel, string name)
        +string SetSignalQualityCommand(int channel, int quality)
    }
    
    class SennheiserG4CommandSet {
        +string GetModelCommand()
        +string GetFrequencyCodeCommand()
        +string GetSerialCommand()
        +string GetChannelNameCommand(int channel)
        +string GetChannelFrequencyCommand(int channel)
        +string GetSignalQualityCommand(int channel)
        +string GetMuteCommand(int channel)
        +string GetSensitivityCommand(int channel)
        +string GetModeCommand(int channel)
        +string SetChannelFrequencyCommand(int channel, int frequency)
        +string SetChannelNameCommand(int channel, string name)
        +string SetMuteCommand(int channel, bool mute)
        +string SetSensitivityCommand(int channel, int sensitivity)
        +string SetModeCommand(int channel, bool stereo)
        +string GetPushCommand(int timeoutSeconds, int cycleMilliseconds, int updateMode)
        +string GetBankListCommand(int bankNumber)
    }
    
    class ShureCommandSet {
        +string GetModelCommand()
        +string GetFrequencyCodeCommand()
        +string GetSerialCommand()
        +string GetChannelNameCommand(int channel)
        +string GetChannelFrequencyCommand(int channel)
        +string GetSignalQualityCommand(int channel)
        +string SetChannelFrequencyCommand(int channel, int frequency)
        +string SetChannelNameCommand(int channel, string name)
        +string SetSignalQualityCommand(int channel, int quality)
    }
    
    IDeviceCommandSet <|.. SennheiserCommandSet
    IDeviceCommandSet <|.. SennheiserG4CommandSet
    IDeviceCommandSet <|.. ShureCommandSet
    
    SennheiserDeviceHandler --> SennheiserCommandSet : uses
    SennheiserG4DeviceHandler --> SennheiserG4CommandSet : uses
    ShureDeviceHandler --> ShureCommandSet : uses
```

## 5. ViewModels et presentation layer - MVVM réel

### ViewModels architecture

```mermaid
classDiagram
    class BaseViewModel {
        <<abstract>>
        +event PropertyChangedEventHandler PropertyChanged
        +bool IsBusy
        
        #bool SetProperty<T>(ref T field, T value, string propertyName)
        #void OnPropertyChanged(string propertyName)
        +virtual Task InitializeAsync()
        +virtual void Cleanup()
        #Task ExecuteAsync(Func~Task~ operation, string busyText)
    }
    
    class DevicesViewModel {
        -DatabaseContext _context
        -ObservableCollection<RFDevice> _devices
        -RFDevice _operatingDevice
        
        +ObservableCollection<RFDevice> Devices
        +RFDevice OperatingDevice
        +event EventHandler DevicesChanged
        
        +Task LoadDevicesAsync()
        +Task SaveDeviceAsync(RFDevice device)
        +Task SaveAllDevicesAsync()
        +Task DeleteDeviceAsync(RFDevice device)
        +Task DeleteAllDeviceAsync()
        +void SaveDataDevicesInfo(RFDevice device)
        +void SaveDataChannelsInfo(RFDevice device)
        +Task RefreshDevicesAsync()
    }
    
    class GroupsViewModel {
        -DatabaseContext _context
        -ObservableCollection<RFGroup> _groups
        -RFGroup _operatingGroup
        
        +ObservableCollection<RFGroup> Groups
        +RFGroup OperatingGroup
        
        +Task LoadGroupsAsync()
        +Task SaveGroupAsync()
        +Task DeleteGroupAsync(RFGroup group)
        +string GetGroupName(int groupId)
        +Task UpdateDeviceGroupAsync(RFDevice device, int newGroupId)
    }
    
    class BackupFrequenciesViewModel {
        -DatabaseContext _context
        -DeviceData _deviceData
        -ObservableCollection<RFBackupFrequency> _backupFrequencies
        -Dictionary<(string Brand, string Model, string Frequency), int> _backupCounts
        
        +ObservableCollection<RFBackupFrequency> BackupFrequencies
        
        +Task LoadBackupFrequenciesAsync()
        +Task SaveBackupFrequencyCountAsync(string brand, string model, string frequency, int count)
        +Task LoadBackupFrequencyCountsAsync()
        +int GetBackupFrequencyCount(string brand, string model, string frequency)
        +Task GenerateBackupFrequenciesAsync(FrequencyDataViewModel frequencyData, List excludedRanges)
        +List~RFBackupFrequency~ GetBackupFrequenciesForDeviceType(string brand, string model, string frequency)
        +Task SaveBackupFrequencyAsync(RFBackupFrequency frequency)
        +Task DeleteBackupFrequencyAsync(RFBackupFrequency frequency)
        +Task DeleteAllBackupFrequenciesAsync()
    }
    
    class FrequencyDataViewModel {
        -DatabaseContext _context
        -FrequencyData _frequencyData
        
        +FrequencyData FrequencyData
        
        +Task LoadFrequencyDataAsync()
        +Task SaveFrequencyDataAsync()
        +Task ClearFrequencyDataAsync()
    }
    
    class ExclusionChannelViewModel {
        -DatabaseContext _context
        -ObservableCollection<ExclusionChannel> _exclusionChannels
        
        +ObservableCollection<ExclusionChannel> ExclusionChannels
        
        +Task LoadExclusionChannelsAsync()
        +Task SaveExclusionChannelAsync(ExclusionChannel channel)
        +Task DeleteExclusionChannelAsync(ExclusionChannel channel)
        +List~(float Start, float End)~ GetExcludedRanges()
    }
    
    class ScansViewModel {
        -DatabaseContext _context
        -ObservableCollection<ScanResult> _scans
        
        +ObservableCollection<ScanResult> Scans
        
        +Task LoadScansAsync()
        +Task SaveScanAsync(ScanResult scan)
        +Task DeleteScanAsync(ScanResult scan)
        +Task DeleteAllScansAsync()
    }
    
    BaseViewModel <|-- DevicesViewModel
    BaseViewModel <|-- GroupsViewModel
    BaseViewModel <|-- BackupFrequenciesViewModel
    BaseViewModel <|-- FrequencyDataViewModel
    BaseViewModel <|-- ExclusionChannelViewModel
    BaseViewModel <|-- ScansViewModel
```

## 6. Data access layer - repository pattern réel

### Database context et repository pattern

```mermaid
classDiagram
    class DatabaseContext {
        -SQLiteAsyncConnection _database
        -string _dbPath
        
        +Task<List<T>> GetAllAsync<T>() where T : class, new()
        +Task<T> GetItemAsync<T>(int id) where T : class, new()
        +Task<bool> AddItemAsync<T>(T item) where T : class, new()
        +Task<bool> UpdateItemAsync<T>(T item) where T : class, new()
        +Task<bool> DeleteItemAsync<T>(T item) where T : class, new()
        +Task<bool> DeleteItemByKeyAsync<T>(object primaryKey) where T : class, new()
        +Task<bool> DeleteAllAsync<T>() where T : class, new()
        +Task<List<T>> GetFilteredAsync<T>(Expression<Func<T, bool>> predicate) where T : class, new()
        +Task<RFGroup> GetGroupById(int id)
        +Task InitializeDatabaseAsync()
        -Task CreateTablesAsync()
    }
    
    class DeviceDataJson {
        +DeviceData GetDeviceData()
        +List~string~ GetBrands()
        +List~string~ GetModels(string brand)
        +List~string~ GetFrequencies(string brand, string model)
        +List~int~ GetFrequencyRange(string brand, string model, string frequency)
    }
    
    class FilePickerService {
        +Task<FileResult> PickFileAsync(PickOptions options)
        +Task<string> ReadFileAsync(FileResult file)
    }
    
    class FileSaverService {
        +Task<FileSaverResult> SaveAsync(string fileName, Stream data)
        +Task<FileSaverResult> SaveAsync(string fileName, string data, CancellationToken cancellationToken)
    }
    
    DatabaseContext --> RFDevice : manages
    DatabaseContext --> RFChannel : manages
    DatabaseContext --> RFGroup : manages
    DatabaseContext --> RFBackupFrequency : manages
    DatabaseContext --> ExclusionChannel : manages
    DatabaseContext --> FrequencyData : manages
```

## 7. Communication services - network layer

### Network protocols et communication

```mermaid
classDiagram
    class UDPCommunicationService {
        +Task<string> SendUDPCommandAsync(string ipAddress, int port, string command)
        +Task<string> SendG4CommandAsync(string ipAddress, string command)
        +Task<byte[]> SendUDPCommandBytesAsync(string ipAddress, int port, byte[] command)
        -UdpClient CreateUdpClient()
        -void ConfigureTimeout(UdpClient client, int timeoutMs)
    }
    
    class TCPCommunicationService {
        +Task<string> SendTCPCommandAsync(string ipAddress, int port, string command)
        +Task<string> SendShureCommandAsync(string ipAddress, string command)
        -TcpClient CreateTcpClient()
        -void ConfigureTimeout(TcpClient client, int timeoutMs)
    }
    
    class MulticastService {
        +event EventHandler<ServiceInstanceEventArgs> ServiceInstanceDiscovered
        +Task StartAsync()
        +Task StopAsync()
        +void SendQuery(string serviceType)
    }
    
    class ServiceDiscovery {
        -MulticastService _multicastService
        
        +event EventHandler<ServiceInstanceEventArgs> ServiceDiscovered
        +event EventHandler<ServiceInstanceEventArgs> ServiceInstanceDiscovered
        +Task StartAsync()
        +Task StopAsync()
        +void QueryService(string serviceType)
    }
    
    SennheiserDeviceHandler --> UDPCommunicationService : uses
    SennheiserG4DeviceHandler --> UDPCommunicationService : uses
    ShureDeviceHandler --> TCPCommunicationService : uses
    DiscoveryService --> MulticastService : uses
    DiscoveryService --> ServiceDiscovery : uses
```

## 8. Patterns de conception utilisés - implémentation réelle

### Design patterns identifiés dans le code

```mermaid
classDiagram
    class ObserverPattern {
        <<pattern>>
        +INotifyPropertyChanged
        +PropertyChanged Events
        +DevicesChanged Events
        +DeviceDiscovered Events
    }
    
    class StrategyPattern {
        <<pattern>>
        +IDeviceHandler Strategy
        +IDeviceCommandSet Strategy
        +Handler Selection Logic
    }
    
    class FactoryPattern {
        <<pattern>>
        +Handler Creation
        +CommandSet Creation
        +Service Registration
    }
    
    class RepositoryPattern {
        <<pattern>>
        +DatabaseContext
        +Generic CRUD Operations
        +Expression-based Filtering
    }
    
    class MVVMPattern {
        <<pattern>>
        +ViewModels
        +ObservableCollections
        +Property Binding
        +Command Pattern
    }
    
    class SingletonPattern {
        <<pattern>>
        +Service Registration
        +DI Container
        +Shared Instances
    }
    
    class AdapterPattern {
        <<pattern>>
        +DeviceDiscoveredEventArgs → RFDevice
        +Network Protocol Adapters
        +Command Set Adapters
    }
```

## 9. Relations et dépendances - injection de dépendances

### Diagramme de dépendances DI

```mermaid
classDiagram
    class MauiProgram {
        +ConfigureServices(IServiceCollection services)
        +RegisterViewModels()
        +RegisterServices()
        +RegisterHandlers()
        +RegisterCommunication()
    }
    
    class DependencyInjection {
        <<container>>
        +DevicesViewModel
        +GroupsViewModel
        +BackupFrequenciesViewModel
        +FrequencyCalculationService
        +DeviceMappingService
        +DiscoveryService
        +DatabaseContext
        +IDeviceHandler[]
        +IDeviceCommandSet[]
        +UDPCommunicationService
        +TCPCommunicationService
    }
    
    MauiProgram --> DependencyInjection : configures
    DependencyInjection --> DevicesViewModel : provides
    DependencyInjection --> FrequencyCalculationService : provides
    DependencyInjection --> DiscoveryService : provides
    DependencyInjection --> IDeviceHandler : provides
```
