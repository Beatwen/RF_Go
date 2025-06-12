# Visualisation des fréquences

## Visualisation par étapes de calcul

RF Go offre une fonctionnalité avancée de visualisation des fréquences qui permet d'afficher simultanément les fréquences de plusieurs **étapes de calcul temporel** sur un même graphique, facilitant ainsi l'analyse des interférences selon les superpositions temporelles réelles.

### Vue d'ensemble

Le système de visualisation des fréquences permet de:

- **Visualiser les étapes de calcul** par superposition temporelle (ex: "AC/DC & Katie Melua")
- **Différencier visuellement** les étapes par couleur
- **Filtrer l'affichage** par étape de calcul
- **Afficher/masquer** les différents types d'intermodulation par étape
- **Visualiser des boxes** représentant la largeur de bande occupée autour de chaque fréquence
- **Comprendre intuitivement** quels groupes sont calculés ensemble

### Architecture

La visualisation repose sur:

- **SciChart.js** pour le rendu graphique haute performance
- Un système d'interopérabilité JavaScript-C# via le `JSRuntime`
- Un stockage des données de fréquence par **étape de calcul** dans une structure de dictionnaire
- **Noms d'étapes dynamiques** générés selon les superpositions temporelles

### Implémentation technique

#### Structure des données par étapes

Les données de fréquence sont organisées par étape de calcul pour refléter les véritables combinaisons temporelles:

```csharp
// Structure des données par étape de calcul
var calculationStepData = new Dictionary<string, FrequencyData>();

// Pour chaque étape de calcul, on maintient des ensembles distincts
var stepData = new FrequencyData
{
    UsedFrequencies = new HashSet<int>(),
    TwoTX3rdOrder = new HashSet<int>(),
    TwoTX5rdOrder = new HashSet<int>(),
    TwoTX7rdOrder = new HashSet<int>(),
    TwoTX9rdOrder = new HashSet<int>(),
    ThreeTX3rdOrder = new HashSet<int>(),
    Color = stepColor,
    StepName = "AC/DC & Katie Melua" // Généré dynamiquement
};
```

#### Calcul par étapes temporelles

Le nouveau système génère automatiquement les étapes de calcul selon les superpositions temporelles réelles:

```csharp
// Construire le plan de calcul par étapes
var groupCalculationPlan = BuildGroupCalculationPlan();

foreach (var calculationStep in groupCalculationPlan)
{
    // Initialiser les données pour cette étape
    var groupData = new FrequencyData();
    
    // Calculer les fréquences pour les appareils de cette étape
    var devicesInGroups = GetDevicesForGroupSet(calculationStep.GroupsToCalculate);
    
    // Traiter les fréquences avec les bonnes intermodulations
    foreach (RFDevice device in devicesInGroups)
    {
        foreach (RFChannel chan in device.Channels)
        {
            chan.SetRandomFrequency(
                groupData.UsedFrequencies,
                groupData.TwoTX3rdOrder,
                groupData.TwoTX5rdOrder,
                groupData.TwoTX7rdOrder,
                groupData.TwoTX9rdOrder,
                groupData.ThreeTX3rdOrder,
                excludedRanges);
        }
    }
    
    // Générer le nom d'étape dynamique
    var stepName = CreateCalculationStepName(calculationStep);
    // Résultat: "AC/DC & Katie Melua" ou "Bruce Springsteen"
    
    // Stocker les données avec couleur unique par étape
    calculationStepData[stepName] = groupData;
}

// Convertir pour affichage SciChart avec noms corrects
FrequencyDataViewModel.FrequencyData.GroupData = ConvertCalculationStepDataToGroupData(calculationStepData);
```

### Interface de visualisation

L'interface de visualisation offre:

- **Légende explicite** : Affiche "AC/DC & Katie Melua" au lieu de groupes séparés
- **Filtrage par étape** pour afficher/masquer une combinaison temporelle spécifique
- **Affichage différencié** des intermodulations par couleur et par étape
- **Boxes de fréquence** montrant la largeur de bande par étape
- **Interactivité** (zoom, pan, etc.)

#### Interaction JavaScript

L'interactivité est gérée côté client via JavaScript avec support des noms d'étapes:

```javascript
// Gestion des noms d'étapes dynamiques
setGroupNames: function(stepNamesData) {
    this.chartState.groupNames = stepNamesData || {};
},

// Obtenir le nom d'une étape de calcul
getGroupName: function(stepId) {
    return this.chartState.groupNames[stepId] || `Étape ${stepId}`;
},

// Afficher/masquer les annotations d'une étape
toggleGroupAnnotations: function(stepId, isVisible) {
    // Mettre à jour l'état de visibilité pour cette étape
    this.chartState.annotationVisibility[stepId] = isVisible;
    
    // Régénérer toutes les annotations
    this.rebuildAllAnnotations();
}
```

### Utilisation

La visualisation des fréquences est accessible:

1. Après avoir configuré des groupes avec **périodes temporelles**
2. Lancer le calcul RF via le bouton "RF Calcul"
3. Le système génère automatiquement les **étapes de calcul par superpositions**
4. Le graphique affiche chaque étape avec son nom explicite
5. La légende permet de filtrer par étape de calcul temporel

### Exemples de visualisation

#### Scénario 1: Groupes séquentiels
```
Groupe A: 14:00-15:00 (pas de superposition)
Groupe B: 16:00-17:00 (pas de superposition)

Résultat SciChart:
- "Groupe A" (couleur 1)
- "Groupe B" (couleur 2)
```

#### Scénario 2: Superpositions temporelles

```
AC/DC:           18:00 ████████████ 19:00
Katie Melua:          18:40 ████████████████████ 20:00
Bruce Springsteen:              19:35 ████████████████ 20:55

Résultat SciChart:
- "AC/DC & Katie Melua" (couleur 1) - Intermod combinées
- "Katie Melua & Bruce Springsteen" (couleur 2) - Intermod combinées
```

#### Scénario 3: Configuration complexe

```
Groupe 1: 14:00-16:00
Groupe 2: 15:00-17:00  (chevauche avec 1 et 3)
Groupe 3: 16:30-18:00

Résultat SciChart:
- "Groupe 1 & Groupe 2" (couleur 1)
- "Groupe 2 & Groupe 3" (couleur 2)
```

### Avantages

Cette approche par étapes de calcul offre plusieurs avantages:

- **Représentation fidèle** : Les étapes visualisées correspondent aux calculs réels
- **Compréhension intuitive** : Voir immédiatement quels groupes sont calculés ensemble
- **Intermodulations correctes** : Chaque étape affiche ses vraies intermodulations
- **Optimisation visible** : Comprendre comment le système optimise le spectre
- **Débogage facilité** : Identifier rapidement les problèmes de superposition

### Évolutions futures

Des améliorations potentielles incluent:

- **Timeline interactive** : Visualiser les étapes dans le temps
- **Optimisation des transitions** : Minimiser les changements entre étapes
- **Export par étape** : Sauvegarder chaque plan de fréquences séparément
- **Analyse prédictive** : Prévoir les conflits avant le calcul
- **Templates temporels** : Réutiliser des configurations d'événements

Cette nouvelle approche révolutionnaire transforme la visualisation RF en un outil qui **comprend et représente fidèlement** la réalité temporelle des événements.
