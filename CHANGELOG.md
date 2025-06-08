# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] - 2025-01-17

### Added

- **Export PDF** : Génération de rapports PDF complets des scans avec graphiques et métadonnées
- **Filtres TV par pays** : Configuration automatique des canaux TV selon la réglementation locale
  - Support de 5 pays : France, Belgique, Allemagne, Pays-Bas, États-Unis
  - Modal de sélection pays/région avec icône roue crantée
  - Application automatique des exclusions selon les bandes autorisées
  - Changement automatique de division (6MHz/7MHz/8MHz) selon le pays
  - Données réglementaires intégrées offline (470-698 MHz + bandes supplémentaires)

### Improved

- Interface utilisateur enrichie avec modal MudBlazor pour sélection géographique
- Optimisation des sauvegardes (modification sélective des canaux)
- Documentation UC-006 mise à jour avec nouveaux cas d'usage

## [1.0.1] - 2024-12-15

### Added

- Améliorations mineures et corrections de bugs

## [1.0.0] - 2024-05-25

### Added

- Initial release of RF_Go
- Scan management functionality
- Import/Export capabilities

[Unreleased]: https://github.com/Beatwen/RF_Go/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/Beatwen/RF_Go/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Beatwen/RF_Go/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Beatwen/RF_Go/releases/tag/v1.0.0
