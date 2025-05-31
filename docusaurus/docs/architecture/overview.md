# Architecture système RF.Go

## 🎯 **Vision architecturale**

RF.Go implémente une **architecture en couches modulaire** optimisée pour la gestion temps réel des fréquences RF, avec une extensibilité multi-marques et une synchronisation bidirectionnelle avancée.

### **Principes architecturaux**

| Principe | Implémentation | Bénéfice |
|----------|----------------|----------|
| **Separation of Concerns** | Pattern MVVM strict | Maintenabilité, testabilité |
| **Single Responsibility** | Services spécialisés | Code focalisé, réutilisable |
| **Dependency Injection** | .NET DI Container | Couplage faible, testabilité |
| **Open/Closed** | Handlers extensibles | Ajout marques sans modification |
| **Protocol Abstraction** | Command Pattern | Support multi-protocoles |

## 🏗️ **Architecture système**

```mermaid
graph TB
    subgraph "🎨 Presentation Layer"
        UI[Blazor UI Components]
        VM[ViewModels MVVM]
    end
    
    subgraph "💼 Business Layer"
        FS[FrequencyCalculationService]
        DS[DiscoveryService]
        MS[DeviceMappingService]
        LS[LicensingService]
    end
    
    subgraph "🔌 Integration Layer"
        DH[Device Handlers]
        CS[Command Sets]
        NS[Network Services]
    end
    
    subgraph "💾 Data Layer"
        EF[Entity Framework Core]
        SQ[SQLite Database]
        FS2[File System]
    end
    
    subgraph "🌐 Network Layer"
        UDP[UDP Communication]
        TCP[TCP Communication]
        MDNS[mDNS Discovery]
        HTTP[HTTP Services]
    end
    
    subgraph "🎛️ External Devices"
        SENN[Sennheiser]
        SHURE[Shure]
    end

    UI --> VM
    VM --> FS
    VM --> DS
    VM --> MS
    VM --> LS
    
    FS --> EF
    DS --> DH
    MS --> DH
    DH --> CS
    DH --> NS
    NS --> UDP
    NS --> TCP
    NS --> MDNS
    
    EF --> SQ
    LS --> FS2
    
    UDP --> SENN
    TCP --> SHURE
```

## 🛠️ **Stack technologique**

### **Frontend & UI**

```mermaid
graph LR
    A[.NET MAUI 8.0] --> B[Blazor Server]
    B --> C[Bootstrap 5.3]
    C --> D[Mermaid.js]
    D --> E[Chart.js]
    E --> F[SignalR]
```

### **Backend & Services**

```mermaid
graph LR
    A[.NET 8.0] --> B[Entity Framework Core 8.0]
    B --> C[SQLite 3.45]
    C --> D[System.Text.Json]
    D --> E[Serilog]
    E --> F[FluentValidation]
```

### **Networking & Protocols**

```mermaid
graph LR
    A[mDNS/Bonjour] --> B[UDP Sockets]
    B --> C[TCP Sockets]
    C --> D[JSON-RPC]
    D --> E[Proprietary Protocols]
```

## 🔧 **Patterns architecturaux**

### **1. MVVM (Model-View-ViewModel)**

```csharp
// Séparation stricte des responsabilités
View (Blazor) → ViewModel → Service → Model → Data
```

### **2. Repository Pattern**

```csharp
// Abstraction de l'accès aux données
IRepository<T> → EF Core → SQLite
```

### **3. Factory Pattern**

```csharp
// Création dynamique de handlers
DeviceHandlerFactory → IDeviceHandler → Concrete Handler
```

### **4. Command Pattern**

```csharp
// Abstraction des protocoles
IDeviceCommandSet → Brand Specific Commands
```

### **5. Observer Pattern**

```csharp
// Notifications temps réel
DeviceDiscovered → Event → UI Update
```

### **Stratégie de cache**

- **L1 Cache** : In-memory ViewModels
- **L2 Cache** : SQLite with indexes
- **L3 Cache** : Frequency calculation results

## 🔄 **Architecture d'intégration**

### **Support multi-protocoles**

```mermaid
graph TB
    subgraph "Protocol Abstraction"
        IHandler[IDeviceHandler]
        ICommand[IDeviceCommandSet]
    end
    
    subgraph "Sennheiser Stack"
        SH[SennheiserHandler]
        G4H[G4Handler]
        SC[SennheiserCommands]
        G4C[G4Commands]
    end
    
    subgraph "Shure Stack"
        SHU[ShureHandler]
        SHUC[ShureCommands]
    end
    
    IHandler -.-> SH
    IHandler -.-> G4H
    IHandler -.-> SHU
    ICommand -.-> SC
    ICommand -.-> G4C
    ICommand -.-> SHUC
```

## 📈 **Extensibilité et évolutivité**

### **Ajout de nouvelles marques**

1. Implémenter `IDeviceHandler`
2. Créer `BrandCommandSet`
3. Enregistrer dans DI Container
4. Aucune modification du core

### **Nouveaux protocoles**

1. Hériter de `NetworkService`
2. Implémenter la découverte
3. Définir le format de communication
