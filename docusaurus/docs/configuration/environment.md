# Configuration de l'Environnement

## Vue d'ensemble

Cette section documente les différentes configurations nécessaires pour le bon fonctionnement de RF Go, y compris les paramètres d'environnement, les configurations réseau et les paramètres système.

## Configuration de Base

### Fichier de Configuration

Le fichier `appsettings.json` contient les configurations de base de l'application :

```json
{
  "AppConfig": {
    "AppName": "RF Go",
    "Version": "1.0.0",
    "Environment": "Development",
    "LogLevel": "Information"
  },
  "NetworkConfig": {
    "DiscoveryPort": 5353,
    "DevicePort": 8080,
    "MulticastAddress": "224.0.0.251",
    "MulticastPort": 5353
  },
  "DatabaseConfig": {
    "ConnectionString": "Data Source=RF_Go.db3",
    "Provider": "SQLite",
    "Timeout": 30
  },
  "LicensingConfig": {
    "ApiEndpoint": "https://api.rf-go.com",
    "ValidationInterval": 3600,
    "CacheDuration": 86400
  }
}
```

## Configuration Réseau

### Paramètres de Découverte

| Paramètre | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| DiscoveryPort | Port pour la découverte des appareils | 5353 |
| DevicePort | Port pour la communication avec les appareils | 8080 |
| MulticastAddress | Adresse multicast pour la découverte | 224.0.0.251 |
| MulticastPort | Port multicast pour la découverte | 5353 |
| Timeout | Délai d'attente pour la découverte (ms) | 5000 |

### Configuration des Appareils

| Paramètre | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| RetryCount | Nombre de tentatives de connexion | 3 |
| RetryDelay | Délai entre les tentatives (ms) | 1000 |
| ConnectionTimeout | Délai d'attente de connexion (ms) | 5000 |

## Configuration de la Base de Données

### Paramètres SQLite

| Paramètre | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| ConnectionString | Chaîne de connexion à la base de données | Data Source=RF_Go.db3 |
| Provider | Fournisseur de base de données | SQLite |
| Timeout | Délai d'attente des requêtes (s) | 30 |
| CacheSize | Taille du cache (Mo) | 100 |

### Migration de la Base de Données

```csharp
public class DatabaseContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuration des modèles
    }
}
```

## Configuration des Licences

### Paramètres de Validation

| Paramètre | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| ApiEndpoint | Point de terminaison de l'API de licence | https://api.rf-go.com |
| ValidationInterval | Intervalle de validation (s) | 3600 |
| CacheDuration | Durée du cache (s) | 86400 |
| OfflineValidation | Validation hors ligne activée | true |

### Configuration du Cache

```csharp
public class LicenseCache
{
    public TimeSpan Duration { get; set; } = TimeSpan.FromHours(24);
    public int MaxSize { get; set; } = 1000;
    public string CachePath { get; set; } = "Cache/Licenses";
}
```

## Configuration du Logging

### Paramètres de Journalisation

| Paramètre | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| LogLevel | Niveau de journalisation | Information |
| LogPath | Chemin des fichiers de log | Logs/ |
| MaxFileSize | Taille maximale des fichiers (Mo) | 10 |
| RetentionDays | Jours de rétention | 30 |

### Configuration du Logger

```csharp
public static ILoggerFactory CreateLoggerFactory()
{
    return LoggerFactory.Create(builder =>
    {
        builder
            .SetMinimumLevel(LogLevel.Information)
            .AddConsole()
            .AddFile("Logs/rf-go-{Date}.log");
    });
}
```

## Configuration de la Sécurité

### Paramètres d'Authentification

| Paramètre | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| TokenExpiration | Durée de validité du token (h) | 24 |
| RefreshTokenExpiration | Durée de validité du refresh token (j) | 7 |
| PasswordMinLength | Longueur minimale du mot de passe | 8 |
| MaxLoginAttempts | Tentatives de connexion maximales | 5 |

### Configuration du JWT

```csharp
public class JwtConfig
{
    public string SecretKey { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public int ExpirationHours { get; set; } = 24;
}
```

## Configuration des Performances

### Paramètres de Cache

| Paramètre | Description | Valeur par défaut |
|-----------|-------------|-------------------|
| MemoryCacheSize | Taille du cache mémoire (Mo) | 100 |
| DiskCacheSize | Taille du cache disque (Mo) | 1000 |
| CacheExpiration | Durée d'expiration du cache (min) | 60 |

### Configuration du Cache

```csharp
public class CacheConfig
{
    public int MemoryCacheSize { get; set; } = 100;
    public int DiskCacheSize { get; set; } = 1000;
    public int CacheExpiration { get; set; } = 60;
}
```

## Bonnes Pratiques

1. **Sécurité**
   - Ne pas stocker les secrets en clair
   - Utiliser des variables d'environnement
   - Chiffrer les données sensibles

2. **Maintenance**
   - Documenter les changements de configuration
   - Tester les configurations
   - Sauvegarder les configurations

3. **Performance**
   - Optimiser les paramètres de cache
   - Ajuster les timeouts
   - Surveiller les ressources

4. **Dépannage**
   - Activer les logs détaillés
   - Vérifier les configurations réseau
   - Tester la connectivité 