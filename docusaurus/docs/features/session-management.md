# Session Management

## Database Import & Export

RF Go offre une fonctionnalité puissante permettant d'exporter et d'importer les données de session, ce qui facilite la sauvegarde, le partage et la restauration des configurations entre différents appareils ou utilisateurs.

### Vue d'ensemble

Le service `DatabaseImportExportService` permet de:

- **Exporter** toutes les données de la session courante dans un fichier JSON
- **Importer** des données précédemment exportées à partir d'un fichier JSON
- Préserver les relations entre entités lors de l'importation (comme les relations entre appareils et groupes)

### Données exportées

Le fichier d'exportation JSON contient les données suivantes:

- **Groupes** : Tous les groupes configurés et leurs périodes
- **Appareils** : Tous les appareils configurés, leurs canaux et fréquences
- **Canaux d'exclusion** : Filtres de fréquence définis par l'utilisateur
- **Données de fréquence** : Calculs d'intermodulation et allocations de fréquence
- **Date d'exportation** : Horodatage de l'export

### Utilisation

#### Exporter une session

1. Dans l'interface principale, cliquez sur l'icône d'export (↑) dans la barre d'outils
2. Confirmez l'action dans la boîte de dialogue
3. Choisissez l'emplacement de sauvegarde du fichier "RF_Go_Export.json"
4. Une notification confirme que l'exportation a réussi

#### Importer une session

1. Dans l'interface principale, cliquez sur l'icône d'import (↓) dans la barre d'outils
2. Confirmez l'action dans la boîte de dialogue (cette action remplacera toutes les données actuelles)
3. Sélectionnez le fichier JSON précédemment exporté
4. L'application importe les données et les affiche dans l'interface
5. Une notification confirme que l'importation a réussi

### Aspects techniques

#### Architecture

Le service d'import/export utilise:

- **JSON** pour la sérialisation/désérialisation des données
- **Mappage d'ID** pour préserver les relations entre entités (notamment entre appareils et groupes)
- **CommunityToolkit.Maui.Storage** pour la gestion des fichiers

#### Préservation des relations

Lors de l'importation, le service:

1. Crée de nouveaux ID pour les groupes importés
2. Maintient un mappage entre les anciens et nouveaux ID de groupe
3. Met à jour les références aux groupes dans les appareils importés

```csharp
// Dictionary to map old group IDs to new group IDs
var groupIdMapping = new Dictionary<int, int>();

foreach (var group in importData.Groups)
{
    var oldId = group.ID;
    group.ID = 0; 
    await _dbContext.AddItemAsync(group);
    
    // Get the new ID and store the mapping
    var newGroup = await _dbContext.GetAllAsync<RFGroup>();
    var insertedGroup = newGroup.FirstOrDefault(g => g.Name == group.Name);
    if (insertedGroup != null)
    {
        groupIdMapping[oldId] = insertedGroup.ID;
    }
}

// Update device references to groups
foreach (var device in importData.Devices)
{
    if (device.GroupID > 0 && groupIdMapping.ContainsKey(device.GroupID))
    {
        device.GroupID = groupIdMapping[device.GroupID];
    }
    await _dbContext.AddItemAsync(device);
}
```

### Cas d'utilisation

La fonctionnalité d'import/export est particulièrement utile dans les scénarios suivants:

- **Sauvegarde de sécurité** : Créer des snapshots de la configuration avant des modifications importantes
- **Partage de configuration** : Partager une configuration optimisée entre plusieurs techniciens
- **Configuration préalable** : Préparer des configurations en amont d'un événement
- **Modèles de projet** : Créer des configurations types pour différents types d'événements
- **Migration** : Transférer une configuration d'un appareil à un autre

### Limitations connues

- Les données exportées ne contiennent pas les scans de fréquence
- Les appareils synchronisés devront être resynchronisés après l'importation
- Les données importées écrasent complètement les données existantes
