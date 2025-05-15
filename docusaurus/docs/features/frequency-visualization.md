# Visualisation des Fréquences

## Visualisation Multi-Groupes

RF Go offre une fonctionnalité avancée de visualisation des fréquences qui permet d'afficher simultanément les fréquences de plusieurs groupes sur un même graphique, facilitant ainsi l'analyse des interférences potentielles.

### Vue d'ensemble

Le système de visualisation des fréquences permet de:

- **Visualiser les fréquences** de plusieurs groupes simultanément
- **Différencier visuellement** les groupes par couleur
- **Filtrer l'affichage** par groupe
- **Afficher/masquer** les différents types d'intermodulation
- **Visualiser des boxes** représentant la largeur de bande occupée autour de chaque fréquence

### Architecture

La visualisation repose sur:

- **SciChart.js** pour le rendu graphique haute performance
- Un système d'interopérabilité JavaScript-C# via le `JSRuntime`
- Un stockage des données de fréquence par groupe dans une structure de dictionnaire

### Implémentation Technique

#### Structure des données

Les données de fréquence sont organisées par groupe pour éviter que les données d'un groupe n'écrasent celles d'un autre:

```csharp
// Structure des données par groupe
var groupFrequencyData = new Dictionary<int, FrequencyData>();

// Pour chaque groupe, on maintient des ensembles distincts
var groupData = new FrequencyData
{
    UsedFrequencies = new HashSet<int>(),
    TwoTX3rdOrder = new HashSet<int>(),
    TwoTX5rdOrder = new HashSet<int>(),
    TwoTX7rdOrder = new HashSet<int>(),
    TwoTX9rdOrder = new HashSet<int>(),
    ThreeTX3rdOrder = new HashSet<int>()
};
```

#### Calcul séparé par groupe

Pour éviter les interférences entre groupes, le calcul des fréquences est réalisé séparément pour chaque ensemble de groupes qui se chevauchent temporellement:

```csharp
// Identifier les groupes qui se chevauchent dans le temps
var overlappingGroups = FindOverlappingGroups();

// Pour chaque ensemble de groupes qui se chevauchent
foreach (var groupSet in overlappingGroups)
{
    // Initialiser les données pour ce groupe
    var groupData = new FrequencyData {...};
    
    // Calculer les fréquences pour les appareils de ces groupes
    var devicesInGroup = GetDevicesForGroupSet(groupSet);
    
    // Traiter les fréquences verrouillées puis les non-verrouillées
    foreach (RFDevice device in devicesInGroup)
    {
        foreach (RFChannel chan in device.Channels)
        {
            chan.SetRandomFrequency(groupData.UsedFrequencies, /* autres ensembles */);
        }
    }
    
    // Stocker les données pour chaque groupe
    foreach (var group in groupSet)
    {
        groupFrequencyData[group.ID] = groupData;
    }
}

// Combiner toutes les données des groupes
FrequencyDataViewModel.FrequencyData.GroupData = groupFrequencyData;
```

### Interface de visualisation

L'interface de visualisation offre:

- **Légende interactive** permettant d'activer/désactiver des éléments
- **Filtrage par groupe** pour afficher/masquer un groupe spécifique
- **Affichage différencié** des intermodulations par couleur
- **Boxes de fréquence** montrant la largeur de bande
- **Interactivité** (zoom, pan, etc.)

#### Interaction JavaScript

L'interactivité est gérée côté client via JavaScript:

```javascript
// Exemple de code pour afficher/masquer les annotations d'un groupe
toggleGroupAnnotations: function(groupId, isVisible) {
    // Mettre à jour l'état de visibilité
    this.chartState.annotationVisibility[groupId] = isVisible;
    
    // Récupérer les modules nécessaires
    const surface = this.chartState.sciChartSurface;
    
    // Régénérer toutes les annotations
    this.rebuildAllAnnotations();
}
```

### Utilisation

La visualisation des fréquences est accessible:

1. Après avoir effectué un calcul RF via le bouton "RF Calcul"
2. Le graphique s'affiche en bas de l'écran sur les appareils desktop/tablet
3. La légende permet de filtrer l'affichage par groupe et par type d'élément
4. Le graphique permet le zoom et le déplacement pour une analyse détaillée

### Avantages

Cette approche par groupe offre plusieurs avantages:

- **Isolation des données** : Les fréquences d'un groupe n'interfèrent pas avec celles d'un autre
- **Analyse ciblée** : Possibilité d'examiner les interférences dans un groupe spécifique
- **Flexibilité visuelle** : Contrôle précis de ce qui est affiché
- **Performance** : Possibilité de désactiver certains groupes pour alléger le rendu

### Évolutions futures

Des améliorations potentielles incluent:

- Export du graphique en image
- Annotations personnalisées par l'utilisateur
- Statistiques avancées par groupe
- Détection automatique des zones problématiques
- Suggestions d'optimisation des fréquences entre groupes
