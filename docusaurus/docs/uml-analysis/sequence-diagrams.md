# Diagrammes de Séquence - Interactions Système

Les diagrammes de séquence de RF.Go illustrent les **interactions temporelles complexes** entre les différents composants du système. Cette modélisation détaille les flux de communication critiques, depuis la découverte des appareils jusqu'à la synchronisation finale.

## 1. Séquence Complète : Calcul et Synchronisation RF

### Scénario Principal de Calcul des Fréquences

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant VM as DevicesViewModel
    participant FS as FrequencyService
    participant FD as FrequencyData
    participant DS as DiscoveryService
    participant DH as DeviceHandler
    participant DB as Database
    participant UI as Interface

    Note over U,UI: Phase 1: Initialisation et Découverte
    U->>VM: Démarrer Discovery
    VM->>DS: StartDiscovery()
    
    DS->>DH: InitializeHandlers()
    DH-->>DS: Handlers Ready
    DS->>DH: TriggerDiscovery()
    
    loop Discovery Multi-Protocoles
        DH->>DH: mDNS Discovery
        DH->>DH: SLP Discovery
        DH->>DH: UDP Discovery
        DH-->>DS: DeviceDiscovered Events
    end
    
    DS-->>VM: DiscoveredDevices Updated
    VM-->>UI: Refresh Device List
    
    Note over U,UI: Phase 2: Configuration et Import
    U->>VM: Sélectionner Appareils
    VM->>DB: SaveSelectedDevices()
    DB-->>VM: Devices Saved
    
    Note over U,UI: Phase 3: Calcul des Fréquences
    U->>VM: Calculer Plan RF
    VM->>FS: CalculateFrequencyPlan()
    
    FS->>FD: InitializeFrequencyData()
    FD-->>FS: Data Initialized
    
    FS->>FS: GroupDevicesByTimePeriod()
    
    loop Pour Chaque Groupe Temporel
        FS->>FS: ProcessLockedFrequencies()
        FS->>FS: ProcessUnlockedFrequencies()
        
        loop Pour Chaque Canal
            FS->>FS: GenerateRandomFrequency()
            FS->>FD: CheckFrequencyAvailability()
            FD-->>FS: Availability Status
            
            alt Fréquence Disponible
                FS->>FD: CalculateAllIntermodulations()
                FD->>FD: Calculate 2Tx 3rd, 5th, 7th Order
                FD->>FD: Calculate 3Tx 3rd Order
                FD-->>FS: Intermodulations Calculated
                FS->>FD: AddUsedFrequency()
            else Fréquence Occupée
                FS->>FS: RetryWithNewFrequency()
            end
        end
    end
    
    FS-->>VM: Calculation Complete
    VM->>DB: SaveCalculationResults()
    DB-->>VM: Results Saved
    VM-->>UI: Update Frequency Display
    
    Note over U,UI: Phase 4: Synchronisation Appareils
    U->>VM: Magic Sync To Devices
    VM->>DS: SyncAllDevices()
    
    loop Pour Chaque Appareil
        DS->>DH: SyncDevice(device, frequencies)
        DH->>DH: BuildCommands()
        DH->>DH: SendTCPCommands()
        
        alt Sync Réussi
            DH-->>DS: SyncSuccess
            DS->>DB: UpdateDeviceStatus(Synchronized)
        else Sync Échoué
            DH-->>DS: SyncFailed
            DS->>DB: UpdateDeviceStatus(Error)
        end
    end
    
    DS-->>VM: Sync Results
    VM-->>UI: Update Device Status
    VM-->>U: Synchronisation Terminée
```

## 2. Discovery Réseau Multi-Protocoles

### Orchestration des Handlers de Découverte

```mermaid
sequenceDiagram
    participant DS as DiscoveryService
    participant SH as SennheiserHandler
    participant SHU as ShureHandler
    participant GH as GenericHandler
    participant N as Network
    participant VM as ViewModel

    Note over DS,VM: Initialisation Discovery Service
    DS->>SH: Initialize()
    DS->>SHU: Initialize()  
    DS->>GH: Initialize()
    
    SH-->>DS: mDNS Handler Ready
    SHU-->>DS: SLP Handler Ready
    GH-->>DS: UDP Handler Ready
    
    Note over DS,VM: Démarrage Discovery Parallèle
    par Discovery mDNS (Sennheiser)
        DS->>SH: StartDiscovery()
        SH->>N: Subscribe to _sennheiser._tcp
        N-->>SH: mDNS Response
        SH->>SH: ParseSennheiserDevice()
        SH-->>DS: DeviceDiscovered(sennheiser_device)
    and Discovery SLP (Shure)
        DS->>SHU: StartDiscovery()
        SHU->>N: Multicast to 239.255.254.253:8427
        N-->>SHU: SLP Response
        SHU->>SHU: ParseShureDevice()
        SHU-->>DS: DeviceDiscovered(shure_device)
    and Discovery UDP (Generic)
        DS->>GH: StartDiscovery()
        GH->>N: UDP Broadcast Scan
        N-->>GH: UDP Response
        GH->>GH: ParseGenericDevice()
        GH-->>DS: DeviceDiscovered(generic_device)
    end
    
    Note over DS,VM: Agrégation et Déduplication
    DS->>DS: DeduplicateDevices()
    DS->>DS: ValidateDevices()
    
    loop Pour Chaque Appareil Découvert
        DS->>DS: FetchDetailedInfo()
        alt Fetch Réussi
            DS-->>VM: DeviceAdded Event
        else Fetch Échoué
            DS->>DS: RetryFetch()
        end
    end
    
    DS-->>VM: Discovery Complete
```

## 3. Authentification et Gestion des Licences

### Processus Complet d'Authentification

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant AVM as AuthViewModel
    participant AS as AuthService
    participant LS as LicenseService
    participant SS as StorageService
    participant API as License API
    participant DB as Database

    Note over U,DB: Phase 1: Authentification Utilisateur
    U->>AVM: Login(email, password)
    AVM->>AS: AuthenticateUser(credentials)
    
    AS->>SS: CheckStoredCredentials()
    alt Credentials Cached & Valid
        SS-->>AS: Cached Credentials Valid
        AS-->>AVM: Authentication Success
    else Credentials Not Cached or Invalid
        AS->>API: ValidateCredentials(email, password)
        API->>API: Hash & Compare Password
        
        alt Credentials Valid
            API-->>AS: User Validated + JWT Token
            AS->>SS: StoreCachedCredentials()
            AS-->>AVM: Authentication Success
        else Credentials Invalid
            API-->>AS: Authentication Failed
            AS-->>AVM: Authentication Failed
            AVM-->>U: Show Error Message
        end
    end
    
    Note over U,DB: Phase 2: Validation Licence
    AVM->>LS: ValidateLicense()
    LS->>SS: GetStoredLicense()
    
    alt License Stored & Valid
        SS-->>LS: Valid License Found
        LS-->>AVM: License Valid
    else No License or Expired
        LS->>API: CheckLicenseStatus(user_id)
        
        alt License Available
            API-->>LS: License Details
            LS->>SS: StoreLicense()
            LS-->>AVM: License Activated
        else No Valid License
            LS-->>AVM: License Required
            AVM-->>U: Request License Key
            
            U->>AVM: EnterLicenseKey(key)
            AVM->>LS: ActivateLicense(key)
            LS->>API: ValidateLicenseKey(key)
            
            alt License Key Valid
                API-->>LS: License Activated
                LS->>SS: StoreLicense()
                LS->>DB: UpdateUserLicense()
                LS-->>AVM: License Success
                AVM-->>U: License Activated
            else License Key Invalid
                API-->>LS: Invalid License
                LS-->>AVM: License Invalid
                AVM-->>U: Invalid License Key
            end
        end
    end
    
    Note over U,DB: Phase 3: Initialisation Session
    AVM->>DB: CreateUserSession()
    AVM->>AS: InitializeServices()
    AS-->>AVM: Services Ready
    AVM-->>U: Redirect to Main App
```

## 4. Synchronisation Bidirectionnelle des Appareils

### Magic Sync - Synchronisation Complexe

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant VM as DevicesViewModel
    participant MS as MappingService
    participant DH as DeviceHandler
    participant D as Device (Network)
    participant DB as Database

    Note over U,DB: Phase 1: Préparation Synchronisation
    U->>VM: Magic Sync To Devices
    VM->>VM: ValidateSelectedDevices()
    VM->>MS: PrepareSyncOperations()
    
    MS->>DB: GetDeviceConfigurations()
    DB-->>MS: Device Configs
    MS->>MS: BuildSyncCommands()
    MS-->>VM: Sync Operations Ready
    
    Note over U,DB: Phase 2: Synchronisation Parallèle
    par Device 1 Sync
        VM->>DH: SyncDevice(device1)
        DH->>DH: GetHandler(Sennheiser)
        DH->>D: TCP Connect(device1_ip)
        
        alt Connection Success
            DH->>D: Send SET_FREQUENCY Command
            D-->>DH: ACK Response
            DH->>D: Send SET_NAME Command  
            D-->>DH: ACK Response
            DH->>D: Send STORE_CONFIG Command
            D-->>DH: ACK Response
            DH-->>VM: Device1 Sync Success
        else Connection Failed
            DH-->>VM: Device1 Sync Failed
        end
    and Device 2 Sync
        VM->>DH: SyncDevice(device2)
        DH->>DH: GetHandler(Shure)
        DH->>D: TCP Connect(device2_ip)
        
        alt Connection Success
            DH->>D: Send ULXD Frequency Command
            D-->>DH: Command Response
            DH->>D: Send ULXD Name Command
            D-->>DH: Command Response
            DH-->>VM: Device2 Sync Success
        else Connection Failed
            DH-->>VM: Device2 Sync Failed
        end
    end
    
    Note over U,DB: Phase 3: Mise à Jour États
    VM->>DB: UpdateDeviceStates(sync_results)
    DB-->>VM: States Updated
    
    VM->>MS: LogSyncResults()
    MS->>DB: StoreSyncLog()
    
    VM-->>U: Sync Complete Report
    
    Note over U,DB: Phase 4: Synchronisation Inverse (From Device)
    VM->>DH: CheckDeviceChanges()
    
    loop Pour Chaque Appareil
        DH->>D: Fetch Current Config
        D-->>DH: Device Config
        DH->>MS: CompareWithLocal(config)
        
        alt Differences Detected
            MS-->>VM: Changes Detected
            VM-->>U: Propose Sync From Device
            U->>VM: Accept/Reject Changes
            
            alt Accept Changes
                VM->>DB: UpdateLocalConfig()
                DB-->>VM: Local Updated
            else Reject Changes
                VM->>DH: Overwrite Device Config
                DH->>D: Send Corrected Config
            end
        end
    end
```

## 5. Gestion des Erreurs et Recovery

### Stratégies de Récupération Automatique

```mermaid
sequenceDiagram
    participant S as System
    participant EH as ErrorHandler
    participant L as Logger
    participant R as Recovery
    participant N as Notification
    participant U as User

    Note over S,U: Détection et Classification d'Erreur
    S->>EH: Exception Thrown
    EH->>EH: ClassifyError()
    
    alt Network Error
        EH->>EH: Analyze Network Issue
        EH->>R: InitiateNetworkRecovery()
        
        R->>R: CheckConnectivity()
        alt Network Available
            R->>R: RetryOperation()
            R-->>EH: Recovery Success
            EH-->>S: Resume Operation
        else Network Unavailable
            R->>R: EnableOfflineMode()
            R-->>EH: Offline Mode Activated
            EH->>N: NotifyUser("Offline Mode")
            N-->>U: Offline Notification
        end
        
    else Database Error
        EH->>EH: Analyze Database Issue
        EH->>R: InitiateDatabaseRecovery()
        
        R->>R: CheckDatabaseIntegrity()
        alt Database Corrupt
            R->>R: RestoreFromBackup()
            alt Backup Available
                R-->>EH: Database Restored
                EH-->>S: Resume Operation
            else No Backup
                R->>R: InitializeNewDatabase()
                R-->>EH: New Database Created
                EH->>N: NotifyUser("Data Reset")
                N-->>U: Data Loss Warning
            end
        else Database Locked
            R->>R: WaitAndRetry()
            R-->>EH: Database Access Restored
        end
        
    else Business Logic Error
        EH->>EH: AnalyzeBusinessError()
        EH->>L: LogBusinessError()
        EH->>N: NotifyUser("Business Error")
        N-->>U: Error Details + Suggestions
        
    else Unknown Error
        EH->>L: LogUnknownError()
        EH->>N: NotifyUser("Unexpected Error")
        N-->>U: Generic Error Message
        EH->>R: GracefulDegradation()
        R-->>EH: Fallback Mode Activated
    end
    
    Note over S,U: Logging et Monitoring
    EH->>L: LogRecoveryAction()
    L->>L: EnrichWithContext()
    L->>L: PersistLog()
    
    alt Critical Error
        L->>N: TriggerAlert()
        N-->>U: Critical Error Alert
    end
```

## 6. Performance et Optimisation

### Métriques des Interactions

| Séquence | Acteurs | Temps Moyen | Temps Critique | Points d'Optimisation |
|----------|---------|-------------|----------------|----------------------|
| **Discovery Complète** | 5-8 composants | 15-30s | 60s | Cache DNS, Timeouts |
| **Calcul RF Global** | 3-4 composants | 3-8s | 15s | Algorithmes parallèles |
| **Sync Single Device** | 2-3 composants | 1-2s | 5s | Batch commands |
| **Auth + License** | 4-6 composants | 2-5s | 10s | Token caching |
| **Error Recovery** | 3-5 composants | 1-3s | 8s | Predictive recovery |

### Patterns d'Interaction Identifiés

1. **Request-Response Asynchrone** : Utilisé pour les commandes réseau
2. **Observer Pattern** : Pour les notifications d'état
3. **Command Pattern** : Pour les opérations de synchronisation
4. **Circuit Breaker** : Pour la gestion des pannes réseau
5. **Saga Pattern** : Pour les transactions complexes multi-étapes

Ces diagrammes de séquence révèlent la sophistication des interactions dans RF.Go et démontrent une architecture robuste capable de gérer des scénarios complexes avec une gestion d'erreur appropriée. 