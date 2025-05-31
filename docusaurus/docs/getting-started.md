# Démarrage rapide

Cette section vous guidera à travers les premières étapes pour commencer à utiliser RF Go.

## Prérequis

### Système d'exploitation

- Windows 10 version 1903 ou supérieur
- macOS 10.15 (Catalina) ou supérieur
- Linux (Ubuntu 20.04 LTS ou supérieur)

### Environnement de développement

- .NET 8.0 SDK ou supérieur
- Visual Studio 2022 (17.0 ou supérieur) avec :
  - Charge de travail "Développement mobile avec .NET"
  - Extension MAUI
  - Extension Blazor
- SQLite 3.35.0 ou supérieur
- Git pour le contrôle de version

### Matériel recommandé

- Processeur : Intel Core i5 ou équivalent
- RAM : 8 Go minimum
- Espace disque : 10 Go minimum
- Carte réseau avec support multicast
- Adaptateur Wi-Fi 802.11ac ou supérieur

## Installation

### Installation du SDK .NET

1. Téléchargez le SDK .NET 8.0 depuis [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
2. Exécutez l'installateur
3. Vérifiez l'installation avec la commande :

   ```bash
   dotnet --version
   ```

### Installation de Visual Studio

1. Téléchargez Visual Studio 2022 depuis [visualstudio.com](https://visualstudio.microsoft.com/)
2. Sélectionnez les composants suivants :
   - Charge de travail "Développement mobile avec .NET"
   - Composants individuels :
     - .NET MAUI
     - Blazor
     - SQLite
     - Git

### Installation de RF Go

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/votre-org/RF_Go.git
   ```

2. Ouvrez la solution dans Visual Studio
3. Restaurez les packages NuGet :

   ```bash
   dotnet restore
   ```

4. Compilez la solution :

   ```bash
   dotnet build
   ```

## Configuration initiale

### Configuration du réseau

1. Vérifiez que le multicast est activé sur votre réseau
2. Configurez les paramètres réseau dans l'application :
   - Adresse IP
   - Masque de sous-réseau
   - Passerelle par défaut
   - DNS

### Configuration de la base de données

1. La base de données SQLite est créée automatiquement au premier lancement
2. Les migrations sont appliquées automatiquement
3. Les données de test sont chargées si nécessaire

### Configuration des appareils

1. Assurez-vous que vos appareils sont sur le même réseau
2. Activez le mode découverte sur les appareils
3. Lancez la découverte dans l'application

## Premiers pas

### Découverte des appareils

1. Ouvrez l'application
2. Accédez à la section "Appareils"
3. Cliquez sur "Découvrir"
4. Attendez que les appareils soient détectés
5. Les appareils apparaissent dans la liste

### Gestion des fréquences

1. Sélectionnez un appareil dans la liste
2. Accédez à l'onglet "Fréquences"
3. Analysez les fréquences disponibles
4. Assignez une fréquence à l'appareil

### Création de groupes

1. Accédez à la section "Groupes"
2. Cliquez sur "Nouveau Groupe"
3. Donnez un nom au groupe
4. Ajoutez des appareils au groupe
5. Configurez les paramètres du groupe

## Dépannage

### Problèmes courants

A COMPLETER

### Support

- Documentation en ligne : [docs.rfgo.com](https://docs.rfgo.com)
- Forum communautaire : [community.rfgo.com](https://community.rfgo.com)
- Support technique : christophe.bouserez@gmail.com
