# Choix technologiques

## Vue d'ensemble

RF.Go est construit avec un stack technologique moderne privilégiant la **performance**, l'**offline capability** et la **cross-platform compatibility** pour répondre aux besoins spécifiques de la gestion RF professionnelle.

## Stack technologique retenu

### Plateforme applicative : .NET MAUI 8.0

**Contexte de décision** : Suite à un cours sur Blazor Server, besoin d'une application **multiplateforme** et **offline**.

**Décision finale** : .NET MAUI s'imposait comme une bonne solution répondant au **besoin offline absolu** tout en permettant le **développement multiplateforme**.

### Interface utilisateur : Blazor Hybrid

**Architecture** : Blazor Hybrid dans .NET MAUI

```csharp
// MauiProgram.cs
builder.Services.AddMauiBlazorWebView();

// MainPage.xaml
<BlazorWebView x:Name="blazorWebView" HostPage="wwwroot/index.html">
    <BlazorWebView.RootComponents>
        <RootComponent Selector="#app" ComponentType="{x:Type local:Main}" />
    </BlazorWebView.RootComponents>
</BlazorWebView>
```

**Avantages de Blazor Hybrid** :

- ✅ **Offline total** : App native avec UI web
- ✅ **Performance** : Pas de latence réseau
- ✅ **Réutilisation Blazor** : Acquis du cours directement applicables
- ✅ **Écosystème web** : MudBlazor, Chart.js, composants CSS
- ✅ **Développement rapide** : Une seule base de code UI

### Base de données : SQLite

**Décision** : SQLite avec sqlite-net-pcl
**Contrainte** : Doit fonctionner **totalement offline**

| Aspect | SQLite | Cloud DB | Justification |
|--------|--------|----------|---------------|
| **Offline capability** | ✅ Natif | ❌ Impossible | **Exigence absolue** |
| **Performance locale** | ✅ Excellente | ❌ Network dependent | Calculs RF temps réel |
| **Simplicité** | ✅ Fichier unique | ❌ Infrastructure | Déploiement simple |
| **Cross-platform** | ✅ Identique partout | ⚠️ Variable | Même comportement sur toutes plateformes |

**Implémentation** :

```csharp
// DatabaseContext.cs avec sqlite-net-pcl
public async Task<IEnumerable<TTable>> GetAllAsync<TTable>() where TTable : class, new()
{
    var table = GetTable<TTable>();
    return await table.ToListAsync();
}
```

### Networking : Protocols RF natifs

**Contexte** : Utilisation des protocols **imposés par les fabricants RF**, pas de choix d'alternatives.

| Fabricant | Protocol utilisé | Port | Justification |
|-----------|------------------|------|---------------|
| **Sennheiser G3/G4** | UDP + JSON | 45 | **Protocol propriétaire** Sennheiser |
| **Shure ULXD** | TCP + JSON-RPC | 2202 | **Protocol propriétaire** Shure |
| **Découverte** | mDNS | 5353 | **Standard industrie** obligatoire |

**Note** : Aucune "alternative" évaluée car les protocols sont **dictés par les devices RF**. L'application doit s'adapter aux specifications des fabricants.

```csharp
// Implémentation par fabricant
public interface IDeviceHandler
{
    Task<DeviceDiscoveredEventArgs> HandleDevice(IPAddress ip, string deviceName);
}

// SennheiserDeviceHandler : UDP Port 45
// ShureDeviceHandler : TCP Port 2202  
// Protocols non négociables
```

## Frameworks et bibliothèques

### MVVM : CommunityToolkit.Mvvm

```csharp
// Source generators pour réduire le boilerplate
[ObservableProperty]
private ObservableCollection<RFDevice> _devices = new();

[RelayCommand]
public async Task SaveDevice() => await _context.UpdateItemAsync(OperatingDevice);
```

**Avantages** :

- ✅ **Moins de code** : Source generators vs écriture manuelle
- ✅ **Performance** : Compile-time vs runtime reflection
- ✅ **Type safety** : Erreurs à la compilation

### JSON : System.Text.Json

**Usage intensif** pour sérialisation SQLite :

```csharp
// FrequencyData.cs - Performance critique pour calculs RF
public string UsedFrequenciesSerialized
{
    get => JsonSerializer.Serialize(UsedFrequencies);
    set => UsedFrequencies = JsonSerializer.Deserialize<HashSet<int>>(value);
}
```

**Justification** : Performance native .NET vs dépendances externes.

### UI Components : MudBlazor

```csharp
// MudTable pour affichage devices RF
<MudTable Items="@DevicesViewModel.Devices" Hover="true">
    <RowTemplate>
        <MudTd>@context.Brand @context.Model</MudTd>
        <MudTd>@context.Frequency MHz</MudTd>
    </RowTemplate>
</MudTable>
```

**Avantages** :

- ✅ **Composants RF-friendly** : Tables, formulaires, graphiques
- ✅ **Material Design** : Interface pro et simple
- ✅ **Blazor natif** : Pas de wrapper JavaScript

## Évolutions futures

### Roadmap technologique

**Version actuelle** :

- ✅ .NET MAUI 8.0 + Blazor Hybrid
- ✅ SQLite offline-first
- ✅ Support Sennheiser/Shure

**Évolutions envisagées** :

- 🔄 Support Wisycom, MiPro.. (nouveaux protocols)
- 🔄 .NET 9 upgrade (performance)
- 🔄 Export cloud optionnel (garde offline)

### Contraintes préservées

**Non-négociables** :

- ✅ **Offline-first** : Fonctionnement sans réseau
- ✅ **Cross-platform** : Windows/macOS/iOS/Android
- ✅ **Performance RF** : Calculs temps réel
- ✅ **Simplicité déploiement** : Executable autonome

Cette stack technologique répond parfaitement aux contraintes **offline absolues** et **multiplateforme** de RF.Go, tout en exploitant les acquis Blazor pour un développement efficace.
