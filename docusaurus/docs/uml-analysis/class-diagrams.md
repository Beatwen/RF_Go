# Diagrammes de Classes - Architecture Orientée Objet

Les diagrammes de classes de RF.Go illustrent l'**architecture orientée objet** complète du système. Cette modélisation détaille la structure statique, les relations entre classes, et les patterns de conception utilisés pour créer une architecture robuste et extensible.

## 1. Vue d'Ensemble de l'Architecture OO

### Architecture en Couches avec Séparation des Responsabilités

```mermaid
classDiagram
    class PresentationLayer {
        <<abstract>>
    }
    
    class ApplicationLayer {
        <<abstract>>
    }
    
    class DomainLayer {
        <<abstract>>  
    }
    
    class InfrastructureLayer {
        <<abstract>>
    }
    
    PresentationLayer ..> ApplicationLayer : Uses
    ApplicationLayer ..> DomainLayer : Uses
    ApplicationLayer ..> InfrastructureLayer : Uses
    InfrastructureLayer ..> DomainLayer : Implements
```

## 2. Modèles Métier (Domain Layer)

### Entités Principales RF

```mermaid
classDiagram
    class RFDevice {
        +int ID
        +string Name
        +string IPAddress
        +DeviceBrand Brand
        +DeviceModel Model
        +string SerialNumber
        +DeviceStatus Status
        +DateTime LastSync
        +int GroupID
        +List~RFChannel~ Channels
        +Dictionary~string,object~ Properties
        
        +bool IsOnline()
        +void UpdateStatus(DeviceStatus status)
        +void AddChannel(RFChannel channel)
        +RFChannel GetChannel(int index)
        +bool CanSync()
        +Dictionary~string,object~ GetConfiguration()
    }
    
    class RFChannel {
        +int ID
        +int DeviceID
        +int ChannelNumber
        +int Frequency
        +string ChannelName
        +bool IsLocked
        +int Power
        +int Sensitivity
        +ChannelType Type
        +DateTime LastUpdate
        
        +bool IsValidFrequency(int frequency)
        +void Lock()
        +void Unlock()
        +void SetFrequency(int frequency)
        +bool HasConflict()
        +List~int~ GetIntermodulations()
    }
    
    class RFGroup {
        +int ID
        +string Name
        +string Description
        +Color GroupColor
        +List~TimePeriod~ TimePeriods
        +List~RFDevice~ Devices
        +GroupStatus Status
        +DateTime CreatedAt
        +DateTime UpdatedAt
        
        +void AddDevice(RFDevice device)
        +void RemoveDevice(RFDevice device)
        +void AddTimePeriod(TimePeriod period)
        +bool HasTemporalConflict()
        +List~RFDevice~ GetActiveDevices(DateTime time)
        +int GetTotalChannels()
    }
    
    class TimePeriod {
        +int ID
        +string Name
        +DateTime StartTime
        +DateTime EndTime
        +TimeSpan StartTimeSpan
        +TimeSpan EndTimeSpan
        +RecurrenceType Recurrence
        +bool IsActive
        
        +bool IsActiveAt(DateTime time)
        +bool OverlapsWith(TimePeriod other)
        +TimeSpan Duration()
        +DateTime GetNextOccurrence()
        +bool Contains(DateTime time)
    }
    
    class ExclusionChannel {
        +int ID
        +int Frequency
        +string Reason
        +ExclusionType Type
        +DateTime ValidFrom
        +DateTime ValidTo
        +string Region
        +bool IsActive
        
        +bool IsExcludedAt(DateTime time)
        +bool Conflicts(int frequency)
        +bool IsInRegion(string region)
    }
    
    RFDevice ||--o{ RFChannel : contains
    RFGroup ||--o{ RFDevice : contains
    RFGroup ||--o{ TimePeriod : contains
    RFDevice }o--|| RFGroup : belongs to
```

### Modèles de Calcul RF

```mermaid
classDiagram
    class FrequencyData {
        +Dictionary~int,List~int~~ UsedFrequencies
        +List~int~ AvailableFrequencies
        +List~int~ ExcludedFrequencies
        +Dictionary~string,List~int~~ IntermodulationProducts
        +Dictionary~int,List~int~~ ChannelIntermodulations
        +int MinFrequency
        +int MaxFrequency
        +int ChannelSpacing
        
        +bool IsFrequencyAvailable(int frequency)
        +void AddUsedFrequency(int frequency, int deviceId)
        +void RemoveUsedFrequency(int frequency, int deviceId)
        +List~int~ GetIntermodulations(int frequency)
        +void CalculateAllIntermodulations()
        +bool HasConflict(int frequency)
        +int GetOptimalFrequency(List~int~ preferences)
    }
    
    class CalculationResult {
        +Dictionary~int,int~ ChannelFrequencies
        +List~string~ Conflicts
        +List~string~ Warnings
        +double OptimizationScore
        +TimeSpan CalculationTime
        +int TotalChannels
        +int SuccessfulChannels
        +List~int~ BackupFrequencies
        
        +bool IsValid()
        +double GetSuccessRate()
        +void AddConflict(string conflict)
        +void AddWarning(string warning)
        +List~int~ GetConflictingChannels()
        +string GenerateReport()
    }
    
    class IntermodulationCalculator {
        +FrequencyData FrequencyData
        +IntermodulationOrder MaxOrder
        +bool Include3TxCalculations
        
        +List~int~ Calculate2Tx3rdOrder(int f1, int f2)
        +List~int~ Calculate2Tx5thOrder(int f1, int f2)
        +List~int~ Calculate2Tx7thOrder(int f1, int f2)
        +List~int~ Calculate3Tx3rdOrder(int f1, int f2, int f3)
        +List~int~ CalculateAllIntermodulations(List~int~ frequencies)
        +bool HasIntermodulationConflict(int frequency, List~int~ usedFreqs)
        +Dictionary~string,List~int~~ GetDetailedCalculations()
    }
    
    FrequencyData --> IntermodulationCalculator : uses
    IntermodulationCalculator --> CalculationResult : produces
```

## 3. Services de Domaine

### Services RF et Gestion des Appareils

```mermaid
classDiagram
    class IFrequencyCalculationService {
        <<interface>>
        +CalculationResult CalculateFrequencies(List~RFDevice~ devices)
        +CalculationResult CalculateTemporalFrequencies(List~RFGroup~ groups)
        +bool ValidateFrequencyPlan(Dictionary~int,int~ plan)
        +List~int~ GenerateBackupFrequencies(int count)
        +void OptimizePlan(CalculationResult result)
    }
    
    class FrequencyCalculationService {
        -IFrequencyDataService _frequencyDataService
        -IntermodulationCalculator _calculator
        -IOptimizationEngine _optimizer
        -ILogger _logger
        
        +CalculationResult CalculateFrequencies(List~RFDevice~ devices)
        +CalculationResult CalculateTemporalFrequencies(List~RFGroup~ groups)
        +bool ValidateFrequencyPlan(Dictionary~int,int~ plan)
        +List~int~ GenerateBackupFrequencies(int count)
        +void OptimizePlan(CalculationResult result)
        -void GroupDevicesByTimePeriod(List~RFGroup~ groups)
        -void ProcessLockedFrequencies(List~RFChannel~ channels)
        -void ProcessUnlockedFrequencies(List~RFChannel~ channels)
    }
    
    class IDiscoveryService {
        <<interface>>
        +event DeviceDiscoveredEventHandler DeviceDiscovered
        +event DeviceLostEventHandler DeviceLost
        +Task StartDiscoveryAsync()
        +Task StopDiscoveryAsync()
        +List~RFDevice~ GetDiscoveredDevices()
        +Task~RFDevice~ GetDeviceDetailsAsync(string ipAddress)
    }
    
    class DiscoveryService {
        -List~IDeviceHandler~ _handlers
        -Timer _discoveryTimer
        -ConcurrentDictionary~string,RFDevice~ _discoveredDevices
        -ILogger _logger
        
        +event DeviceDiscoveredEventHandler DeviceDiscovered
        +event DeviceLostEventHandler DeviceLost
        +Task StartDiscoveryAsync()
        +Task StopDiscoveryAsync()
        +List~RFDevice~ GetDiscoveredDevices()
        +Task~RFDevice~ GetDeviceDetailsAsync(string ipAddress)
        -Task RunDiscoveryLoop()
        -void ProcessDiscoveryResults(List~DeviceInfo~ devices)
        -bool IsDeviceAlreadyKnown(DeviceInfo device)
    }
    
    IFrequencyCalculationService <|.. FrequencyCalculationService
    IDiscoveryService <|.. DiscoveryService
```

### Services de Synchronisation et Mapping

```mermaid
classDiagram
    class ISynchronizationService {
        <<interface>>
        +Task~SyncResult~ SyncDeviceAsync(RFDevice device)
        +Task~SyncResult~ SyncAllDevicesAsync(List~RFDevice~ devices)
        +Task~SyncResult~ SyncFromDeviceAsync(RFDevice device)
        +event SyncCompletedEventHandler SyncCompleted
    }
    
    class SynchronizationService {
        -IDeviceHandlerFactory _handlerFactory
        -ISyncResultLogger _logger
        -SemaphoreSlim _syncSemaphore
        
        +Task~SyncResult~ SyncDeviceAsync(RFDevice device)
        +Task~SyncResult~ SyncAllDevicesAsync(List~RFDevice~ devices)
        +Task~SyncResult~ SyncFromDeviceAsync(RFDevice device)
        +event SyncCompletedEventHandler SyncCompleted
        -Task~SyncResult~ ExecuteSyncOperation(RFDevice device, SyncDirection direction)
        -void ValidateDeviceState(RFDevice device)
        -List~SyncCommand~ BuildSyncCommands(RFDevice device)
    }
    
    class IMappingService {
        <<interface>>
        +void MapFrequenciesToDevices(List~RFDevice~ devices, Dictionary~int,int~ frequencies)
        +Dictionary~int,int~ ExtractFrequenciesFromDevices(List~RFDevice~ devices)
        +bool ValidateMapping(List~RFDevice~ devices)
        +void ApplyTemporalMapping(List~RFGroup~ groups)
    }
    
    class MappingService {
        -IValidationService _validator
        -ILogger _logger
        
        +void MapFrequenciesToDevices(List~RFDevice~ devices, Dictionary~int,int~ frequencies)
        +Dictionary~int,int~ ExtractFrequenciesFromDevices(List~RFDevice~ devices)
        +bool ValidateMapping(List~RFDevice~ devices)
        +void ApplyTemporalMapping(List~RFGroup~ groups)
        -void ValidateFrequencyRange(int frequency)
        -void UpdateChannelMapping(RFChannel channel, int frequency)
        -void LogMappingOperation(string operation, object details)
    }
    
    ISynchronizationService <|.. SynchronizationService
    IMappingService <|.. MappingService
```

## 4. Handlers et Adaptateurs

### Handlers de Protocoles Réseau

```mermaid
classDiagram
    class IDeviceHandler {
        <<interface>>
        +DeviceBrand SupportedBrand
        +List~DeviceModel~ SupportedModels
        +Task~List~DeviceInfo~~ DiscoverDevicesAsync()
        +Task~RFDevice~ GetDeviceDetailsAsync(string ipAddress)
        +Task~SyncResult~ SyncDeviceAsync(RFDevice device)
        +bool SupportsDevice(DeviceInfo device)
    }
    
    class SennheiserHandler {
        -mDNSService _mdnsService
        -TCPClient _tcpClient
        -string _serviceType = "_sennheiser._tcp"
        
        +DeviceBrand SupportedBrand = Sennheiser
        +List~DeviceModel~ SupportedModels
        +Task~List~DeviceInfo~~ DiscoverDevicesAsync()
        +Task~RFDevice~ GetDeviceDetailsAsync(string ipAddress)
        +Task~SyncResult~ SyncDeviceAsync(RFDevice device)
        +bool SupportsDevice(DeviceInfo device)
        -Task~List~DeviceInfo~~ PerformmDNSDiscovery()
        -string BuildSennheiserCommand(string command, Dictionary~string,object~ parameters)
        -Task~string~ SendTCPCommandAsync(string ipAddress, string command)
    }
    
    class ShureHandler {
        -SLPService _slpService
        -TCPClient _tcpClient
        -string _multicastAddress = "239.255.254.253"
        -int _multicastPort = 8427
        
        +DeviceBrand SupportedBrand = Shure
        +List~DeviceModel~ SupportedModels
        +Task~List~DeviceInfo~~ DiscoverDevicesAsync()
        +Task~RFDevice~ GetDeviceDetailsAsync(string ipAddress)
        +Task~SyncResult~ SyncDeviceAsync(RFDevice device)
        +bool SupportsDevice(DeviceInfo device)
        -Task~List~DeviceInfo~~ PerformSLPDiscovery()
        -string BuildShureCommand(string command, Dictionary~string,object~ parameters)
        -Task~string~ SendULXDCommandAsync(string ipAddress, string command)
    }
    
    class GenericHandler {
        -UDPClient _udpClient
        -List~string~ _scanRanges
        
        +DeviceBrand SupportedBrand = Generic
        +List~DeviceModel~ SupportedModels
        +Task~List~DeviceInfo~~ DiscoverDevicesAsync()
        +Task~RFDevice~ GetDeviceDetailsAsync(string ipAddress)
        +Task~SyncResult~ SyncDeviceAsync(RFDevice device)
        +bool SupportsDevice(DeviceInfo device)
        -Task~List~DeviceInfo~~ PerformUDPScan()
        -Task~DeviceInfo~ ProbeDevice(string ipAddress)
        -bool IsDeviceResponsive(string ipAddress)
    }
    
    IDeviceHandler <|.. SennheiserHandler
    IDeviceHandler <|.. ShureHandler
    IDeviceHandler <|.. GenericHandler
```

### Factory Patterns pour Extensibilité

```mermaid
classDiagram
    class IDeviceHandlerFactory {
        <<interface>>
        +IDeviceHandler GetHandler(DeviceBrand brand)
        +IDeviceHandler GetHandler(DeviceInfo device)
        +List~IDeviceHandler~ GetAllHandlers()
        +void RegisterHandler(IDeviceHandler handler)
    }
    
    class DeviceHandlerFactory {
        -Dictionary~DeviceBrand,IDeviceHandler~ _handlers
        -IServiceProvider _serviceProvider
        
        +IDeviceHandler GetHandler(DeviceBrand brand)
        +IDeviceHandler GetHandler(DeviceInfo device)
        +List~IDeviceHandler~ GetAllHandlers()
        +void RegisterHandler(IDeviceHandler handler)
        -void InitializeDefaultHandlers()
        -IDeviceHandler CreateHandler(Type handlerType)
    }
    
    class ICalculationEngineFactory {
        <<interface>>
        +ICalculationEngine CreateEngine(CalculationType type)
        +List~CalculationType~ GetSupportedTypes()
    }
    
    class CalculationEngineFactory {
        -Dictionary~CalculationType,Type~ _engineTypes
        -IServiceProvider _serviceProvider
        
        +ICalculationEngine CreateEngine(CalculationType type)
        +List~CalculationType~ GetSupportedTypes()
        +void RegisterEngine(CalculationType type, Type engineType)
        -ICalculationEngine InstantiateEngine(Type engineType)
    }
    
    IDeviceHandlerFactory <|.. DeviceHandlerFactory
    ICalculationEngineFactory <|.. CalculationEngineFactory
    DeviceHandlerFactory --> IDeviceHandler : creates
    CalculationEngineFactory --> ICalculationEngine : creates
```

## 5. ViewModels et Presentation Layer

### ViewModels MVVM

```mermaid
classDiagram
    class BaseViewModel {
        <<abstract>>
        +event PropertyChangedEventHandler PropertyChanged
        #bool SetProperty<T>(ref T field, T value, string propertyName)
        #void OnPropertyChanged(string propertyName)
        +virtual Task InitializeAsync()
        +virtual void Cleanup()
        #void RaiseCanExecuteChanged()
    }
    
    class DevicesViewModel {
        -IDiscoveryService _discoveryService
        -ISynchronizationService _syncService
        -IFrequencyCalculationService _calculationService
        -ObservableCollection<RFDevice> _devices
        -RFDevice _selectedDevice
        -bool _isDiscovering
        -string _statusMessage
        
        +ObservableCollection<RFDevice> Devices
        +RFDevice SelectedDevice
        +bool IsDiscovering
        +string StatusMessage
        +ICommand StartDiscoveryCommand
        +ICommand SyncSelectedCommand
        +ICommand SyncAllCommand
        +ICommand CalculateFrequenciesCommand
        +ICommand RefreshCommand
        
        +Task InitializeAsync()
        -Task StartDiscovery()
        -Task SyncSelectedDevice()
        -Task SyncAllDevices()
        -Task CalculateFrequencies()
        -void OnDeviceDiscovered(object sender, DeviceDiscoveredEventArgs e)
        -void OnSyncCompleted(object sender, SyncCompletedEventArgs e)
    }
    
    class FrequencyViewModel {
        -IFrequencyCalculationService _calculationService
        -IMappingService _mappingService
        -ObservableCollection<RFChannel> _channels
        -CalculationResult _lastCalculation
        -bool _isCalculating
        
        +ObservableCollection<RFChannel> Channels
        +CalculationResult LastCalculation
        +bool IsCalculating
        +ICommand CalculateCommand
        +ICommand OptimizeCommand
        +ICommand LockChannelCommand
        +ICommand UnlockChannelCommand
        
        -Task CalculateFrequencies()
        -Task OptimizeFrequencies()
        -void LockChannel(RFChannel channel)
        -void UnlockChannel(RFChannel channel)
        -void UpdateChannelDisplay()
    }
    
    BaseViewModel <|-- DevicesViewModel
    BaseViewModel <|-- FrequencyViewModel
```

## 6. Data Access Layer

### Repository Pattern et EF Core

```mermaid
classDiagram
    class IRepository~T~ {
        <<interface>>
        +Task~T~ GetByIdAsync(int id)
        +Task~IEnumerable~T~~ GetAllAsync()
        +Task~IEnumerable~T~~ FindAsync(Expression~Func~T,bool~~ predicate)
        +Task AddAsync(T entity)
        +Task UpdateAsync(T entity)
        +Task DeleteAsync(T entity)
        +Task~bool~ ExistsAsync(int id)
    }
    
    class BaseRepository~T~ {
        <<abstract>>
        #ApplicationDbContext _context
        #DbSet~T~ _dbSet
        
        +Task~T~ GetByIdAsync(int id)
        +Task~IEnumerable~T~~ GetAllAsync()
        +Task~IEnumerable~T~~ FindAsync(Expression~Func~T,bool~~ predicate)
        +Task AddAsync(T entity)
        +Task UpdateAsync(T entity)
        +Task DeleteAsync(T entity)
        +Task~bool~ ExistsAsync(int id)
        #virtual IQueryable~T~ GetQueryable()
    }
    
    class IRFDeviceRepository {
        <<interface>>
        +Task~List~RFDevice~~ GetDevicesByGroupAsync(int groupId)
        +Task~List~RFDevice~~ GetOnlineDevicesAsync()
        +Task~RFDevice~ GetDeviceByIPAsync(string ipAddress)
        +Task UpdateDeviceStatusAsync(int deviceId, DeviceStatus status)
    }
    
    class RFDeviceRepository {
        +Task~List~RFDevice~~ GetDevicesByGroupAsync(int groupId)
        +Task~List~RFDevice~~ GetOnlineDevicesAsync()
        +Task~RFDevice~ GetDeviceByIPAsync(string ipAddress)
        +Task UpdateDeviceStatusAsync(int deviceId, DeviceStatus status)
        -IQueryable~RFDevice~ GetDevicesWithChannels()
    }
    
    class IUnitOfWork {
        <<interface>>
        +IRFDeviceRepository RFDevices
        +IRFChannelRepository RFChannels
        +IRFGroupRepository RFGroups
        +IExclusionChannelRepository ExclusionChannels
        +Task~int~ SaveChangesAsync()
        +Task BeginTransactionAsync()
        +Task CommitTransactionAsync()
        +Task RollbackTransactionAsync()
    }
    
    IRepository~T~ <|.. BaseRepository~T~
    BaseRepository~RFDevice~ <|-- RFDeviceRepository
    IRFDeviceRepository <|.. RFDeviceRepository
```

## 7. Patterns de Conception Utilisés

### Design Patterns Implémentés

```mermaid
classDiagram
    class Singleton~T~ {
        <<abstract>>
        -static T _instance
        -static readonly object _lock
        +static T Instance
        #Singleton()
        +static T GetInstance()
    }
    
    class Command {
        <<interface>>
        +Task ExecuteAsync()
        +bool CanExecute()
        +event EventHandler CanExecuteChanged
    }
    
    class Observer~T~ {
        <<interface>>
        +void Update(T data)
    }
    
    class Subject~T~ {
        <<abstract>>
        -List~Observer~T~~ _observers
        +void Attach(Observer~T~ observer)
        +void Detach(Observer~T~ observer)
        #void Notify(T data)
    }
    
    class Strategy~T~ {
        <<interface>>
        +T Execute(object parameters)
    }
    
    class Factory~T~ {
        <<abstract>>
        +abstract T Create(object parameters)
        +virtual T CreateDefault()
    }
```

### Métriques de Complexité

| Classe | Responsabilités | Couplage | Cohésion | Complexité Cyclomatique |
|--------|----------------|----------|----------|-------------------------|
| **RFDevice** | Entité métier | Faible | Élevée | 8 |
| **FrequencyCalculationService** | Service métier | Moyen | Élevée | 15 |
| **DiscoveryService** | Service technique | Moyen | Moyenne | 12 |
| **DevicesViewModel** | Présentation | Élevé | Moyenne | 18 |
| **SennheiserHandler** | Adaptateur | Faible | Élevée | 10 |

## 8. Relations et Dépendances

### Diagramme de Packages

```mermaid
classDiagram
    package RF.Go.Domain {
        class RFDevice
        class RFChannel
        class RFGroup
    }
    
    package RF.Go.Application {
        class IFrequencyCalculationService
        class FrequencyCalculationService
        class DevicesViewModel
    }
    
    package RF.Go.Infrastructure {
        class RFDeviceRepository
        class SennheiserHandler
        class DiscoveryService
    }
    
    package RF.Go.Presentation {
        class DevicesView
        class FrequencyView
    }
    
    RF.Go.Application ..> RF.Go.Domain : Uses
    RF.Go.Infrastructure ..> RF.Go.Domain : Implements
    RF.Go.Infrastructure ..> RF.Go.Application : Implements
    RF.Go.Presentation ..> RF.Go.Application : Uses
```

Cette architecture orientée objet démontre une structure bien organisée avec une séparation claire des responsabilités, une extensibilité par design patterns, et une robustesse assurée par les principes SOLID. 