# 🎭 Tests d'Intégration RF_Go - Playwright + NUnit

## 📖 Vue d'ensemble

Ce projet contient les **tests d'intégration end-to-end** pour l'application RF_Go. Ces tests simulent des **scenarios utilisateur complets** pour s'assurer que l'application fonctionne correctement du point de vue de l'utilisateur final.

## 🎯 Objectifs des Tests

- ✅ **Validation des workflows utilisateur complets**
- ✅ **Détection des régressions UI/UX**
- ✅ **Tests multi-navigateurs et responsifs**
- ✅ **Protection contre les bugs en production**

## 🧪 Types de Tests Inclus

### 1. **Tests d'Interface Utilisateur**
- Navigation générale de l'application
- Responsivité mobile/desktop
- Gestion des erreurs UI

### 2. **Tests de Workflows Métier**
- Ajout/modification de dispositifs RF
- Calcul automatique des fréquences
- Import/export de configurations

### 3. **Tests d'Intégration Hardware**
- Découverte automatique de dispositifs
- Synchronisation avec équipements réels
- Gestion des connexions réseau

## ⚙️ Configuration

### Prérequis
- .NET 8.0
- RF_Go application en cours d'exécution
- Navigateurs installés (Chrome, Firefox, Safari)

### Installation des navigateurs Playwright
```bash
# Depuis le répertoire Tests NUnit/
pwsh bin/Debug/net8.0/playwright.ps1 install
```

### Configuration de l'URL
Modifiez `TestConfiguration.cs` si RF_Go s'exécute sur un autre port :
```csharp
public const string BASE_URL = "http://localhost:VOTRE_PORT";
```

## 🚀 Exécution des Tests

### Via Visual Studio
1. Ouvrir **Test Explorer**
2. Sélectionner les tests à exécuter
3. Cliquer **Run**

### Via Ligne de Commande
```bash
# Tous les tests
dotnet test

# Tests spécifiques
dotnet test --filter "TestCategory=Integration"

# Avec rapport détaillé
dotnet test --logger "trx;LogFileName=test-results.trx"
```

### Via Test Explorer en mode Debug
- Permet de **déboguer** les tests
- Visualisation en **temps réel** du navigateur
- **Breakpoints** dans le code de test

## 📋 Scenarios de Test Couverts

| Test | Description | Criticité |
|------|-------------|-----------|
| `HomePage_ShouldDisplayCorrectTitle` | Chargement page d'accueil | 🔴 Critique |
| `AddNewDevice_CompleteWorkflow` | Ajout dispositif complet | 🔴 Critique |
| `CalculateFrequencies_WithMultipleDevices` | Calcul fréquences RF | 🔴 Critique |
| `DeviceDiscovery_SyncDevice` | Découverte & sync hardware | 🟡 Important |
| `ImportScan_ValidFile` | Import fichiers scan | 🟡 Important |
| `Navigation_AllMainSections` | Navigation générale | 🟢 Utile |
| `MobileView_Navigation` | Tests responsive | 🟢 Utile |

## 🛠️ Maintenance des Tests

### Ajout de Nouveaux Tests
1. Créer une nouvelle méthode dans `RFGoIntegrationTests`
2. Utiliser les `TestConfiguration.Selectors` pour la cohérence
3. Ajouter des données de test dans `TestConfiguration.TestData`

### Sélecteurs CSS Recommandés
Utilisez des `data-testid` dans RF_Go pour des tests stables :
```html
<!-- Dans RF_Go -->
<button data-testid="add-device-btn">Ajouter Dispositif</button>

<!-- Dans les tests -->
await Page.ClickAsync("[data-testid='add-device-btn']");
```

### Gestion des Délais d'Attente
```csharp
// Attendre un élément spécifique
await Page.WaitForSelectorAsync("[data-testid='results']");

// Attendre une condition
await Page.WaitForFunctionAsync("() => document.readyState === 'complete'");
```

## 📊 Rapports et Monitoring

### Screenshots Automatiques
Playwright capture automatiquement des **screenshots** lors des échecs :
- Sauvegardés dans `test-results/`
- Utiles pour diagnostiquer les problèmes

### Vidéos des Tests
Configuration pour enregistrer les tests :
```csharp
[SetUp]
public async Task Setup()
{
    // Enregistrement vidéo en cas d'échec
    await Context.Tracing.StartAsync(new() {
        Screenshots = true,
        Snapshots = true
    });
}
```

## 🎯 Bonnes Pratiques

### ✅ DO
- Utiliser des `data-testid` stables
- Tester les scenarios métier complets
- Vérifier les états d'erreur
- Maintenir les tests à jour

### ❌ DON'T
- Dépendre d'éléments qui changent souvent
- Créer des tests trop fragiles
- Ignorer les erreurs JavaScript
- Oublier les cas d'erreur

## 🔧 Dépannage

### Test qui échoue de façon intermittente
```csharp
// Ajouter des attentes explicites
await Expect(Page.Locator("[data-testid='element']")).ToBeVisibleAsync();

// Augmenter le timeout si nécessaire
await Page.WaitForSelectorAsync("[data-testid='slow-element']", 
    new() { Timeout = 10000 });
```

### Application non accessible
1. Vérifier que RF_Go est en cours d'exécution
2. Contrôler l'URL dans `TestConfiguration.BASE_URL`
3. Tester manuellement l'accès navigateur

## 📈 Métriques et KPI

Ces tests contribuent à :
- 📊 **Couverture fonctionnelle** : >80% des workflows utilisateur
- ⚡ **Détection précoce** : Bugs détectés avant production
- 🎯 **Qualité release** : Validation automatique avant déploiement
- 📱 **Compatibilité** : Tests multi-navigateurs et responsive

---

> **💡 Conseil pour les Jurys :** Ces tests démontrent une approche professionnelle du **Quality Assurance** et protègent contre les régressions lors des évolutions de RF_Go. 