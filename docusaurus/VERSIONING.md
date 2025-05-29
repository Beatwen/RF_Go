# Guide de Versionnage pour RF_Go

Ce document décrit le processus de versionnage et de release pour le projet RF_Go.

## Semantic Versioning

Le projet utilise [Semantic Versioning 2.0.0](https://semver.org/), avec une structure MAJOR.MINOR.PATCH:

- **MAJOR**: Changements incompatibles avec les versions précédentes
- **MINOR**: Ajouts de fonctionnalités rétrocompatibles
- **PATCH**: Corrections de bugs rétrocompatibles

## Processus de Release

### 1. Préparation

1. Mettre à jour `RF_Go/Utils/Version.cs` avec le nouveau numéro de version et la date
2. Mettre à jour le `CHANGELOG.md` avec les nouveautés, changements et corrections
3. Créer un fichier de documentation dans `docs/releases/vX.Y.Z.md`
4. Créez un tag et une release GitHub

### 2. Création de la Release GitHub

1. Créer une nouvelle tag Git correspondant à la version:

   ```
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push origin vX.Y.Z
   ```

2. Sur GitHub, créer une nouvelle release à partir de cette tag:
   - Titre: `RF_Go vX.Y.Z`
   - Description: Copier les entrées pertinentes depuis le CHANGELOG
   - Joindre les fichiers d'installation/binaires

### 3. Post-Release

1. Mettre à jour la version dans le code pour indiquer le développement de la prochaine version
2. Ajouter une section "Unreleased" dans le CHANGELOG

## Nomenclature des Branches

- `master`: Code de production stable
- `develop`: Développement en cours
- `feature/xxx`: Nouvelles fonctionnalités
- `bugfix/xxx`: Corrections de bugs
- `release/X.Y.Z`: Préparation d'une release

## Workflow Git Recommandé

1. Développer les fonctionnalités sur des branches `feature/xxx`
2. Fusionner ces branches dans `develop` via Pull Request
3. Créer une branche `release/X.Y.Z` à partir de `develop`
4. Tester et finaliser la release sur cette branche
5. Fusionner la branche de release dans `main` et `develop`
6. Créer la tag et la release GitHub
