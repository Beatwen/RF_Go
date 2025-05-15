# Gestion des Appareils

RF Go offre une solution complète de gestion des appareils audio sans fil, permettant aux utilisateurs de découvrir, configurer et surveiller leurs équipements de diverses marques à partir d'une interface centrale.

## Fonctionnalités Principales

- **Découverte automatique** : Détection des appareils sur le réseau via divers protocoles (mDNS, UDP multicast)
- **Configuration centralisée** : Interface unifiée pour gérer des appareils de différentes marques
- **Synchronisation bidirectionnelle** : Synchronisation des paramètres entre l'application et les appareils physiques
- **Gestion des canaux** : Configuration individuelle des canaux pour chaque appareil
- **Support multi-marques** : Compatibilité avec Sennheiser (EWDX-EM2, G4 IEM), Shure et autres fabricants majeurs
- **Gestion de fréquences** : Allocation et synchronisation des fréquences optimales
- **Fréquences de secours** : Stockage et application de [fréquences alternatives](./backup-frequencies.md) en cas d'interférence
- **Mécanismes de découverte spécialisés** : Prise en charge de protocoles propriétaires pour les appareils utilisant des communications non standard

## Architecture Technique

Le système de gestion des appareils est construit sur une architecture modulaire :

- **Service de découverte unifié** : Composant central qui coordonne plusieurs méthodes de découverte
- **Adaptateurs spécifiques par fabricant** : Modules dédiés pour chaque marque et modèle d'appareil
- **Protocoles de communication adaptés** : Implémentation de protocoles standards et propriétaires
- **Gestionnaires de périphériques** : Convertisseurs entre protocoles spécifiques et modèle de données unifié
- **Service de synchronisation** : Vérification périodique de la synchronisation entre l'application et les appareils

## Appareils pris en charge

### Sennheiser

#### EWDX-EM2

- Utilise le protocole standard mDNS/Bonjour avec service `_ewd._http.local`
- Communication via HTTP/REST APIs
- Configuration complète des paramètres de fréquence, nom et mode

#### Sennheiser G4 IEM

- Utilise un protocole propriétaire basé sur UDP multicast
- Découverte via port 8133 sur l'adresse multicast 224.0.0.251
- Communication bidirectionnelle via port 53212
- Configuration des fréquences, noms de canaux, modes et paramètres de sensibilité

### Shure

- Support pour les modèles AD4D, PSM1000 et UR4D
- Découverte via mDNS avec service `_ssc._udp.local`
- Configuration complète des paramètres via protocole propriétaire

## Interface Utilisateur

L'interface utilisateur pour la gestion des appareils comprend :

- **Vue d'inventaire** : Liste de tous les appareils configurés
- **Panneau de contrôle** : Interface détaillée pour la configuration des appareils
- **Indicateurs d'état** : Visualisation en temps réel de l'état de connexion et de synchronisation des appareils
- **Outils de synchronisation** : Options pour synchroniser les paramètres avec les appareils
- **Gestion des bandes de fréquence** : Identification automatique des bandes de fréquence en fonction des plages supportées

## Système de Découverte des Appareils

Le système de découverte est conçu pour être extensible et prendre en charge différents protocoles :

- **Service de découverte principal** : Coordonne les différentes méthodes de détection
- **Découverte mDNS** : Pour les appareils standard utilisant Bonjour
- **Découverte UDP multicast** : Pour les protocoles propriétaires comme Sennheiser G4
- **Gestion des événements** : Notification des nouveaux appareils détectés
- **Vérification périodique** : Surveillance de l'état de connexion des appareils

Le processus complet est documenté dans la section [Protocoles de Découverte](/docs/protocols/dns-discovery.md).
