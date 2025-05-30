# Diagrammes d'États - Cycles de Vie et Comportements

Les diagrammes d'états de RF.Go modélisent le **comportement dynamique** des entités principales du système. Ces modèles décrivent les transitions d'états complexes qui régissent le fonctionnement des appareils RF, des sessions utilisateur et des processus de synchronisation.

## 1. Machine à États d'un Appareil RF (RFDevice)

### Cycle de Vie Complet d'un Appareil

```mermaid
stateDiagram-v2
    [*] --> Uninitialized
    
    state "Appareil Non Initialisé" as Uninitialized
    state "Appareil Découvert" as Discovered
    state "Appareil Configuré" as Configured
    state "Appareil Synchronisé" as Synchronized
    state "Appareil En Ligne" as Online
    state "Appareil Hors Ligne" as Offline
    state "Appareil en Conflit" as Conflicted
    state "Appareil en Erreur" as Error
    
    Uninitialized --> Discovered : Device Discovery Event
    Discovered --> Configured : Configuration Applied
    Discovered --> Error : Configuration Failed
    
    Configured --> Synchronized : First Sync Success
    Configured --> Error : Sync Failed
    Configured --> Offline : Network Unavailable
    
    Synchronized --> Online : Network Connected + Heartbeat OK
    Synchronized --> Offline : Network Lost
    Synchronized --> Conflicted : Frequency Conflict Detected
    
    Online --> Offline : Connection Lost / Timeout
    Online --> Conflicted : Interference Detected
    Online --> Synchronized : Manual Refresh
    
    Offline --> Online : Network Restored + Reconnection
    Offline --> Error : Persistent Connection Failure
    
    Conflicted --> Synchronized : Conflict Resolved
    Conflicted --> Error : Unresolvable Conflict
    
    Error --> Configured : Manual Reset
    Error --> [*] : Device Removed
    
    note right of Discovered
        Informations de base disponibles :
        - IP Address
        - Brand/Model
        - Serial Number
    end note
    
    note right of Synchronized
        État optimal :
        - Fréquences assignées
        - Paramètres appliqués
        - Communication bidirectionnelle
    end note
```

### États Internes de Synchronisation

```mermaid
stateDiagram-v2
    state Synchronized {
        [*] --> SyncIdle
        
        state "Synchronisé - Inactif" as SyncIdle
        state "Synchronisation en Cours" as SyncInProgress
        state "Synchronisation Réussie" as SyncSuccess
        state "Synchronisation Échouée" as SyncFailed
        state "Synchronisation Partielle" as SyncPartial
        
        SyncIdle --> SyncInProgress : Sync Triggered
        SyncInProgress --> SyncSuccess : All Commands ACK
        SyncInProgress --> SyncFailed : Command NACK / Timeout
        SyncInProgress --> SyncPartial : Some Commands Failed
        
        SyncSuccess --> SyncIdle : After Confirmation
        SyncFailed --> SyncIdle : After Retry Limit
        SyncPartial --> SyncInProgress : Retry Failed Commands
        SyncPartial --> SyncIdle : Accept Partial State
    }
```

## 2. États d'une Session Utilisateur

### Gestion du Cycle de Vie des Sessions

```mermaid
stateDiagram-v2
    [*] --> SessionUninitialized
    
    state "Session Non Initialisée" as SessionUninitialized
    state "Authentification" as Authentication
    state "Session Active" as SessionActive
    state "Session Suspendue" as SessionSuspended
    state "Session Expirée" as SessionExpired
    state "Session Fermée" as SessionClosed
    
    SessionUninitialized --> Authentication : User Login
    
    state Authentication {
        [*] --> ValidatingCredentials
        ValidatingCredentials --> CheckingLicense : Credentials Valid
        ValidatingCredentials --> AuthFailed : Invalid Credentials
        CheckingLicense --> AuthSuccess : License Valid
        CheckingLicense --> AuthFailed : License Invalid/Expired
        AuthSuccess --> [*]
        AuthFailed --> [*]
    }
    
    Authentication --> SessionActive : Auth Success
    Authentication --> SessionUninitialized : Auth Failed
    
    state SessionActive {
        [*] --> Working
        
        state "Travail en Cours" as Working
        state "Calcul RF" as CalculatingRF
        state "Synchronisation" as SyncingDevices
        state "Sauvegarde" as Saving
        
        Working --> CalculatingRF : RF Calculation Triggered
        Working --> SyncingDevices : Device Sync Triggered
        Working --> Saving : Auto-Save Triggered
        
        CalculatingRF --> Working : Calculation Complete
        SyncingDevices --> Working : Sync Complete
        Saving --> Working : Save Complete
    }
    
    SessionActive --> SessionSuspended : User Idle Timeout
    SessionActive --> SessionClosed : User Logout
    SessionActive --> SessionExpired : License Expired
    
    SessionSuspended --> SessionActive : User Activity
    SessionSuspended --> SessionExpired : Extended Inactivity
    
    SessionExpired --> Authentication : Re-authentication Required
    SessionClosed --> [*] : Session Terminated
```

## 3. États du Processus de Calcul RF

### Machine à États du Moteur de Calcul

```mermaid
stateDiagram-v2
    [*] --> CalculationIdle
    
    state "Calcul Inactif" as CalculationIdle
    state "Préparation Calcul" as PreparingCalculation
    state "Calcul en Cours" as Calculating
    state "Optimisation" as Optimizing
    state "Validation" as Validating
    state "Calcul Terminé" as CalculationComplete
    state "Erreur de Calcul" as CalculationError
    
    CalculationIdle --> PreparingCalculation : Calculate Request
    
    state PreparingCalculation {
        [*] --> LoadingDevices
        LoadingDevices --> LoadingExclusions : Devices Loaded
        LoadingExclusions --> GroupingByTime : Exclusions Loaded
        GroupingByTime --> PrepComplete : Groups Created
        PrepComplete --> [*]
    }
    
    PreparingCalculation --> Calculating : Preparation Complete
    PreparingCalculation --> CalculationError : Preparation Failed
    
    state Calculating {
        [*] --> ProcessingLockedFrequencies
        ProcessingLockedFrequencies --> ProcessingUnlockedFrequencies : Locked Complete
        ProcessingUnlockedFrequencies --> CalculatingIntermodulations : Frequencies Assigned
        CalculatingIntermodulations --> CalcComplete : Intermod Complete
        CalcComplete --> [*]
    }
    
    Calculating --> Optimizing : Conflicts Detected
    Calculating --> Validating : No Conflicts
    Calculating --> CalculationError : Calculation Failed
    
    state Optimizing {
        [*] --> AnalyzingConflicts
        AnalyzingConflicts --> ReallocatingFrequencies : Conflicts Identified
        ReallocatingFrequencies --> RetestingIntermod : Frequencies Reallocated
        RetestingIntermod --> OptimizationComplete : No More Conflicts
        RetestingIntermod --> AnalyzingConflicts : Conflicts Persist
        OptimizationComplete --> [*]
    }
    
    Optimizing --> Validating : Optimization Complete
    Optimizing --> CalculationError : Max Iterations Exceeded
    
    Validating --> CalculationComplete : Validation Passed
    Validating --> Optimizing : Additional Conflicts Found
    
    CalculationComplete --> CalculationIdle : Reset for Next Calculation
    CalculationError --> CalculationIdle : Error Handled
```

## 4. États de Découverte Réseau

### Processus de Discovery Multi-Protocoles

```mermaid
stateDiagram-v2
    [*] --> DiscoveryIdle
    
    state "Discovery Inactif" as DiscoveryIdle
    state "Discovery en Cours" as DiscoveryActive
    state "Discovery Terminé" as DiscoveryComplete
    state "Erreur Discovery" as DiscoveryError
    
    DiscoveryIdle --> DiscoveryActive : Start Discovery
    
    state DiscoveryActive {
        [*] --> InitializingHandlers
        
        state "Initialisation Handlers" as InitializingHandlers
        state "Discovery Parallèle" as ParallelDiscovery
        state "Agrégation Résultats" as AggregatingResults
        
        InitializingHandlers --> ParallelDiscovery : Handlers Ready
        
        state ParallelDiscovery {
            state mDNSDiscovery
            state SLPDiscovery  
            state UDPDiscovery
            
            [*] --> mDNSDiscovery
            [*] --> SLPDiscovery
            [*] --> UDPDiscovery
        }
        
        ParallelDiscovery --> AggregatingResults : All Protocols Complete
        AggregatingResults --> DiscoveryActiveComplete : Aggregation Done
        DiscoveryActiveComplete --> [*]
    }
    
    DiscoveryActive --> DiscoveryComplete : Discovery Successful
    DiscoveryActive --> DiscoveryError : Discovery Failed
    
    DiscoveryComplete --> DiscoveryIdle : Results Processed
    DiscoveryError --> DiscoveryIdle : Error Handled
```

## 5. États d'un Canal RF (RFChannel)

### Gestion des États de Fréquence

```mermaid
stateDiagram-v2
    [*] --> Unassigned
    
    state "Non Assigné" as Unassigned
    state "Assigné" as Assigned
    state "Verrouillé" as Locked
    state "En Conflit" as InConflict
    state "Optimisé" as Optimized
    state "Synchronisé" as ChannelSynced
    
    Unassigned --> Assigned : Frequency Calculated
    Assigned --> Locked : User Lock
    Assigned --> InConflict : Conflict Detected
    Assigned --> Optimized : Optimization Applied
    
    Locked --> Assigned : User Unlock
    
    InConflict --> Assigned : Conflict Resolved
    InConflict --> Optimized : Manual Optimization
    
    Optimized --> ChannelSynced : Sync to Device
    Optimized --> InConflict : New Conflict
    
    ChannelSynced --> Assigned : Manual Change
    ChannelSynced --> InConflict : External Interference
    
    note right of Locked
        Fréquence protégée :
        - Ne peut pas être modifiée
          par le calcul automatique
        - Utilisée comme référence
          pour les autres calculs
    end note
    
    note right of InConflict
        Types de conflits :
        - Intermodulation détectée
        - Fréquence déjà utilisée
        - Canal TV exclu
    end note
```

## 6. États de Connectivité Réseau

### Gestion de la Connectivité Multi-Appareils

```mermaid
stateDiagram-v2
    [*] --> NetworkUnknown
    
    state "Réseau Inconnu" as NetworkUnknown
    state "Réseau Connecté" as NetworkConnected
    state "Réseau Déconnecté" as NetworkDisconnected
    state "Réseau Instable" as NetworkUnstable
    state "Mode Hors Ligne" as OfflineMode
    
    NetworkUnknown --> NetworkConnected : Network Test Passed
    NetworkUnknown --> NetworkDisconnected : Network Test Failed
    
    state NetworkConnected {
        [*] --> Monitoring
        
        state "Surveillance Active" as Monitoring
        state "Test Connectivité" as TestingConnectivity
        state "Reconnexion Auto" as AutoReconnecting
        
        Monitoring --> TestingConnectivity : Periodic Check
        TestingConnectivity --> Monitoring : Test Successful
        TestingConnectivity --> AutoReconnecting : Test Failed
        AutoReconnecting --> Monitoring : Reconnection Successful
        AutoReconnecting --> [*] : Reconnection Failed
    }
    
    NetworkConnected --> NetworkUnstable : Intermittent Failures
    NetworkConnected --> NetworkDisconnected : Connection Lost
    
    NetworkUnstable --> NetworkConnected : Stability Restored
    NetworkUnstable --> NetworkDisconnected : Complete Failure
    
    NetworkDisconnected --> NetworkConnected : Connection Restored
    NetworkDisconnected --> OfflineMode : Extended Disconnection
    
    OfflineMode --> NetworkUnknown : Network Retry
```

## 7. Transitions Inter-États et Événements

### Matrice des Événements Déclencheurs

| État Source | Événement | État Destination | Condition |
|-------------|-----------|------------------|-----------|
| **Uninitialized** | DeviceDiscovered | Discovered | Valid Device Info |
| **Discovered** | ConfigurationApplied | Configured | Valid Configuration |
| **Configured** | SyncSuccess | Synchronized | Network Available |
| **Synchronized** | HeartbeatOK | Online | Continuous Communication |
| **Online** | ConnectionLost | Offline | Network Timeout |
| **Offline** | NetworkRestored | Online | Reconnection Success |
| **Conflicted** | ConflictResolved | Synchronized | Frequency Reallocation |

### Invariants et Contraintes d'États

1. **Contrainte de Cohérence** : Un appareil ne peut être `Online` que s'il est d'abord `Synchronized`
2. **Contrainte Temporelle** : La transition `Offline` → `Online` nécessite une validation de la connectivité
3. **Contrainte Métier** : Un canal `Locked` ne peut pas passer en état `InConflict` via le calcul automatique
4. **Contrainte de Ressources** : Maximum 50 appareils en état `Calculating` simultanément

## Métriques de Performance des États

### Temps de Transition Moyens

| Transition | Temps Moyen | Temps Max Acceptable | Action si Dépassement |
|------------|-------------|---------------------|----------------------|
| `Uninitialized` → `Discovered` | 2-10s | 30s | Timeout Discovery |
| `Configured` → `Synchronized` | 1-3s | 10s | Retry Sync |
| `Synchronized` → `Online` | 500ms | 2s | Check Network |
| `Calculating` → `Complete` | 2-5s | 15s | Interrupt Calculation |

Ces diagrammes d'états fournissent une modélisation précise du comportement dynamique de RF.Go et constituent un guide essentiel pour l'implémentation des transitions d'états complexes du système. 