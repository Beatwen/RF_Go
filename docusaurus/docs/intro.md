# Introduction

RF Go est une application professionnelle de gestion de fréquences audio, conçue pour simplifier et optimiser la gestion des systèmes audio sans fil. Cette documentation vous guidera à travers toutes les fonctionnalités et aspects techniques de l'application.

## Cas d'Utilisation Principaux

### Gestion d'Événements Live

RF Go est particulièrement adapté pour la gestion des systèmes audio sans fil lors d'événements live :

- **Concerts, Festivals, Conférences, Séminaires, Théâtre, Spectacles...**

## Fonctionnalités Principales

- **Gestion des Appareils** : Découverte et gestion des appareils audio sans fil (Sennheiser, Shure, etc.)
  - Détection automatique des appareils sur le réseau
  - Configuration centralisée pour des appareils de diverses marques
  - Surveillance de l'état des appareils

- **Gestion des Fréquences** : Analyse et allocation intelligente des fréquences
  - Suggestions de fréquences optimales
  - Possibilité de calculer en fonction des intermodulation de 3ème ordre, 5ème ordre et 7ème ordre. Mais aussi, les intermodulations générés entre 3 transmeteur pour le 3ème ordre.
  - Largeur de bande totalement paramètrable par type d'appareil importé
  - Filtrage par canaux TV et par filtre de l'utilisateur
  - Fréquences de secours pour une récupération rapide en cas d'interférence

- **Visualisation** : Interface graphique intuitive pour la visualisation des données

- **Système de Licence** : Gestion des licences gratuites et payantes

- **Authentification** : Système sécurisé d'authentification des utilisateurs
  - L'utilisateur est forcé de s'inscrire pour sa première connexion.
  - Les informations de l'utilisateurs sont stockées et si il est offline, il peut toujours utiliser l'application grâce à ce stockage.

## Architecture Technique

RF Go est développé en utilisant les technologies suivantes :

- **.NET MAUI** : Framework cross-platform pour l'interface utilisateur
- **Blazor** : Pour les composants web interactifs
- **SQLite** : Base de données locale
- **DNS/Bonjour** : Pour la découverte des appareils
- **UDP/TCP** : Pour la communication avec les appareils

## Public Cible

Cette documentation s'adresse à :

- **Développeurs** : Pour comprendre l'architecture et contribuer au projet
  - Développeurs .NET
  - Intégrateurs système
  - Développeurs d'API
  - Testeurs

- **Administrateurs** : Pour la configuration et le déploiement
  - Administrateurs système
  - Responsables IT
  - Gestionnaires de projet
  - Support technique

## Structure de la Documentation

La documentation est organisée en plusieurs sections :

1. **Architecture** : Vue d'ensemble de l'architecture technique
2. **Fonctionnalités** : Détails des fonctionnalités principales
3. **Protocoles** : Documentation des protocoles de communication
4. **API Interne** : Documentation de l'API interne
5. **Configuration** : Guide de configuration
6. **Développement** : Guide pour les développeurs

## Prérequis

Pour utiliser RF Go, vous aurez besoin de :

- Windows, macOS, ou une distribution Linux supportée
- .NET 8.0 ou supérieur
- Accès réseau pour la découverte des appareils
- Matériel audio sans fil compatible
- Connaissances de base en audio professionnel
