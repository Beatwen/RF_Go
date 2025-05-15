---
sidebar_position: 3
---

# Gestion des scans RF

RF Go permet l'importation, la visualisation et la gestion de données de scan RF provenant de divers analyseurs de spectre. Cette fonctionnalité est essentielle pour analyser l'environnement RF avant et pendant des événements afin d'identifier les fréquences disponibles et les interférences potentielles.

## Formats pris en charge

L'application prend en charge les formats de fichiers de scan suivants :

- **SDB2** : Format plus ancien utilisé par des appareils comme RF Explorer
- **SDB3** : Format plus récent utilisé par des appareils comme Shure (ULXD, SLXD, etc.)

## Architecture de la fonctionnalité

La fonctionnalité de gestion des scans est implémentée à travers plusieurs composants :

### Modèle de données

```csharp
public class ScanData
{
    [PrimaryKey, AutoIncrement]
    public int ID { get; set; }
    public string Name { get; set; }
    public string SourceFile { get; set; }
    public DateTime ImportDate { get; set; }
    public string FileType { get; set; } // sdb2, sdb3, etc.
    public string Notes { get; set; }
    
    // Stockage des fréquences et valeurs sous forme de chaînes JSON
    public string FrequenciesJson { get; set; }
    public string ValuesJson { get; set; }
    
    // Stockage des valeurs min/max pour un accès rapide
    public double MinFrequency { get; set; }
    public double MaxFrequency { get; set; }
    public double MinValue { get; set; }
    public double MaxValue { get; set; }
    public bool IsVisible { get; set; }
}
```

### Service d'importation et d'exportation

Le service `ScanImportExportService` gère le processus d'importation des fichiers de scan :

- Validation des fichiers (taille, format)
- Analyse des formats SDB2 (XML) et SDB3 (format binaire spécifique)
- Conversion des données en format unifié pour stockage dans la base de données
- Exportation des données de scan

### ViewModel pour la gestion des scans

La classe `ScansViewModel` fournit une interface entre l'UI et les modèles de données :

- Gestion CRUD des scans (Create, Read, Update, Delete)
- Gestion de la visibilité des scans (quels scans afficher sur le graphique)
- Conversion des données JSON en structures de données utilisables

### Intégration avec SciChart

L'affichage graphique des données de scan est géré via SciChart, une bibliothèque de visualisation haute performance :

- Interopérabilité JavaScript pour le rendu des graphiques
- Affichage de plusieurs scans simultanément avec différentes couleurs
- Mise à jour en temps réel lors des changements de visibilité des scans

## Interface utilisateur

L'interface utilisateur de gestion des scans se compose de :

1. **Liste des scans** : Affiche tous les scans importés avec possibilité de :
   - Basculer la visibilité de chaque scan
   - Supprimer un scan
   - Voir les détails d'un scan (date d'importation, plage de fréquences, etc.)

2. **Contrôles d'importation/exportation** : Boutons pour importer de nouveaux scans ou exporter des scans existants

3. **Visualisation graphique** : Affichage des scans sélectionnés sur un graphique SciChart avec :
   - Axe X représentant les fréquences (en MHz ou KHz)
   - Axe Y représentant la puissance du signal (en dBm)

## Processus d'importation

Le processus d'importation d'un fichier de scan suit ces étapes :

1. L'utilisateur sélectionne un fichier SDB2 ou SDB3
2. Le système valide le fichier (taille, format)
3. Le service d'importation analyse le fichier selon son format :
   - SDB2 : analyse du XML pour extraire les fréquences et valeurs
   - SDB3 : décodage du format binaire propriétaire pour extraire les données
4. Les données sont converties en modèle `ScanData` et stockées dans la base de données SQLite
5. Le scan est immédiatement affiché dans la liste et sur le graphique

## Intégration avec les filtres TV

Les scans peuvent être visualisés en même temps que les filtres de canaux TV, permettant d'identifier rapidement :

- Les fréquences disponibles en dehors des canaux TV
- Les interférences potentielles avec des canaux TV en cours d'utilisation

Cette intégration facilite la prise de décision pour l'allocation des fréquences dans des environnements RF complexes.
