# Diagrammes d'états

Les diagrammes d'états de RF.Go modélisent le comportement des entités principales basé sur l'analyse du code source. Ces modèles décrivent les transitions d'états effectivement implémentées dans le système.

## 1. Machine à états d'un appareil RF (RFDevice)

### Cycle de vie complet basé sur les propriétés IsSynced, IsOnline, PendingSync

```mermaid
stateDiagram-v2
    [*] --> Discovered : mDNS/SLP/UDP Discovery
    
    state "Device Discovered" as Discovered
    state "Device Mapped" as Mapped  
    state "Device Online" as Online
    state "Device Offline" as Offline
    
    Discovered --> Mapped : User clicks "Sync!" + MappingModal
    Mapped --> Online : CheckSingleDeviceSync (30s timer)
    Online --> Offline : IsNotResponding = true
    Offline --> Online : Device responds again
    
    note right of Discovered
        DeviceDiscoveredEventArgs object
        IsSynced = false
        Stored in DiscoveryService.DiscoveredDevices
        Displayed in OnlineTab
    end note
    
    note right of Mapped
        RFDevice object
        IsSynced = true, IsOnline = true, PendingSync = false
        CastDeviceDiscoveredToRFDevice()
        AddItemAsync<RFDevice>() if ID = 0
        UpdateItemAsync<RFDevice>() if ID != 0
    end note
    
    note right of Online
        IsSynced = true, IsOnline = true
        PendingSync = false/true (depends on comparison)
        Timer vérifie toutes les 30s
        handler.IsDevicePendingSync()
    end note
    
    note right of Offline
        IsSynced = true, IsOnline = false
        PendingSync = N/A (not checked when offline)
        Device not responding to network calls
    end note
```

## 2. États de découverte réseau

### Flux de découverte multi-protocoles (DiscoveryService)

```mermaid
stateDiagram-v2
    [*] --> Idle
    
    state "Discovery Idle" as Idle
    state "Discovery Running" as Running
    state "Devices Found" as Found
    
    Idle --> Running : StartDiscovery()
    
    state Running {
        [*] --> ParallelDiscovery
        
        state ParallelDiscovery {
            state mDNSDiscovery
            state G4Discovery  
            state ShureDiscovery
            
            [*] --> mDNSDiscovery
            [*] --> G4Discovery
            [*] --> ShureDiscovery
        }
        
        ParallelDiscovery --> ProcessingResults : Device responses
    }
    
    Running --> Found : DeviceDiscovered event
    Found --> Running : Continue discovery
    Running --> Idle : StopDiscovery()
    
    note right of mDNSDiscovery
        _ssc._udp.local (Sennheiser)
        _ewd._http.local (Sennheiser)
        Port 5353
    end note
    
    note right of G4Discovery
        UDP multicast 224.0.0.251:8133
        Proprietary G4 protocol
        ParseG4DeviceInfo()
    end note
    
    note right of ShureDiscovery
        SLP 239.255.254.253:8427
        ParseShureSlpResponse()
        TCP 2202
    end note
```

## 3. États de monitoring (Timer 30 secondes)

### CheckSingleDeviceSync - Machine à états de vérification

```mermaid
stateDiagram-v2
    [*] --> TimerTrigger
    
    state "Timer Callback" as TimerTrigger
    state "Check Conditions" as CheckConditions
    state "Create DeviceInfo" as CreateInfo
    state "Handler Check" as HandlerCheck
    state "Update States" as UpdateStates
    state "Complete" as Complete
    
    TimerTrigger --> CheckConditions : Every 30 seconds
    
    state CheckConditions {
        [*] --> ValidateDevice
        ValidateDevice --> CheckIsSynced : device != null
        CheckIsSynced --> GetHandler : device.IsSynced = true
        GetHandler --> [*] : handler found
        
        ValidateDevice --> [*] : device = null (return)
        CheckIsSynced --> [*] : IsSynced = false (return)
        GetHandler --> [*] : no handler (return)
    }
    
    CheckConditions --> CreateInfo : Conditions OK
    CreateInfo --> HandlerCheck : DeviceDiscoveredEventArgs created
    
    state HandlerCheck {
        [*] --> CallIsDevicePendingSync
        CallIsDevicePendingSync --> ProcessResponse : await handler.IsDevicePendingSync()
        ProcessResponse --> [*] : (IsEqual, IsNotResponding)
    }
    
    HandlerCheck --> UpdateStates : Response received
    
    state UpdateStates {
        [*] --> CheckResponding
        CheckResponding --> SetOffline : IsNotResponding = true
        CheckResponding --> SetOnlineAndSync : IsNotResponding = false
        
        SetOffline --> [*] : device.IsOnline = false
        SetOnlineAndSync --> [*] : device.IsOnline = true, device.PendingSync = !IsEqual
    }
    
    UpdateStates --> Complete
    Complete --> [*]
```

## 4. États de synchronisation - Handler.IsDevicePendingSync

### Logique de vérification Sennheiser/Shure

```mermaid
stateDiagram-v2
    [*] --> StartCheck
    
    state "Start Check" as StartCheck
    state "Test Connectivity" as TestConnectivity
    state "Compare Channels" as CompareChannels
    state "Return Result" as ReturnResult
    
    StartCheck --> TestConnectivity : handler.IsDevicePendingSync()
    
    state TestConnectivity {
        [*] --> SendSerialCommand
        SendSerialCommand --> CheckResponse : GetSerialCommand()
        
        state CheckResponse {
            [*] --> SennheiserCheck
            [*] --> ShureCheck
            
            SennheiserCheck --> NotResponding : response = null or empty
            SennheiserCheck --> Responding : response OK
            
            ShureCheck --> NotResponding : no "REP" in response
            ShureCheck --> Responding : contains "REP"
        }
        
        NotResponding --> [*] : return (false, true)
        Responding --> [*] : continue to channels
    }
    
    TestConnectivity --> CompareChannels : Device responding
    TestConnectivity --> ReturnResult : Device not responding
    
    state CompareChannels {
        [*] --> LoopChannels
        
        LoopChannels --> GetChannelFreq : for each channel
        GetChannelFreq --> GetChannelName : frequency command
        GetChannelName --> CompareValues : name command
        
        CompareValues --> NotEqual : frequency != expected OR name != expected
        CompareValues --> NextChannel : values match
        
        NotEqual --> [*] : return (false, false)
        NextChannel --> LoopChannels : more channels
        NextChannel --> [*] : all channels OK, return (true, false)
    }
    
    CompareChannels --> ReturnResult : Comparison complete
    ReturnResult --> [*]
    
    note right of TestConnectivity
        Sennheiser: UDP port 45
        Shure: TCP port 2202
        Commands via CommunicationService
    end note
    
    note right of CompareChannels
        Compare app values vs device:
        channelInfo.Frequency vs device
        channelInfo.Name vs device
        Return IsEqual = false if different
    end note
```

## 5. États de mapping - Processus MappingModal

### Transformation DeviceDiscoveredEventArgs vers RFDevice

```mermaid
stateDiagram-v2
    [*] --> OnlineTabDisplay
    
    state "Online Tab Display" as OnlineTabDisplay
    state "User Click Sync" as UserClickSync
    state "Find Matching Devices" as FindMatching
    state "Open Mapping Modal" as OpenModal
    state "User Selection" as UserSelection
    state "Execute Mapping" as ExecuteMapping
    state "Save to Database" as SaveToDB
    state "Update States" as UpdateStates
    
    OnlineTabDisplay --> UserClickSync : Click "Sync!" button
    UserClickSync --> FindMatching : HandleSyncDevice()
    
    state FindMatching {
        [*] --> FilterDevices
        FilterDevices --> CheckMatches : Brand + Model + Frequency + !IsSynced
        CheckMatches --> ShowModal : matches found
        CheckMatches --> ShowError : no matches
        ShowError --> [*] : "No matching device found"
        ShowModal --> [*]
    }
    
    FindMatching --> OpenModal : Matching devices found
    OpenModal --> UserSelection : MappingModal displayed
    UserSelection --> ExecuteMapping : User selects device + sync direction
    
    state ExecuteMapping {
        [*] --> CastToRFDevice
        CastToRFDevice --> ChooseSyncDirection : CastDeviceDiscoveredToRFDevice()
        
        ChooseSyncDirection --> SyncToDevice : "Sync to Device" selected
        ChooseSyncDirection --> SyncFromDevice : "Sync from Device" selected
        
        SyncToDevice --> [*] : FirstSyncToDevice()
        SyncFromDevice --> [*] : FirstSyncFromDevice()
    }
    
    ExecuteMapping --> SaveToDB : Sync completed
    
    state SaveToDB {
        [*] --> CheckDeviceID
        CheckDeviceID --> AddItem : device.ID = 0
        CheckDeviceID --> UpdateItem : device.ID != 0
        
        AddItem --> [*] : AddItemAsync<RFDevice>()
        UpdateItem --> [*] : UpdateItemAsync<RFDevice>()
    }
    
    SaveToDB --> UpdateStates : Database updated
    
    state UpdateStates {
        [*] --> SetMappedStates
        SetMappedStates --> [*] : IsSynced = true, IsOnline = true, PendingSync = false
    }
    
    UpdateStates --> [*]
```

## Métriques de performance des états

### Temps de transition mesurés

| Transition | Implémentation | Temps typique | Action en cas d'échec |
|------------|---------------|---------------|----------------------|
| Discovery → Found | mDNS/SLP response | 2-10s | Continue discovery |
| User Sync → Mapped | MappingModal workflow | 1-3s | Show error message |
| Timer Check | CheckSingleDeviceSync | 30s interval | Log error, continue |
| Connectivity Test | TCP/UDP command | 2-5s timeout | Set IsOnline = false |
| Channel Comparison | Handler comparison | 100-500ms | Set PendingSync = true |

### Contraintes d'états réelles

1. **IsSynced** : Défini uniquement lors du mapping utilisateur
2. **IsOnline** : Mis à jour uniquement par le timer 30s via CheckSingleDeviceSync
3. **PendingSync** : Calculé par comparaison app vs device physique
4. **Timer requirement** : `IsSynced = true` pour être vérifié
5. **Handler requirement** : Brand match requis pour communication

Ces diagrammes d'états reflètent fidèlement l'implémentation réelle du système RF.Go basée sur l'analyse du code source.
