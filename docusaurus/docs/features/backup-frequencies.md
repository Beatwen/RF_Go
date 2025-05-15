# Backup Frequencies

## Introduction

La fonctionnalité de backup frequencies (fréquences de secours) permet aux utilisateurs de stocker et gérer des fréquences alternatives pour chaque type d'appareil RF. Ces fréquences peuvent être utilisées rapidement en cas d'interférence ou de problème avec les fréquences principales.

## Fonctionnalités Principales

- **Stockage de fréquences de secours** : Possibilité d'enregistrer plusieurs fréquences de secours pour chaque type d'appareil (définies par la marque, le modèle et la bande de fréquence)
- **Gestion via interface graphique** : Interface intuitive pour ajouter, supprimer et appliquer des fréquences de secours
- **Calcul automatique** : Les fréquences de secours sont calculées automatiquement lors de l'exécution du calcul RF pour éviter les interférences
- **Application facile** : Appliquer une fréquence de secours à un canal avec ou sans synchronisation immédiate avec l'appareil physique
- **Nettoyage automatique** : Les fréquences de secours sont supprimées automatiquement lorsque le dernier appareil d'un type est supprimé

## Architecture Technique

La fonctionnalité repose sur plusieurs composants clés :

### Modèle de Données

- **RFBackupFrequency** : 
  - Stocke les informations sur chaque fréquence de secours
  - Propriétés principales : Brand, Model, Frequency, ChannelIndex, BackupFrequency, MinRange, MaxRange, Step
  - Association avec le type d'appareil (Brand + Model + Frequency)

### ViewModel

- **BackupFrequenciesViewModel** :
  - Gère la logique métier pour les fréquences de secours
  - Charge, sauvegarde et supprime les fréquences de secours dans la base de données
  - Fournit des méthodes pour calculer de nouvelles fréquences de secours
  - Assure le nettoyage des fréquences lorsque des appareils sont supprimés

### Composants UI

- **BackupFrequencyModal** :
  - Affiche la liste des fréquences de secours pour un type d'appareil spécifique
  - Permet d'ajouter de nouvelles fréquences de secours
  - Permet d'appliquer une fréquence de secours à un canal (avec ou sans synchronisation)
  - Permet de supprimer des fréquences de secours

- **Buttons d'accès dans OfflineTab** :
  - Boutons d'accès à côté de chaque canal pour ouvrir la modale de gestion des fréquences de secours

## Intégration dans le Calcul RF

Lors du calcul RF global (fonction `RFCalcul` dans `OfflineTab`) :

1. Les fréquences principales sont d'abord calculées pour tous les appareils
2. Une passe supplémentaire est effectuée pour calculer les fréquences de secours
3. Ces fréquences sont stockées dans la base de données
4. Elles sont affichées en rouge sur le graphique de fréquences pour une identification facile

## Nettoyage des Fréquences de Secours

Le nettoyage des fréquences de secours se fait de deux manières :

1. **Suppression globale** : Lorsque toutes les appareils sont supprimés (méthode `DeleteAll`), toutes les fréquences de secours sont également supprimées
2. **Suppression sélective** : Lorsqu'un appareil spécifique est supprimé, le système vérifie s'il s'agit du dernier appareil de ce type (même Brand, Model, Frequency) et, si c'est le cas, supprime toutes les fréquences de secours associées

## Utilisation

Pour utiliser les fréquences de secours :

1. Configurez le nombre de fréquences de secours lors de l'ajout d'un nouvel appareil
2. Après le calcul RF, cliquez sur l'icône de sauvegarde à côté d'un canal pour accéder aux fréquences de secours
3. Dans la fenêtre modale, vous pouvez :
   - Voir toutes les fréquences de secours disponibles
   - Ajouter de nouvelles fréquences de secours
   - Appliquer une fréquence de secours au canal actuel
   - Appliquer et synchroniser immédiatement avec l'appareil physique
   - Supprimer des fréquences de secours inutilisées 