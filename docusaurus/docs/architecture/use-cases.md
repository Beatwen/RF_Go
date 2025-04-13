# Use Cases

## 1. Découverte et Synchronisation des Appareils

```mermaid
sequenceDiagram
    participant UI as Interface Utilisateur
    participant VM as DevicesViewModel
    participant DS as DiscoveryService
    participant DH as DeviceHandler
    participant DM as DeviceMappingService
    participant DB as Database

    UI->>VM: Démarrer la découverte
    VM->>DS: StartDiscovery()
    DS->>DS: Démarrer mDNS/Bonjour
    DS->>DS: TriggerSennheiserDiscovery()
    
    loop Pour chaque appareil découvert
        DS->>DH: HandleDevice(deviceInfo)
        DH->>DH: Récupérer informations détaillées
        DH-->>DS: DeviceDiscoveredEventArgs
        DS->>VM: Mettre à jour la liste des appareils découverts
    end

    UI->>VM: Sélectionner un appareil à synchroniser
    VM->>DM: CastDeviceDiscoveredToRFDevice(deviceInfo)
    DM->>DM: Créer RFDevice avec les informations
    DM->>DB: Sauvegarder l'appareil
    DB-->>DM: Confirmation
    DM-->>VM: RFDevice créé
    VM->>UI: Mettre à jour l'interface

    loop Synchronisation périodique
        DS->>DH: IsDevicePendingSync(deviceInfo)
        DH->>DH: Vérifier l'état de l'appareil
        DH-->>DS: (IsEqual, IsNotResponding)
        DS->>VM: Mettre à jour l'état de synchronisation
        VM->>UI: Mettre à jour l'interface
    end
```

## 2. Calcul des Fréquences RF

```mermaid
sequenceDiagram
    participant UI as Interface Utilisateur
    participant VM as DevicesViewModel
    participant FD as FrequencyData
    participant RC as RFChannel
    participant EC as ExclusionChannel

    UI->>VM: Démarrer le calcul RF
    VM->>VM: Trouver les groupes qui se chevauchent
    VM->>EC: GetExcludedRanges()

    loop Pour chaque groupe
        FD->>FD: Réinitialiser les données de fréquences
        VM->>VM: GetDevicesForGroupSet(groupSet)

        loop Pour chaque appareil (fréquences verrouillées)
            loop Pour chaque canal
                RC->>RC: SetRandomFrequency()
                RC->>RC: CheckFreeFrequency()
                RC->>RC: CalculAllIntermod()
                RC-->>FD: Mettre à jour les fréquences utilisées
            end
        end

        loop Pour chaque appareil (fréquences non verrouillées)
            loop Pour chaque canal
                RC->>RC: SetRandomFrequency()
                RC->>RC: CheckFreeFrequency()
                RC->>RC: CalculAllIntermod()
                RC-->>FD: Mettre à jour les fréquences utilisées
            end
        end

        VM->>VM: Sauvegarder les appareils
        VM->>UI: Mettre à jour l'interface
    end
```

## 3. Visualisation des Données

```mermaid
sequenceDiagram
    participant UI as Interface Utilisateur
    participant VM as VisualizationViewModel
    participant DS as DataService
    participant DB as Database

    UI->>VM: Charger la visualisation
    VM->>DS: Récupérer les données
    DS->>DB: Requête des données
    DB-->>DS: Données
    DS-->>VM: Données formatées
    VM->>VM: Préparer les visualisations
    VM->>UI: Afficher les graphiques

    loop Mise à jour en temps réel
        DS->>DS: Surveiller les changements
        DS->>VM: Notifier les changements
        VM->>VM: Mettre à jour les visualisations
        VM->>UI: Rafraîchir l'affichage
    end
```

## 4. Gestion des Licences

```mermaid
sequenceDiagram
    participant UI as Interface Utilisateur
    participant VM as LicenseViewModel
    participant LS as LicenseService
    participant VS as ValidationService
    participant DB as Database

    UI->>VM: Activer une licence
    VM->>LS: Valider la licence
    LS->>VS: Vérifier la validité
    VS-->>LS: Résultat de validation
    alt Licence valide
        LS->>DB: Sauvegarder la licence
        DB-->>LS: Confirmation
        LS-->>VM: Licence activée
        VM->>UI: Mettre à jour l'interface
    else Licence invalide
        LS-->>VM: Erreur
        VM->>UI: Afficher l'erreur
    end

    loop Vérification périodique
        LS->>VS: Vérifier l'état des licences
        VS-->>LS: État des licences
        LS->>VM: Mettre à jour l'état
        VM->>UI: Mettre à jour l'interface
    end
```

## 5. Authentification et Gestion des Utilisateurs

```mermaid
sequenceDiagram
    participant UI as Interface Utilisateur
    participant VM as AuthViewModel
    participant AS as AuthService
    participant SS as StorageService
    participant DB as Database

    UI->>VM: Première connexion
    VM->>AS: Inscription requise
    AS->>AS: Générer identifiants
    AS->>DB: Sauvegarder utilisateur
    DB-->>AS: Confirmation
    AS->>SS: Stocker localement
    SS-->>AS: Confirmation
    AS-->>VM: Utilisateur créé
    VM->>UI: Redirection vers l'application

    loop Connexion ultérieure
        UI->>VM: Connexion
        VM->>AS: Vérifier les identifiants
        alt En ligne
            AS->>DB: Vérifier les identifiants
            DB-->>AS: Validation
        else Hors ligne
            AS->>SS: Vérifier le stockage local
            SS-->>AS: Validation
        end
        AS-->>VM: Résultat
        VM->>UI: Mettre à jour l'interface
    end
```

## 6. Gestion de l'Inventaire

```mermaid
sequenceDiagram
    participant UI as Interface Utilisateur
    participant VM as InventoryViewModel
    participant IS as InventoryService
    participant DS as DeviceService
    participant DB as Database

    UI->>VM: Ajouter un appareil
    VM->>IS: Créer l'entrée
    IS->>DS: Récupérer les informations
    DS-->>IS: Données de l'appareil
    IS->>DB: Sauvegarder l'inventaire
    DB-->>IS: Confirmation
    IS-->>VM: Appareil ajouté
    VM->>UI: Mettre à jour l'interface

    loop Gestion des données
        IS->>IS: Synchroniser les données
        IS->>DB: Mettre à jour l'inventaire
        DB-->>IS: Confirmation
        IS->>VM: Notifier les changements
        VM->>UI: Rafraîchir l'affichage
    end
```

## Détails des Use Cases

### Découverte et Synchronisation

Ce use case décrit le processus de découverte des appareils sur le réseau et leur synchronisation avec l'application :

1. **Découverte des Appareils**
   - L'utilisateur démarre la découverte depuis l'interface
   - Le DiscoveryService utilise mDNS/Bonjour pour détecter les appareils
   - Les DeviceHandlers spécifiques récupèrent les informations détaillées
   - Les appareils découverts sont affichés dans l'interface

2. **Synchronisation**
   - L'utilisateur sélectionne un appareil à synchroniser
   - Le DeviceMappingService convertit les informations en RFDevice
   - L'appareil est sauvegardé dans la base de données
   - Une synchronisation périodique vérifie l'état des appareils

3. **Gestion de l'État**
   - Les appareils peuvent être en ligne/hors ligne
   - L'état de synchronisation est maintenu
   - Les mises à jour sont reflétées dans l'interface

### Calcul des Fréquences

Ce use case décrit le processus complexe de calcul des fréquences RF pour éviter les interférences :

1. **Préparation**
   - Identification des groupes d'appareils qui se chevauchent
   - Récupération des plages de fréquences exclues
   - Réinitialisation des données de fréquences

2. **Calcul des Fréquences**
   - Traitement des fréquences verrouillées en premier
   - Vérification des espacements et intermodulations
   - Calcul des fréquences disponibles
   - Mise à jour des données de fréquences

3. **Gestion des Intermodulations**
   - Calcul des intermodulations d'ordre 3, 5, 7, 9
   - Gestion des intermodulations à 3 émetteurs
   - Vérification des espacements entre fréquences

4. **Sauvegarde et Mise à Jour**
   - Sauvegarde des appareils avec leurs nouvelles fréquences
   - Mise à jour de l'interface utilisateur
   - Affichage des résultats du calcul

### Visualisation des Données

Ce use case décrit la gestion de l'interface graphique et la visualisation des données :

1. **Affichage des Données**
   - Chargement des données depuis la base
   - Formatage pour la visualisation
   - Mise à jour en temps réel
   - Gestion des différents types de visualisations

2. **Interactivité**
   - Filtrage des données
   - Zoom et navigation
   - Export des visualisations
   - Personnalisation de l'affichage

### Gestion des Licences

Ce use case décrit le système de gestion des licences :

1. **Activation des Licences**
   - Validation des clés de licence
   - Activation en ligne/hors ligne
   - Gestion des fonctionnalités
   - Vérification périodique

2. **Types de Licences**
   - Licences gratuites
   - Licences payantes
   - Licences d'essai
   - Licences d'entreprise

### Authentification et Gestion des Utilisateurs

Ce use case décrit le système d'authentification :

1. **Inscription**
   - Création du compte
   - Stockage sécurisé
   - Validation des données
   - Configuration initiale

2. **Connexion**
   - Authentification en ligne
   - Mode hors ligne
   - Gestion des sessions
   - Sécurité des données

### Gestion de l'Inventaire

Ce use case décrit la gestion des appareils dans l'inventaire :

1. **Ajout d'Appareils**
   - Saisie des informations
   - Validation des données
   - Association aux groupes
   - Stockage des configurations

2. **Gestion des Données**
   - Synchronisation
   - Mise à jour des informations
   - Historique des modifications
   - Export des données
