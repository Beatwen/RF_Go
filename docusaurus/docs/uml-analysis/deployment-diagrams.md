# Diagrammes de Déploiement - Infrastructure et Déploiement

Les diagrammes de déploiement de RF.Go illustrent l'**architecture d'infrastructure** et les **environnements de déploiement** du système. Cette modélisation détaille la distribution des composants logiciels sur l'infrastructure matérielle et les contraintes de déploiement.

## 1. Architecture de Déploiement Global

### Vue d'Ensemble de l'Infrastructure

```mermaid
graph TB
    subgraph "Client Side Infrastructure"
        subgraph "Engineer Workstation"
            WS1[Windows 10+ Workstation]
            WS1_APP[RF.Go Application]
            WS1_DB[(SQLite Database)]
            WS1_NET[Network Interface]
        end
        
        subgraph "Tablet/Mobile"
            TAB[Tablet Android/iOS]
            TAB_APP[RF.Go Mobile]
            TAB_SYNC[Sync Service]
        end
    end
    
    subgraph "Event Network Infrastructure"
        subgraph "Network Core"
            SW1[Managed Switch]
            RTR[Router/Firewall]
            WAP[Wireless Access Point]
        end
        
        subgraph "Audio Network VLAN"
            VLAN_AUDIO[VLAN 100 - Audio]
            AUDIO_SW[Audio Switch 24 ports]
        end
        
        subgraph "Management VLAN"
            VLAN_MGMT[VLAN 200 - Management]
            MGMT_SW[Management Switch]
        end
    end
    
    subgraph "RF Equipment Zone"
        subgraph "Sennheiser Rack"
            SENN1[EW-DX Receiver 1]
            SENN2[EW-DX Receiver 2]
            SENN3[EW-DX Receiver 3]
            SENN_SW[Sennheiser Switch]
        end
        
        subgraph "Shure Rack"
            SHURE1[ULXD4 Receiver 1]
            SHURE2[ULXD4 Receiver 2]
            SHURE3[ULXD4 Receiver 3]
            SHURE_SW[Shure Switch]
        end
    end
    
    subgraph "Cloud Services"
        CLOUD_LIC[License Server]
        CLOUD_UPDATE[Update Server]
        CLOUD_SUPPORT[Support Portal]
    end
    
    %% Connections
    WS1_APP --> WS1_DB
    WS1 --> WS1_NET
    WS1_NET --> SW1
    TAB_APP --> TAB_SYNC
    TAB --> WAP
    WAP --> SW1
    
    SW1 --> RTR
    SW1 --> VLAN_AUDIO
    SW1 --> VLAN_MGMT
    
    VLAN_AUDIO --> AUDIO_SW
    VLAN_MGMT --> MGMT_SW
    
    AUDIO_SW --> SENN_SW
    AUDIO_SW --> SHURE_SW
    SENN_SW --> SENN1
    SENN_SW --> SENN2
    SENN_SW --> SENN3
    SHURE_SW --> SHURE1
    SHURE_SW --> SHURE2
    SHURE_SW --> SHURE3
    
    RTR -.->|HTTPS| CLOUD_LIC
    RTR -.->|HTTPS| CLOUD_UPDATE
    RTR -.->|HTTPS| CLOUD_SUPPORT
    
    style WS1 fill:#e3f2fd
    style VLAN_AUDIO fill:#e8f5e8
    style CLOUD_LIC fill:#fff3e0
```

## 2. Environnements de Déploiement

### Environnement de Développement

```mermaid
graph LR
    subgraph "Development Environment"
        DEV_WS[Developer Workstation]
        DEV_VS[Visual Studio 2022]
        DEV_DB[(SQLite Dev DB)]
        DEV_SIM[Device Simulator]
    end
    
    subgraph "Development Tools"
        GIT[Git Repository]
        CI_CD[GitHub Actions]
        DOCKER[Docker Containers]
        TEST_NET[Test Network]
    end
    
    subgraph "Mock Services"
        MOCK_SENN[Mock Sennheiser]
        MOCK_SHURE[Mock Shure]
        MOCK_LIC[Mock License Server]
    end
    
    DEV_WS --> DEV_VS
    DEV_VS --> DEV_DB
    DEV_VS --> DEV_SIM
    DEV_WS --> GIT
    GIT --> CI_CD
    CI_CD --> DOCKER
    
    DEV_SIM --> TEST_NET
    TEST_NET --> MOCK_SENN
    TEST_NET --> MOCK_SHURE
    TEST_NET --> MOCK_LIC
    
    style DEV_WS fill:#e1f5fe
    style MOCK_SENN fill:#e8f5e8
```

### Environnement de Test

```mermaid
graph TB
    subgraph "Test Lab Environment"
        TEST_WS[Test Workstation]
        TEST_APP[RF.Go Test Build]
        TEST_DB[(Test Database)]
    end
    
    subgraph "Physical Test Equipment"
        REAL_SENN[Real Sennheiser EW-DX]
        REAL_SHURE[Real Shure ULXD4]
        REAL_GENERIC[Generic RF Device]
        TEST_SWITCH[Test Network Switch]
    end
    
    subgraph "Test Network"
        TEST_DHCP[DHCP Server]
        TEST_DNS[mDNS Service]
        TEST_MONITOR[Network Monitor]
    end
    
    TEST_WS --> TEST_APP
    TEST_APP --> TEST_DB
    TEST_WS --> TEST_SWITCH
    
    TEST_SWITCH --> REAL_SENN
    TEST_SWITCH --> REAL_SHURE
    TEST_SWITCH --> REAL_GENERIC
    TEST_SWITCH --> TEST_DHCP
    TEST_SWITCH --> TEST_DNS
    TEST_SWITCH --> TEST_MONITOR
    
    style TEST_WS fill:#fff3e0
    style REAL_SENN fill:#e8f5e8
```

### Environnement de Production

```mermaid
graph TB
    subgraph "Production Site - Festival"
        PROD_WS[Engineer Laptop]
        PROD_APP[RF.Go Production]
        PROD_DB[(Production Database)]
        BACKUP_WS[Backup Workstation]
    end
    
    subgraph "Production RF Equipment"
        PROD_SENN1[Sennheiser Rack 1]
        PROD_SENN2[Sennheiser Rack 2]
        PROD_SHURE1[Shure Rack 1]
        PROD_SHURE2[Shure Rack 2]
        PROD_WISYCOM[Wisycom Equipment]
    end
    
    subgraph "Production Network"
        PROD_CORE[Core Switch]
        PROD_MGMT[Management VLAN]
        PROD_AUDIO[Audio VLAN]
        PROD_MONITOR[Network Monitoring]
        PROD_BACKUP[Backup System]
    end
    
    subgraph "Site Infrastructure"
        UPS[UPS System]
        GENERATOR[Backup Generator]
        COOLING[Cooling System]
        SECURITY[Security System]
    end
    
    PROD_WS --> PROD_APP
    PROD_APP --> PROD_DB
    PROD_WS --> PROD_CORE
    BACKUP_WS --> PROD_CORE
    
    PROD_CORE --> PROD_MGMT
    PROD_CORE --> PROD_AUDIO
    PROD_AUDIO --> PROD_SENN1
    PROD_AUDIO --> PROD_SENN2
    PROD_AUDIO --> PROD_SHURE1
    PROD_AUDIO --> PROD_SHURE2
    PROD_AUDIO --> PROD_WISYCOM
    
    PROD_MGMT --> PROD_MONITOR
    PROD_MGMT --> PROD_BACKUP
    
    UPS --> PROD_WS
    UPS --> PROD_CORE
    UPS --> BACKUP_WS
    GENERATOR --> UPS
    COOLING --> PROD_SENN1
    COOLING --> PROD_SHURE1
    SECURITY --> PROD_WS
    
    style PROD_WS fill:#ffcdd2
    style PROD_CORE fill:#c8e6c9
    style UPS fill:#fff3e0
```

## 3. Topologie Réseau Détaillée

### Segmentation Réseau et VLANs

```mermaid
graph TB
    subgraph "Core Network Infrastructure"
        CORE_RTR[Core Router<br/>192.168.1.1]
        CORE_SW[Core Switch<br/>Layer Three]
        FIREWALL[Firewall<br/>Security Gateway]
    end
    
    subgraph "VLAN 100 - Audio Equipment"
        VLAN100[VLAN 100<br/>192.168.100.0/24]
        AUDIO_DHCP[DHCP Pool<br/>192.168.100.100-200]
        
        subgraph "Sennheiser Subnet"
            SENN_RANGE[192.168.100.10-49]
            SENN_mDNS[mDNS Service<br/>_sennheiser._tcp]
        end
        
        subgraph "Shure Subnet"
            SHURE_RANGE[192.168.100.50-89]
            SHURE_SLP[SLP Service<br/>239.255.254.253:8427]
        end
        
        subgraph "Generic Subnet"
            GENERIC_RANGE[192.168.100.90-99]
            GENERIC_UDP[UDP Discovery<br/>Port 55555]
        end
    end
    
    subgraph "VLAN 200 - Management"
        VLAN200[VLAN 200<br/>192.168.200.0/24]
        MGMT_DHCP[DHCP Pool<br/>192.168.200.100-150]
        
        subgraph "Workstations"
            WS_RANGE[192.168.200.10-49]
            ENGINEER_WS[Engineer: 192.168.200.10]
            BACKUP_WS[Backup: 192.168.200.11]
        end
        
        subgraph "Services"
            SRV_RANGE[192.168.200.50-99]
            NTP_SRV[NTP: 192.168.200.50]
            LOG_SRV[Logging: 192.168.200.51]
            MONITOR_SRV[Monitoring: 192.168.200.52]
        end
    end
    
    subgraph "VLAN 300 - Guest/Internet"
        VLAN300[VLAN 300<br/>192.168.300.0/24]
        GUEST_DHCP[DHCP Pool<br/>192.168.300.100-200]
        INTERNET_GW[Internet Gateway]
    end
    
    CORE_RTR --> FIREWALL
    FIREWALL --> CORE_SW
    CORE_SW --> VLAN100
    CORE_SW --> VLAN200
    CORE_SW --> VLAN300
    
    VLAN100 --> AUDIO_DHCP
    AUDIO_DHCP --> SENN_RANGE
    AUDIO_DHCP --> SHURE_RANGE
    AUDIO_DHCP --> GENERIC_RANGE
    
    VLAN200 --> MGMT_DHCP
    MGMT_DHCP --> WS_RANGE
    MGMT_DHCP --> SRV_RANGE
    
    VLAN300 --> GUEST_DHCP
    VLAN300 --> INTERNET_GW
    
    style VLAN100 fill:#e8f5e8
    style VLAN200 fill:#e3f2fd
    style VLAN300 fill:#fff3e0
```

## 4. Distribution des Composants Logiciels

### Mapping Composants/Machines

```mermaid
graph TB
    subgraph "Engineer Workstation - Windows 11"
        subgraph "RF.Go Application"
            UI_LAYER[Presentation Layer<br/>Blazor + MAUI]
            APP_LAYER[Application Layer<br/>ViewModels + Services]
            DOMAIN_LAYER[Domain Layer<br/>Business Logic + RF Algorithms]
            INFRA_LAYER[Infrastructure Layer<br/>Repositories + Network]
        end
        
        subgraph "Local Services"
            SQLITE_DB[(SQLite Database<br/>Local Storage)]
            LOG_FILES[Log Files<br/>Local Logging)]
            CONFIG_FILES[Configuration Files<br/>Settings)]
            CACHE_SRV[Cache Service<br/>Memory Cache)]
        end
        
        subgraph "Network Components"
            DISCOVERY_SRV[Discovery Service<br/>mDNS/SLP/UDP)]
            SYNC_SRV[Sync Service<br/>TCP Communication)]
            HTTP_CLIENT[HTTP Client<br/>API Communication)]
        end
    end
    
    subgraph "Network Infrastructure"
        SWITCH_MGMT[Managed Switch<br/>VLAN Support)]
        DHCP_SRV[DHCP Server<br/>IP Assignment)]
        DNS_SRV[DNS Server<br/>Name Resolution)]
        NTP_SRV_NET[NTP Server<br/>Time Sync)]
    end
    
    subgraph "RF Equipment Nodes"
        subgraph "Sennheiser Node"
            SENN_FW[Device Firmware<br/>Embedded Linux)]
            SENN_TCP[TCP Server<br/>Port 53212)]
            SENN_mDNS_SRV[mDNS Service<br/>_sennheiser._tcp)]
            SENN_WEB[Web Interface<br/>HTTP Server)]
        end
        
        subgraph "Shure Node"
            SHURE_FW[Device Firmware<br/>Real-time OS)]
            SHURE_TCP[TCP Server<br/>Port 2202)]
            SHURE_SLP_SRV[SLP Service<br/>239.255.254.253)]
            SHURE_WEB[Web Interface<br/>HTTPS Server)]
        end
    end
    
    subgraph "Cloud Services"
        LICENSE_API[License API<br/>HTTPS REST)]
        UPDATE_API[Update API<br/>HTTPS REST)]
        TELEMETRY_API[Telemetry API<br/>HTTPS REST)]
    end
    
    %% Connections
    UI_LAYER --> APP_LAYER
    APP_LAYER --> DOMAIN_LAYER
    APP_LAYER --> INFRA_LAYER
    INFRA_LAYER --> SQLITE_DB
    INFRA_LAYER --> LOG_FILES
    INFRA_LAYER --> CONFIG_FILES
    INFRA_LAYER --> CACHE_SRV
    
    DISCOVERY_SRV --> SWITCH_MGMT
    SYNC_SRV --> SWITCH_MGMT
    HTTP_CLIENT --> SWITCH_MGMT
    
    SWITCH_MGMT --> DHCP_SRV
    SWITCH_MGMT --> DNS_SRV
    SWITCH_MGMT --> NTP_SRV_NET
    
    DISCOVERY_SRV -.->|mDNS| SENN_mDNS_SRV
    DISCOVERY_SRV -.->|SLP| SHURE_SLP_SRV
    SYNC_SRV -.->|TCP| SENN_TCP
    SYNC_SRV -.->|TCP| SHURE_TCP
    
    HTTP_CLIENT -.->|HTTPS| LICENSE_API
    HTTP_CLIENT -.->|HTTPS| UPDATE_API
    HTTP_CLIENT -.->|HTTPS| TELEMETRY_API
    
    style UI_LAYER fill:#e3f2fd
    style SQLITE_DB fill:#c8e6c9
    style SENN_FW fill:#e8f5e8
    style LICENSE_API fill:#fff3e0
```

## 5. Contraintes et Exigences de Déploiement

### Exigences Système

| Composant | Exigence Minimale | Exigence Recommandée | Contraintes |
|-----------|-------------------|---------------------|-------------|
| **OS Client** | Windows 10 1903+ | Windows 11 22H2+ | .NET 8.0 Runtime |
| **RAM** | 4 GB | 8 GB | 16 GB pour >100 appareils |
| **Stockage** | 1 GB libre | 5 GB libre | SSD recommandé |
| **Réseau** | 100 Mbps | 1 Gbps | Multicast support |
| **Processeur** | x64 compatible | i5/Ryzen 5+ | AVX2 pour calculs RF |

### Configuration Réseau Requise

```mermaid
graph LR
    subgraph "Network Requirements"
        MULTICAST[Multicast Enabled<br/>IGMP v2-v3]
        BROADCAST[Broadcast Domain<br/>Layer Two connectivity]
        QOS[QoS Configuration<br/>Audio traffic priority]
        SECURITY[Security Policy<br/>Firewall rules]
    end
    
    subgraph "Port Requirements"
        TCP_PORTS[TCP Ports<br/>53212, 2202, 80, 443]
        UDP_PORTS[UDP Ports<br/>5353, 427, 55555]
        MULTICAST_ADDR[Multicast Addresses<br/>224.0.0.251, 239.255.254.253]
    end
    
    subgraph "Protocol Support"
        mDNS_PROTO[mDNS/Bonjour<br/>Service Discovery]
        SLP_PROTO[SLP Service<br/>Location Protocol]
        DHCP_PROTO[DHCP Client<br/>Dynamic IP]
        NTP_PROTO[NTP Client<br/>Time Synchronization]
    end
    
    MULTICAST --> TCP_PORTS
    BROADCAST --> UDP_PORTS
    QOS --> MULTICAST_ADDR
    SECURITY --> mDNS_PROTO
    
    style MULTICAST fill:#e8f5e8
    style TCP_PORTS fill:#e3f2fd
    style mDNS_PROTO fill:#fff3e0
```

## 6. Scalabilité et Performance

### Architecture Scalable

```mermaid
graph TB
    subgraph "Small Event (1-25 devices)"
        SMALL_WS[Single Workstation]
        SMALL_SW[Unmanaged Switch]
        SMALL_DEV[≤25 RF Devices]
    end
    
    subgraph "Medium Event (26-100 devices)"
        MEDIUM_WS[Primary Workstation]
        MEDIUM_BACKUP[Backup Workstation]
        MEDIUM_SW[Managed Switch + VLANs]
        MEDIUM_DEV[26-100 RF Devices]
        MEDIUM_MONITOR[Network Monitoring]
    end
    
    subgraph "Large Event (100 plus devices)"
        LARGE_WS[Primary Workstation]
        LARGE_BACKUP[Backup Workstation]
        LARGE_MOBILE[Mobile Tablets]
        LARGE_CORE[Core Switch]
        LARGE_DIST[Distribution Switches]
        LARGE_DEV[100 plus RF Devices]
        LARGE_MONITOR[Full Monitoring Suite]
        LARGE_REDUNDANCY[Redundant Infrastructure]
    end
    
    SMALL_WS --> SMALL_SW
    SMALL_SW --> SMALL_DEV
    
    MEDIUM_WS --> MEDIUM_SW
    MEDIUM_BACKUP --> MEDIUM_SW
    MEDIUM_SW --> MEDIUM_DEV
    MEDIUM_SW --> MEDIUM_MONITOR
    
    LARGE_WS --> LARGE_CORE
    LARGE_BACKUP --> LARGE_CORE
    LARGE_MOBILE --> LARGE_CORE
    LARGE_CORE --> LARGE_DIST
    LARGE_DIST --> LARGE_DEV
    LARGE_CORE --> LARGE_MONITOR
    LARGE_CORE --> LARGE_REDUNDANCY
    
    style SMALL_WS fill:#c8e6c9
    style MEDIUM_WS fill:#fff3e0
    style LARGE_WS fill:#ffcdd2
```

### Métriques de Performance

| Métrique | Small Event | Medium Event | Large Event |
|----------|-------------|--------------|-------------|
| **Devices Max** | 25 | 100 | 500 plus |
| **Discovery Time** | 10-30s | 30-60s | 60-120s |
| **Calculation Time** | 2s | 5s | 15s |
| **Sync Time** | 10s | 30s | 60s |
| **Memory Usage** | 1GB | 2GB | 4GB |
| **Network Bandwidth** | 10Mbps | 50Mbps | 200Mbps |

## 7. Sécurité et Monitoring

### Sécurité du Déploiement

```mermaid
graph TB
    subgraph "Security Layers"
        PERIMETER[Perimeter Security<br/>Firewall + IDS]
        NETWORK[Network Security<br/>VLANs + ACLs]
        APP[Application Security<br/>Authentication + Encryption]
        DATA[Data Security<br/>Encryption at Rest]
    end
    
    subgraph "Monitoring Components"
        NET_MON[Network Monitoring<br/>SNMP + Flow Analysis]
        APP_MON[Application Monitoring<br/>Logs + Metrics]
        SEC_MON[Security Monitoring<br/>SIEM + Alerts]
        PERF_MON[Performance Monitoring<br/>Resource Usage]
    end
    
    subgraph "Backup and Recovery"
        CONFIG_BACKUP[Configuration Backup<br/>Automated + Manual]
        DATA_BACKUP[Data Backup<br/>Database + Files]
        DISASTER_RECOVERY[Disaster Recovery<br/>Site Replication]
        ROLLBACK[Rollback Procedures<br/>Quick Recovery]
    end
    
    PERIMETER --> NETWORK
    NETWORK --> APP
    APP --> DATA
    
    NET_MON --> APP_MON
    APP_MON --> SEC_MON
    SEC_MON --> PERF_MON
    
    CONFIG_BACKUP --> DATA_BACKUP
    DATA_BACKUP --> DISASTER_RECOVERY
    DISASTER_RECOVERY --> ROLLBACK
    
    style PERIMETER fill:#ffcdd2
    style NET_MON fill:#e3f2fd
    style CONFIG_BACKUP fill:#c8e6c9
```

Cette architecture de déploiement garantit une infrastructure robuste, scalable et sécurisée pour RF.Go, adaptée aux exigences variables des événements de petite à grande envergure.
