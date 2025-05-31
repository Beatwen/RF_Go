# Vue d'ensemble

## Diagrammes de cas d'utilisation - Analyse fonctionnelle

Les diagrammes de cas d'utilisation de RF.Go modélisent les **interactions fonctionnelles** entre les différents acteurs et le système. Cette analyse détaille les scénarios nominaux, alternatifs et exceptionnels qui constituent la base fonctionnelle de l'application.

## 1. Vue d'ensemble des acteurs

### Acteurs principaux

```mermaid
graph TB
    subgraph "Acteurs Humains"
        IE[Ingénieur du Son]
        TE[Technicien Événementiel]
        RE[Responsable Équipement]
        SU[Support Technique]
    end
    
    subgraph "Acteurs Système"
        AP[Appareils RF]
        LS[Serveur Licences]
        BD[Base de Données]
        RS[Réseau/Internet]
    end
    
    subgraph "Acteurs Externes"
        CL[Client Événementiel]
        AU[Autorité Réglementaire]
        FO[Fournisseur Équipement]
    end
    
    IE --> RF.Go
    TE --> RF.Go
    RE --> RF.Go
    SU --> RF.Go
    
    RF.Go --> AP
    RF.Go --> LS
    RF.Go --> BD
    RF.Go --> RS
    
    style IE fill:#e3f2fd
    style RF.Go fill:#fff3e0
    style AP fill:#e8f5e8
```

### Rôles et responsabilités

| Acteur | Responsabilités Principales | Niveau d'Expertise |
|--------|----------------------------|-------------------|
| **Ingénieur du Son** | Configuration RF, Optimisation, Monitoring | Expert |
| **Technicien Événementiel** | Déploiement, Setup, Maintenance | Intermédiaire |
| **Responsable Équipement** | Gestion Parc, Planification, Budget | Gestionnaire |
| **Support Technique** | Assistance, Troubleshooting, Formation | Expert Système |

## 2. Cas d'utilisation principaux

### Gestion des appareils RF

```mermaid
graph LR
    subgraph "Gestion Appareils"
        UC1[UC-001: Découverte Appareils]
        UC3[UC-003: Import Machines]
        UC4[UC-004: Magic Sync]
        UC2[UC-002: Calcul Plan RF]
    end
    
    subgraph "Gestion Fréquences"
        UC5[UC-005: Gestion Groupes]
        UC6[UC-006: Gestion Filtres]
        UC7[UC-007: Gestion Temporelle]
    end
    
    subgraph "Gestion Sessions"
        UC10[UC-010: Sauvegarde Session]
        UC11[UC-011: Chargement Session]
        UC12[UC-012: Export Plan Fréquence]
    end
    
    Ingénieur --> UC1
    Ingénieur --> UC3
    Ingénieur --> UC4
    Ingénieur --> UC2
    Ingénieur --> UC5
    Ingénieur --> UC6
    Ingénieur --> UC7
    Ingénieur --> UC10
    Ingénieur --> UC11
    Ingénieur --> UC12
    UC12 --> |«communicate»|ActeursExterne[Acteurs externe]

    UC3 -.->|«include»| UC1
    UC4 -.->|«include»| UC1
    UC4 -.->|«include»| UC3
    UC2 -.->|«extend»| UC12
    
    style UC1 fill:#e3f2fd
    style UC3 fill:#e8f5e8
    style UC4 fill:#fff3e0
    style UC2 fill:#ffecb3
    style UC12 fill:#e1f5fe
```

## 3. Navigation des Use Cases

### Use Cases de base

- **[UC-001: Découverte automatique des appareils](../uc-001)** - Détection réseau multi-protocole
- **[UC-002: Calcul du plan fréquences](../uc-002)** - Optimisation automatique RF  
- **[UC-003: Import des machines](../uc-003)** - Gestion inventaire et configuration
- **[UC-004: Magic sync - synchronisation bidirectionnelle](../uc-004)** - Synchronisation bidirectionnelle
- **[UC-008: Authentification et validation de licence](../uc-008)** - Création de compte, connexion et activation de licence

### Use Cases avancés

- **[UC-005: Gestion des groupes temporels](../uc-005)** - Planning multi-créneaux et optimisation temporelle
- **[UC-006: Gestion des filtres RF](../uc-006)** - Exclusions de canaux TV et contraintes personnalisées
- **[UC-007: Gestion temporelle avancée](../uc-007)** - Réutilisation intelligente des fréquences
- **[UC-010: Gestion des sessions RF](../uc-010)** - Sauvegarde, restauration et export/import

### Use Cases futurs (À développer)

- **UC-012: Export et reporting** - Communication externe et génération de rapports
