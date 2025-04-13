# Guide de Configuration

## Vue d'ensemble

Ce guide détaille les différentes options de configuration disponibles dans RF Go, ainsi que les bonnes pratiques pour configurer l'application selon vos besoins.

## Configuration de Base

### Fichier de Configuration

Le fichier principal de configuration est `appsettings.json` :

```json
{
  "AppSettings": {
    "Name": "RF Go",
    "Version": "1.0.0",
    "Environment": "Development"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=RF_Go.db3"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "Network": {
    "Discovery": {
      "Enabled": true,
      "Interval": 30,
      "Timeout": 5000
    },
    "Communication": {
      "Port": 8080,
      "Timeout": 3000
    }
  }
}
```

### Configuration du Réseau

#### Paramètres de Découverte

```json
{
  "Network": {
    "Discovery": {
      "Enabled": true,
      "Interval": 30,
      "Timeout": 5000,
      "Protocols": ["mDNS", "UDP"],
      "MulticastAddress": "224.0.0.251",
      "MulticastPort": 5353
    }
  }
}
```

#### Paramètres de Communication

```json
{
  "Network": {
    "Communication": {
      "Port": 8080,
      "Timeout": 3000,
      "RetryCount": 3,
      "RetryDelay": 1000,
      "BufferSize": 8192
    }
  }
}
```

### Configuration de la Base de Données

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=RF_Go.db3;Password=your_password;",
    "BackupConnection": "Data Source=backup.db3"
  },
  "Database": {
    "Provider": "SQLite",
    "Migrations": true,
    "SeedData": true,
    "Backup": {
      "Enabled": true,
      "Interval": 24,
      "Retention": 7
    }
  }
}
```

## Configuration des Appareils

### Sennheiser

```json
{
  "Devices": {
    "Sennheiser": {
      "Protocol": "REST",
      "Port": 8080,
      "Timeout": 3000,
      "Authentication": {
        "Type": "Basic",
        "Username": "admin",
        "Password": "password"
      },
      "Features": {
        "FrequencyControl": true,
        "PowerControl": true,
        "SquelchControl": true
      }
    }
  }
}
```

### Shure

```json
{
  "Devices": {
    "Shure": {
      "Protocol": "TCP",
      "Port": 2202,
      "Timeout": 3000,
      "Authentication": {
        "Type": "None"
      },
      "Features": {
        "FrequencyControl": true,
        "PowerControl": true,
        "SquelchControl": true
      }
    }
  }
}
```

## Configuration de la Sécurité

### Authentification

```json
{
  "Security": {
    "Authentication": {
      "Jwt": {
        "Key": "your-secret-key",
        "Issuer": "rfgo.com",
        "Audience": "rfgo.com",
        "Expiration": 3600
      },
      "RefreshToken": {
        "Expiration": 86400
      }
    }
  }
}
```

### Autorisations

```json
{
  "Security": {
    "Authorization": {
      "Roles": {
        "Admin": ["*"],
        "User": ["read", "write"],
        "Guest": ["read"]
      },
      "Policies": {
        "DeviceManagement": ["Admin", "User"],
        "FrequencyManagement": ["Admin", "User"],
        "SystemConfiguration": ["Admin"]
      }
    }
  }
}
```

## Configuration des Licences

```json
{
  "Licensing": {
    "Validation": {
      "Online": true,
      "Interval": 24,
      "GracePeriod": 7
    },
    "Features": {
      "Free": ["discovery", "basic_control"],
      "Pro": ["discovery", "advanced_control", "analysis", "reports"]
    }
  }
}
```

## Configuration du Logging

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "System": "Warning"
    },
    "File": {
      "Path": "logs/rfgo.log",
      "MaxSize": 10485760,
      "MaxFiles": 10
    },
    "Database": {
      "Enabled": true,
      "Retention": 30
    }
  }
}
```

## Configuration de l'Interface Utilisateur

```json
{
  "UI": {
    "Theme": "default",
    "Language": "fr",
    "RefreshInterval": 5,
    "Notifications": {
      "Enabled": true,
      "Sound": true,
      "Popup": true
    },
    "Charts": {
      "UpdateInterval": 1,
      "HistoryLength": 60
    }
  }
}
```

## Configuration du Cache

```json
{
  "Cache": {
    "Memory": {
      "Enabled": true,
      "SizeLimit": 104857600,
      "Expiration": 300
    },
    "Disk": {
      "Enabled": true,
      "Path": "cache",
      "SizeLimit": 1073741824,
      "Expiration": 86400
    }
  }
}
```

## Bonnes Pratiques

### Sécurité

1. Ne jamais stocker de mots de passe en clair
2. Utiliser des variables d'environnement pour les secrets
3. Limiter les accès réseau aux ports nécessaires
4. Mettre à jour régulièrement les certificats

### Performance

1. Optimiser les intervalles de mise à jour
2. Configurer le cache selon les besoins
3. Ajuster les timeouts selon le réseau
4. Limiter la taille des logs

### Maintenance

1. Sauvegarder régulièrement la configuration
2. Documenter les changements
3. Tester les modifications en environnement de test
4. Garder une trace des versions

## Dépannage

### Problèmes Courants

1. **Appareils non détectés**
   - Vérifier les paramètres réseau
   - Confirmer que le multicast est activé
   - Vérifier les logs de découverte

2. **Erreurs de connexion**
   - Vérifier les paramètres de communication
   - Confirmer que les ports sont ouverts
   - Vérifier les certificats

3. **Problèmes de performance**
   - Ajuster les intervalles de mise à jour
   - Optimiser la configuration du cache
   - Vérifier les ressources système

### Support

- Documentation en ligne
- Forum communautaire
- Support technique
- Base de connaissances 