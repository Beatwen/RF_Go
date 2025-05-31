# Diagramme de séquence complémentaires

Les diagrammes de séquence présentés ici complètent ceux des use-cases en se concentrant sur les **interactions cross-fonctionnelles**, les **patterns d'architecture système** et les **flux d'intégration complexes** qui transcendent les fonctionnalités individuelles.

> **Note** : Les diagrammes de séquence spécifiques à chaque fonctionnalité sont détaillés dans leurs use-cases respectifs (UC-001 à UC-010). Cette section se concentre sur les interactions système de haut niveau.

## 1. Architecture cross-fonctionnelle : flux de bout en bout

### Orchestration complète : de la découverte à la production

```mermaid
sequenceDiagram
    participant IS as Ingénieur Son
    participant APP as Application
    participant DS as DiscoveryService
    participant FCS as FrequencyCalculationService
    participant DMS as DeviceMappingService
    participant AUTH as AuthService
    participant DB as DatabaseContext
    participant NET as NetworkLayer

    Note over IS,NET: 🔄 Session Complète RF.Go
    
    rect rgb(255, 248, 220)
        Note over IS,NET: Phase 1: Initialisation Système
        IS->>APP: Lance RF.Go
        APP->>AUTH: ValidateSession()
        AUTH->>AUTH: CheckTokens() + ValidateLicense()
        AUTH-->>APP: Session validée
        APP->>DS: StartDiscovery() [Auto]
        APP->>DB: LoadUserData()
        APP-->>IS: Interface prête
    end
    
    rect rgb(240, 255, 240)
        Note over IS,NET: Phase 2: Workflow Découverte → Import → Calcul
        IS->>APP: Déclenche workflow complet
        
        par Découverte Continue
            DS->>NET: Multi-protocole discovery
            NET-->>DS: Appareils physiques
            DS-->>APP: DevicesDiscovered [continu]
        and Import Sélectif
            IS->>APP: Import appareils (UC-003)
            APP->>DB: SaveImportedDevices()
        and Configuration RF
            IS->>APP: Configure groupes (UC-005)
            APP->>DB: SaveGroups()
        end
        
        IS->>APP: Déclenche calcul global
        APP->>FCS: CalculateFrequenciesAsync() [UC-002]
        FCS->>FCS: Orchestration calcul multi-groupe
        FCS-->>APP: Plan RF optimisé
        APP->>DB: SaveCalculationResults()
    end
    
    rect rgb(255, 240, 240)
        Note over IS,NET: Phase 3: Synchronisation Production
        IS->>APP: Magic Sync All Devices
        APP->>DMS: SyncAllToDevices() [UC-004]
        
        par Sync Parallèle Marques
            DMS->>NET: Sync Sennheiser devices
            DMS->>NET: Sync Shure devices  
            DMS->>NET: Sync Generic devices
        end
        
        NET-->>DMS: Résultats sync
        DMS->>DB: UpdateDeviceStates()
        DMS-->>APP: Sync Report
        APP-->>IS: Production ready!
    end
    
    rect rgb(240, 240, 255)
        Note over IS,NET: Phase 4: Monitoring Opérationnel
        loop Session de travail
            APP->>DS: CheckDeviceStatus() [continu]
            APP->>DMS: VerifySync() [périodique]
            alt Changements détectés
                APP-->>IS: Notifications alertes
                IS->>APP: Actions correctives
            end
        end
    end
```

## 2. Patterns d'architecture : injection de dépendances & services

### Orchestration des services via dependency injection

```mermaid
sequenceDiagram
    participant MP as MauiProgram
    participant DI as ServiceContainer
    participant VM as ViewModels
    participant SRV as Services
    participant HAND as Handlers
    participant COMM as Communication

    Note over MP,COMM: 🏗️ Architecture Pattern Implementation
    
    rect rgb(248, 248, 255)
        Note over MP,COMM: Bootstrap & Service Registration
        MP->>DI: ConfigureServices()
        
        MP->>DI: RegisterViewModels()
        Note right of DI: DevicesViewModel<br/>GroupsViewModel<br/>FrequencyDataViewModel
        
        MP->>DI: RegisterServices()
        Note right of DI: FrequencyCalculationService<br/>DiscoveryService<br/>DeviceMappingService
        
        MP->>DI: RegisterHandlers()
        Note right of DI: SennheiserDeviceHandler<br/>SennheiserG4DeviceHandler<br/>ShureDeviceHandler
        
        MP->>DI: RegisterCommunication()
        Note right of DI: UDPCommunicationService<br/>TCPCommunicationService<br/>DatabaseContext
    end
    
    rect rgb(240, 255, 240)
        Note over MP,COMM: Runtime Dependency Resolution
        
        VM->>DI: Request FrequencyCalculationService
        DI->>SRV: Create with dependencies
        Note right of SRV: Inject:<br/>- DevicesViewModel<br/>- GroupsViewModel<br/>- ExclusionChannelViewModel
        
        SRV->>DI: Request DiscoveryService  
        DI->>SRV: Create with handlers
        Note right of SRV: Inject:<br/>- IDeviceHandler[]<br/>- DevicesViewModel<br/>- MulticastService
        
        SRV->>DI: Request DeviceHandlers
        DI->>HAND: Create with communication
        Note right of HAND: Inject:<br/>- UDPCommunicationService<br/>- CommandSets<br/>- DeviceData
        
        HAND->>DI: Request Communication Services
        DI->>COMM: Provide instances
        Note right of COMM: Singleton pattern<br/>for network services
    end
    
    rect rgb(255, 248, 240)
        Note over MP,COMM: Cross-Cutting Concerns
        
        Note over DI: Observer Pattern
        VM->>VM: PropertyChanged events
        VM->>SRV: DevicesChanged events
        SRV->>HAND: DeviceDiscovered events
        
        Note over DI: Strategy Pattern
        SRV->>HAND: GetHandler(deviceType)
        HAND->>COMM: SelectProtocol(brand)
        
        Note over DI: Repository Pattern
        SRV->>COMM: DatabaseContext.GetAllAsync<T>()
        COMM-->>SRV: Uniform data access
    end
```

## 3. Patterns de communication : multi-protocole & recovery

### Orchestration network avec fallback strategy

```mermaid
sequenceDiagram
    participant DS as DiscoveryService
    participant NS as NetworkStrategy
    participant MP as MultiProtocolManager
    participant SH as SennheiserHandler
    participant SG as SennheiserG4Handler  
    participant SHU as ShureHandler
    participant NET as NetworkLayer
    participant ER as ErrorRecovery

    Note over DS,ER: 🌐 Network Communication Patterns
    
    rect rgb(255, 253, 240)
        Note over DS,ER: Multi-Protocol Discovery Pattern
        DS->>MP: InitializeProtocols()
        
        par Protocol Initialization
            MP->>SH: Initialize(mDNS, Port 45)
            MP->>SG: Initialize(UDP Proprietary, Port 53212)
            MP->>SHU: Initialize(SLP, Port 8427)
        end
        
        MP-->>DS: Protocols Ready
    end
    
    rect rgb(240, 255, 248)
        Note over DS,ER: Concurrent Discovery with Timeouts
        DS->>NS: StartConcurrentDiscovery()
        
        par Sennheiser Standard
            NS->>SH: TriggerDiscovery(timeout: 3s)
            SH->>NET: mDNS Query "_ssc._udp.local"
            NET-->>SH: mDNS Responses
            SH->>SH: ParseResponses()
            SH-->>NS: StandardDevices[]
        and Sennheiser G4
            NS->>SG: TriggerG4Discovery(timeout: 10s)
            SG->>NET: UDP to 224.0.0.251:8133
            NET-->>SG: G4 Responses
            SG->>SG: ParseG4Responses()
            SG-->>NS: G4Devices[]
        and Shure SLP
            NS->>SHU: TriggerSLPDiscovery(timeout: 10s)
            SHU->>NET: Multicast to 239.255.254.253:8427
            NET-->>SHU: SLP Responses
            SHU->>SHU: ParseSLPResponses()
            SHU-->>NS: ShureDevices[]
        end
        
        NS->>NS: AggregateResults() + Deduplicate()
        NS-->>DS: ConsolidatedDeviceList
    end
    
    rect rgb(255, 240, 240)
        Note over DS,ER: Error Recovery & Circuit Breaker Pattern
        
        alt Network Timeout
            NET-->>SH: Timeout Exception
            SH->>ER: NetworkTimeout(protocol: mDNS)
            ER->>ER: IncrementFailureCount()
            
            alt Failure Threshold Reached
                ER->>NS: CircuitBreaker.Open(mDNS)
                NS->>NS: DisableProtocol(mDNS)
                NS-->>DS: ProtocolDisabled: mDNS
            else Retry Available
                ER->>NS: ScheduleRetry(mDNS, delay: 5s)
                NS-->>DS: RetryScheduled
            end
            
        else Connection Refused
            NET-->>SG: ConnectionRefused
            SG->>ER: ConnectionError(device: ip_address)
            ER->>ER: MarkDeviceOffline(device)
            ER-->>DS: DeviceUnavailable
            
        else Parse Error
            SHU->>ER: ParseError(response: malformed)
            ER->>ER: LogParseError()
            ER->>SHU: SkipResponse()
            SHU-->>NS: ContinueProcessing
        end
    end
    
    rect rgb(248, 248, 255)
        Note over DS,ER: Health Monitoring & Auto-Recovery
        
        loop Continuous Monitoring
            ER->>NS: CheckProtocolHealth()
            NS->>NET: PingTestEndpoints()
            
            alt Protocol Recovered
                NET-->>NS: Success Response
                NS->>ER: ProtocolHealthy(protocol)
                ER->>ER: ResetFailureCount()
                ER->>NS: CircuitBreaker.Close(protocol)
                NS-->>DS: ProtocolRestored
            else Still Failing
                NET-->>NS: Still Failing
                ER->>ER: ExtendRetryDelay()
            end
        end
    end
```

## 4. Data flow architecture : MVVM + repository + cache

### Pattern d'architecture des données

```mermaid
sequenceDiagram
    participant V as View (UI)
    participant VM as ViewModel
    participant SRV as Service Layer
    participant REPO as Repository
    participant CACHE as CacheManager
    participant DB as SQLite Database
    participant MEM as MemoryCache

    Note over V,MEM: 📊 Data Architecture Patterns
    
    rect rgb(240, 248, 255)
        Note over V,MEM: MVVM Data Binding Pattern
        V->>VM: PropertyChanged subscription
        VM->>VM: ObservableCollection<RFDevice>
        
        Note over VM: Two-way data binding<br/>Command pattern<br/>INotifyPropertyChanged
        
        V->>VM: UserAction(command)
        VM->>SRV: BusinessLogic.Execute()
    end
    
    rect rgb(248, 255, 240)
        Note over V,MEM: Repository Pattern with Caching
        SRV->>CACHE: CheckCache(key: "devices")
        
        alt Cache Hit
            CACHE-->>SRV: CachedDevices[]
            SRV-->>VM: DevicesData
        else Cache Miss
            CACHE->>REPO: GetAllAsync<RFDevice>()
            REPO->>DB: SELECT * FROM RFDevice
            DB-->>REPO: RawDeviceData
            REPO->>REPO: MapToRFDevice()
            REPO-->>CACHE: RFDevice[]
            CACHE->>MEM: Store(key, data, ttl: 5min)
            CACHE-->>SRV: FreshDevices[]
        end
    end
    
    rect rgb(255, 248, 240)
        Note over V,MEM: Change Tracking & Persistence
        VM->>SRV: ModifyDevice(device)
        SRV->>CACHE: InvalidateCache("devices")
        SRV->>REPO: UpdateItemAsync<RFDevice>(device)
        
        par Database Update
            REPO->>DB: UPDATE RFDevice SET...
            DB-->>REPO: RowsAffected: 1
            REPO-->>SRV: UpdateSuccess
        and Cache Refresh
            CACHE->>MEM: Remove("devices")
            CACHE->>REPO: PreloadCache()
            REPO-->>CACHE: RefreshedData
        end
        
        SRV->>VM: DevicesChanged event
        VM->>VM: OnPropertyChanged("Devices")
        VM-->>V: UI automatically updates
    end
    
    rect rgb(248, 248, 255)
        Note over V,MEM: Transaction & Consistency Patterns
        
        Note over SRV: Unit of Work Pattern
        SRV->>REPO: BeginTransaction()
        
        loop Batch Operations
            SRV->>REPO: AddItem<RFDevice>(device)
            SRV->>REPO: UpdateItem<RFGroup>(group)
            SRV->>REPO: DeleteItem<RFChannel>(channel)
        end
        
        alt All Operations Success
            SRV->>REPO: CommitTransaction()
            REPO->>DB: COMMIT
            CACHE->>CACHE: InvalidateAll()
            VM-->>V: Success notification
        else Any Operation Fails
            SRV->>REPO: RollbackTransaction()
            REPO->>DB: ROLLBACK
            VM-->>V: Error message + retry option
        end
    end
```

## 5. Métriques & performance : monitoring des interactions

### Dashboard des performances système

| Pattern d'Interaction | Complexité | Performance Moyenne | SLA Cible | Points Critiques |
|------------------------|------------|---------------------|-----------|------------------|
| **Cross-UC Discovery→Calc→Sync** | Très Haute | 45-120s | 180s | Network latency, Algo optimization |
| **DI Container Resolution** | Moyenne | 50-200ms | 500ms | Service graph complexity |
| **Multi-Protocol Network** | Haute | 10-30s | 60s | Timeout management, Circuit breakers |
| **MVVM Data Binding** | Faible | 10-50ms | 100ms | Collection size, PropertyChanged frequency |
| **Repository + Cache** | Moyenne | 5-20ms | 50ms | Cache hit ratio, SQLite performance |

### Optimization patterns appliqués

1. **Async/Await Pattern** : Toutes les opérations I/O sont asynchrones
2. **Observer Pattern** : Évite les polling inutiles
3. **Circuit Breaker** : Prevent cascade failures
4. **Cache-Aside** : Réduction des accès base
5. **Command Pattern** : Undo/Redo et transactionnalité
6. **Strategy Pattern** : Handlers interchangeables par marque

## 6. Architecture de resilience : fault tolerance

### Patterns de résilience cross-fonctionnels

```mermaid
sequenceDiagram
    participant APP as Application
    participant RM as ResilienceManager
    participant CB as CircuitBreaker
    participant RT as RetryManager
    participant FB as FallbackService
    participant LOG as LoggingService

    Note over APP,LOG: 🛡️ Resilience Architecture Patterns
    
    rect rgb(255, 248, 248)
        Note over APP,LOG: Circuit Breaker Pattern
        APP->>RM: ExecuteWithResilience(operation)
        RM->>CB: CheckCircuitState()
        
        alt Circuit Closed (Healthy)
            CB-->>RM: Allow execution
            RM->>APP: Execute(operation)
            
            alt Operation Success
                APP-->>RM: Success result
                RM->>CB: RecordSuccess()
            else Operation Fails
                APP-->>RM: Exception
                RM->>CB: RecordFailure()
                CB->>CB: IncrementFailureCount()
                
                alt Threshold Reached
                    CB->>CB: OpenCircuit(timeout: 30s)
                    CB-->>RM: Circuit OPEN
                end
            end
            
        else Circuit Open (Failing)
            CB-->>RM: Reject execution
            RM->>FB: ExecuteFallback(operation)
            FB-->>RM: Fallback result
            
        else Circuit Half-Open (Testing)
            CB-->>RM: Allow single test
            RM->>APP: Execute(test_operation)
            
            alt Test Success
                CB->>CB: CloseCircuit()
            else Test Fails
                CB->>CB: ReOpenCircuit()
            end
        end
    end
    
    rect rgb(248, 255, 248)
        Note over APP,LOG: Retry Pattern with Exponential Backoff
        RM->>RT: ConfigureRetry(maxAttempts: 3, backoff: exponential)
        
        RM->>APP: AttemptOperation() [Attempt 1]
        
        alt Success on First Try
            APP-->>RM: Success
            RM-->>LOG: Operation Completed
        else Transient Failure
            APP-->>RM: TransientException
            RM->>RT: CalculateDelay(attempt: 1)
            RT-->>RM: Delay: 1 second
            RM->>RM: Wait(1s)
            
            RM->>APP: AttemptOperation() [Attempt 2]
            
            alt Success on Second Try
                APP-->>RM: Success
                RM-->>LOG: Operation Completed After Retry
            else Still Failing
                APP-->>RM: TransientException
                RM->>RT: CalculateDelay(attempt: 2)
                RT-->>RM: Delay: 2 seconds
                RM->>RM: Wait(2s)
                
                RM->>APP: AttemptOperation() [Attempt 3]
                
                alt Success on Third Try
                    APP-->>RM: Success
                    RM-->>LOG: Operation Completed After Multiple Retries
                else Max Retries Reached
                    APP-->>RM: Still Failing
                    RM->>LOG: Operation Failed After Max Retries
                    RM->>FB: ExecuteFallback()
                end
            end
        else Permanent Failure
            APP-->>RM: PermanentException
            RM->>LOG: Permanent Failure - No Retry
            RM->>FB: ExecuteFallback()
        end
    end
    
    rect rgb(248, 248, 255)
        Note over APP,LOG: Bulkhead Pattern (Isolation)
        
        Note over RM: Resource Isolation
        par Discovery Thread Pool
            RM->>APP: DiscoveryOperations (Pool: 2 threads)
        and Calculation Thread Pool  
            RM->>APP: CalculationOperations (Pool: 1 thread)
        and Sync Thread Pool
            RM->>APP: SyncOperations (Pool: 3 threads)
        end
        
        Note over RM: Prevents resource starvation<br/>Isolates failure domains
    end
    
    rect rgb(255, 255, 240)
        Note over APP,LOG: Comprehensive Monitoring
        RM->>LOG: LogResilienceMetrics()
        
        Note right of LOG: Metrics collected:<br/>- Circuit breaker states<br/>- Retry attempts<br/>- Fallback usage<br/>- Thread pool utilization<br/>- Error rates by operation
        
        LOG->>LOG: AggregateMetrics()
        LOG->>LOG: TriggerAlertsIfNeeded()
    end
```

Cette architecture cross-fonctionnelle démontre comment RF.Go utilise des patterns architecturaux sophistiqués pour créer un système robuste, performant et résilient qui transcende les fonctionnalités individuelles documentées dans les use-cases.
