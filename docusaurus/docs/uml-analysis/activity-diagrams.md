# Diagrammes d'Activités - Processus et Algorithmes

Les diagrammes d'activités de RF.Go modélisent les **processus métier complexes** et les **algorithmes RF avancés** qui constituent le cœur technique de l'application. Cette section détaille les workflows critiques depuis l'initialisation du système jusqu'aux calculs d'optimisation spectrale.

## 1. Processus Global de Gestion RF

### Vue d'Ensemble du Workflow Principal

```mermaid
graph TD
    A[Démarrage Application] --> B{Session Existante ?}
    B -->|Oui| C[Charger Session]
    B -->|Non| D[Nouvelle Session]
    C --> E[Authentification Utilisateur]
    D --> E
    E --> F{Licence Valide ?}
    F -->|Non| G[Activation Licence]
    F -->|Oui| H[Initialisation Services]
    G --> H
    H --> I[Discovery Réseau]
    I --> J[Import/Détection Appareils]
    J --> K[Configuration Appareils]
    K --> L[Paramétrage RF]
    L --> M[Calcul Plan Fréquences]
    M --> N{Plan Valide ?}
    N -->|Non| O[Ajustements Manuels]
    N -->|Oui| P[Synchronisation Appareils]
    O --> M
    P --> Q[Monitoring Temps Réel]
    Q --> R{Modifications ?}
    R -->|Oui| S[Recalcul Partiel]
    R -->|Non| Q
    S --> Q
    Q --> T[Sauvegarde Session]
    T --> U[Export Configurations]

    style A fill:#e3f2fd
    style M fill:#fff3e0
    style P fill:#e8f5e8
    style Q fill:#fce4ec
```

## 2. Algorithme de Calcul des Fréquences RF

### Processus Central d'Optimisation Spectrale

```mermaid
graph TD
    subgraph "Initialisation"
        A1[Récupérer Appareils Actifs] --> A2[Charger Exclusions TV]
        A2 --> A3[Initialiser FrequencyData]
        A3 --> A4[Grouper par TimePeriods]
    end

    subgraph "Calcul par Groupe"
        B1[Sélectionner Groupe] --> B2{Appareils Verrouillés ?}
        B2 -->|Oui| B3[Traiter Fréquences Verrouillées]
        B2 -->|Non| B4[Génération Aléatoire]
        B3 --> B5[Calculer Intermodulations]
        B4 --> B6[Vérifier Disponibilité]
        B6 --> B7{Fréquence Libre ?}
        B7 -->|Non| B8[Nouvelle Tentative]
        B7 -->|Oui| B5
        B8 --> B9{Max Tentatives ?}
        B9 -->|Non| B4
        B9 -->|Oui| B10[Marquer Conflit]
        B5 --> B11[Mettre à jour FrequencyData]
        B10 --> B11
    end

    subgraph "Validation et Optimisation"
        C1[Analyser Conflits] --> C2{Conflits Détectés ?}
        C2 -->|Oui| C3[Optimisation Locale]
        C2 -->|Non| C4[Validation Globale]
        C3 --> C5[Réallocation Intelligente]
        C5 --> C1
        C4 --> C6[Génération Fréquences Backup]
        C6 --> C7[Finalisation Plan]
    end

    A4 --> B1
    B11 --> C1
    C7 --> D[Plan Optimisé]

    style B5 fill:#ffecb3
    style C3 fill:#ffcdd2
    style C7 fill:#c8e6c9
```

### Détail de l'Algorithme d'Intermodulation

```mermaid
graph TD
    subgraph "Calcul Intermodulations"
        IM1[Fréquence Source F1] --> IM2[Calculer 2Tx 3rd Order]
        IM2 --> IM3[2×F1 ± F2 pour chaque F2]
        IM3 --> IM4[Calculer 2Tx 5th Order]
        IM4 --> IM5[3×F1 ± 2×F2 pour chaque F2]
        IM5 --> IM6[Calculer 2Tx 7th Order]
        IM6 --> IM7[4×F1 ± 3×F2 pour chaque F2]
        IM7 --> IM8[Calculer 3Tx 3rd Order]
        IM8 --> IM9[F1 ± F2 ± F3 pour chaque combinaison]
        IM9 --> IM10[Ajouter à FrequencyData.Exclusions]
    end

    subgraph "Vérification Conflits"
        VF1[Nouvelle Fréquence F_new] --> VF2{F_new ∈ UsedFrequencies ?}
        VF2 -->|Oui| VF3[CONFLIT: Fréquence déjà utilisée]
        VF2 -->|Non| VF4{F_new ∈ Intermodulations ?}
        VF4 -->|Oui| VF5[CONFLIT: Intermodulation détectée]
        VF4 -->|Non| VF6{F_new ∈ TVExclusions ?}
        VF6 -->|Oui| VF7[CONFLIT: Canal TV exclu]
        VF6 -->|Non| VF8[LIBRE: Fréquence disponible]
    end

    IM10 --> VF1
    VF3 --> R[Rejeter Fréquence]
    VF5 --> R
    VF7 --> R
    VF8 --> A[Accepter Fréquence]

    style IM3 fill:#e1f5fe
    style IM5 fill:#e1f5fe
    style IM7 fill:#e1f5fe
    style IM9 fill:#fff3e0
    style VF8 fill:#e8f5e8
    style R fill:#ffebee
```

## 3. Processus de Découverte Réseau Multi-Protocoles

### Orchestration des Handlers de Découverte

```mermaid
graph TD
    subgraph "Initialisation Discovery"
        D1[Démarrer DiscoveryService] --> D2[Initialiser Handlers]
        D2 --> D3[Handler Sennheiser mDNS]
        D2 --> D4[Handler Shure SLP]
        D2 --> D5[Handler Generic UDP]
    end

    subgraph "Discovery Parallèle"
        P1[Lancer mDNS Listener] --> P2[Écouter sur _sennheiser._tcp]
        P3[Lancer SLP Discovery] --> P4[Multicast sur 239.255.254.253:8427]
        P5[Lancer UDP Broadcast] --> P6[Scan plages IP définies]
    end

    subgraph "Agrégation Résultats"
        A1[Device Discovered Event] --> A2{Appareil Déjà Connu ?}
        A2 -->|Non| A3[Créer DeviceDiscoveredEventArgs]
        A2 -->|Oui| A4[Mettre à jour Informations]
        A3 --> A5[Fetch Détails Appareil]
        A4 --> A5
        A5 --> A6{Fetch Réussi ?}
        A6 -->|Oui| A7[Ajouter à DiscoveredDevices]
        A6 -->|Non| A8[Retry avec Timeout]
        A8 --> A9{Max Retries ?}
        A9 -->|Non| A5
        A9 -->|Oui| A10[Marquer Inaccessible]
    end

    subgraph "Synchronisation Périodique"
        S1[Timer 30s] --> S2[Pour chaque Appareil Découvert]
        S2 --> S3[Vérifier État Sync]
        S3 --> S4{PendingSync ?}
        S4 -->|Oui| S5[Déclencher Sync]
        S4 -->|Non| S6[Vérifier Connectivité]
        S5 --> S7[Mettre à jour Status]
        S6 --> S7
        S7 --> S1
    end

    D3 --> P1
    D4 --> P3
    D5 --> P5
    P2 --> A1
    P4 --> A1
    P6 --> A1
    A7 --> S1
    A10 --> S1

    style P1 fill:#e3f2fd
    style P3 fill:#e8f5e8
    style P5 fill:#fff3e0
    style A7 fill:#c8e6c9
```

## 4. Gestion des Sessions et Persistence

### Workflow de Sauvegarde/Chargement

```mermaid
graph TD
    subgraph "Sauvegarde Session"
        SV1[Trigger Save] --> SV2[Sérialiser RFDevices]
        SV2 --> SV3[Sérialiser RFGroups]
        SV3 --> SV4[Sérialiser ExclusionChannels]
        SV4 --> SV5[Sérialiser FrequencyData]
        SV5 --> SV6[Créer Session Entity]
        SV6 --> SV7[Transaction SQLite]
        SV7 --> SV8{Transaction OK ?}
        SV8 -->|Oui| SV9[Commit + Notification]
        SV8 -->|Non| SV10[Rollback + Erreur]
    end

    subgraph "Chargement Session"
        LD1[Sélectionner Session] --> LD2[Charger depuis SQLite]
        LD2 --> LD3{Session Valide ?}
        LD3 -->|Non| LD4[Erreur: Session Corrompue]
        LD3 -->|Oui| LD5[Désérialiser Entities]
        LD5 --> LD6[Reconstituer RFDevices]
        LD6 --> LD7[Reconstituer Relations]
        LD7 --> LD8[Valider Cohérence]
        LD8 --> LD9{Cohérence OK ?}
        LD9 -->|Non| LD10[Migration/Réparation]
        LD9 -->|Oui| LD11[Initialiser ViewModels]
        LD10 --> LD11
        LD11 --> LD12[Session Chargée]
    end

    subgraph "Auto-Save Intelligent"
        AS1[Détecter Modification] --> AS2[Debounce Timer 5s]
        AS2 --> AS3{Modifications Critiques ?}
        AS3 -->|Oui| AS4[Save Immédiat]
        AS3 -->|Non| AS5[Save Différé]
        AS4 --> AS6[Mettre à jour LastSaved]
        AS5 --> AS6
        AS6 --> AS7[Notification Status]
    end

    style SV7 fill:#fff3e0
    style LD8 fill:#e3f2fd
    style AS3 fill:#ffecb3
```

## 5. Synchronisation Bidirectionnelle des Appareils

### Processus Magic Sync

```mermaid
graph TD
    subgraph "Magic Sync To Device"
        MT1[Sélectionner Appareils] --> MT2[Valider Connectivité]
        MT2 --> MT3{Tous Connectés ?}
        MT3 -->|Non| MT4[Afficher Appareils Offline]
        MT3 -->|Oui| MT5[Pour chaque Appareil]
        MT5 --> MT6[Récupérer Handler Spécifique]
        MT6 --> MT7[Construire Commandes]
        MT7 --> MT8[Envoyer via TCP]
        MT8 --> MT9{ACK Reçu ?}
        MT9 -->|Oui| MT10[Marquer Synchronized]
        MT9 -->|Non| MT11[Retry avec Exponential Backoff]
        MT11 --> MT12{Max Retries ?}
        MT12 -->|Non| MT8
        MT12 -->|Oui| MT13[Marquer Failed]
        MT10 --> MT14[Suivant]
        MT13 --> MT14
        MT14 --> MT15{Tous Traités ?}
        MT15 -->|Non| MT5
        MT15 -->|Oui| MT16[Rapport Final]
    end

    subgraph "Magic Sync From Device"
        MF1[Détecter Changements] --> MF2[Pour chaque Appareil Modifié]
        MF2 --> MF3[Fetch État Actuel]
        MF3 --> MF4[Comparer avec Base Locale]
        MF4 --> MF5{Différences ?}
        MF5 -->|Oui| MF6[Proposer Synchronisation]
        MF5 -->|Non| MF7[Suivant]
        MF6 --> MF8{Accepter Sync ?}
        MF8 -->|Oui| MF9[Mettre à jour Base]
        MF8 -->|Non| MF10[Ignorer Changements]
        MF9 --> MF7
        MF10 --> MF7
        MF7 --> MF11{Tous Traités ?}
        MF11 -->|Non| MF2
        MF11 -->|Oui| MF12[Synchronisation Terminée]
    end

    style MT8 fill:#e3f2fd
    style MF4 fill:#fff3e0
    style MT16 fill:#c8e6c9
```

## 6. Gestion des Erreurs et Recovery

### Stratégies de Récupération

```mermaid
graph TD
    subgraph "Détection d'Erreurs"
        E1[Exception Levée] --> E2{Type Exception ?}
        E2 -->|NetworkException| E3[Erreur Réseau]
        E2 -->|DatabaseException| E4[Erreur BDD]
        E2 -->|ValidationException| E5[Erreur Validation]
        E2 -->|BusinessException| E6[Erreur Métier]
        E2 -->|UnknownException| E7[Erreur Inconnue]
    end

    subgraph "Recovery Network"
        E3 --> N1[Vérifier Connectivité]
        N1 --> N2{Réseau Disponible ?}
        N2 -->|Non| N3[Mode Offline]
        N2 -->|Oui| N4[Retry Connection]
        N4 --> N5{Reconnexion OK ?}
        N5 -->|Oui| N6[Reprendre Opération]
        N5 -->|Non| N7[Escalade Erreur]
    end

    subgraph "Recovery Database"
        E4 --> D1[Vérifier Intégrité BDD]
        D1 --> D2{BDD Corrompue ?}
        D2 -->|Oui| D3[Backup Recovery]
        D2 -->|Non| D4[Retry Transaction]
        D3 --> D5{Backup Disponible ?}
        D5 -->|Oui| D6[Restaurer Backup]
        D5 -->|Non| D7[Réinitialiser BDD]
        D6 --> D8[Migration si Nécessaire]
        D7 --> D8
    end

    subgraph "Logging et Monitoring"
        L1[Logger Exception] --> L2[Enrichir Contexte]
        L2 --> L3[Persister Log]
        L3 --> L4[Notifier Monitoring]
        L4 --> L5{Erreur Critique ?}
        L5 -->|Oui| L6[Alerte Immédiate]
        L5 -->|Non| L7[Log Standard]
    end

    E3 --> L1
    E4 --> L1
    E5 --> L1
    E6 --> L1
    E7 --> L1

    style E2 fill:#ffebee
    style N6 fill:#e8f5e8
    style D8 fill:#e3f2fd
```

## Métriques et Performance

### Indicateurs de Performance des Processus

| Processus | Temps Moyen | Complexité | Optimisations |
|-----------|-------------|------------|---------------|
| **Calcul RF Global** | 2-5 secondes | O(n²×m) | Parallelisation |
| **Discovery Réseau** | 10-30 secondes | O(n) | Cache DNS |
| **Sync Appareils** | 1-3 secondes | O(n) | Batch Operations |
| **Sauvegarde Session** | 100-500ms | O(n) | Transactions |
| **Chargement Session** | 200-800ms | O(n) | Lazy Loading |

Ces diagrammes d'activités détaillent les processus critiques de RF.Go et démontrent la complexité algorithmique nécessaire pour gérer efficacement les fréquences RF dans un environnement professionnel multi-marques. 