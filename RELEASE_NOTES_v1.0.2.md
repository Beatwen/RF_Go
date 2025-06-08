# RF_Go v1.0.2 Release Notes

**Date de sortie :** 17 janvier 2025

## 🎉 Nouvelles fonctionnalités

### 📄 Export PDF
- **Génération complète de rapports PDF** des scans avec graphiques intégrés
- **Métadonnées enrichies** : informations de scan, paramètres, statistiques
- **Graphiques haute qualité** exportés directement depuis SciChart
- **Mise en page professionnelle** pour rapports techniques

### 🌍 Filtres TV Channels par pays
- **Configuration automatique** des canaux TV selon la réglementation locale
- **5 pays supportés** avec données officielles :
  - 🇫🇷 **France** : Canaux 21-69 (8MHz)
  - 🇧🇪 **Belgique** : National (27,29) / Hainaut (27) (8MHz)
  - 🇩🇪 **Allemagne** : 470-608, 614-698, 736-753 MHz (8MHz)
  - 🇳🇱 **Pays-Bas** : 470-604, 614-694, 736-753 MHz (8MHz)
  - 🇺🇸 **États-Unis** : 470-608, 614-616, 657-663 MHz (6MHz)

#### Interface utilisateur
- **Modal élégant** avec sélection pays/région
- **Icône roue crantée** ⚙️ dans l'en-tête du tableau
- **Sélection automatique** de région si unique
- **Affichage des canaux autorisés** avec descriptions réglementaires
- **Changement automatique** de division (6/7/8MHz) selon le pays

#### Logique métier
- **Application intelligente** : exclusion des canaux NON autorisés
- **Sauvegarde optimisée** : modification sélective uniquement
- **Données offline** : réglementations intégrées sans connexion requise

## 🚀 Améliorations

### Interface utilisateur
- **MudBlazor DialogService** pour modals système
- **Notifications de succès** lors de l'application des filtres
- **Validation en temps réel** des sélections

### Performance
- **Optimisation des sauvegardes** : changements uniquement si nécessaire
- **Gestion d'erreurs améliorée** : collection modifiée pendant itération
- **Chargement asynchrone** des données pays

### Documentation
- **UC-006 mis à jour** avec nouveaux scénarios
- **Diagrammes de séquence** enrichis
- **Contraintes techniques** documentées

## 🛠 Détails techniques

### Architecture
- **Composant CountrySelectionModal** : Interface de sélection géographique
- **CountryDataJson** : Données réglementaires JSON statiques
- **CountrySelectionResult** : Modèle de retour du modal

### Fichiers modifiés
- `Components/TVChannelsFilter.razor` : Intégration modal + logique
- `Modal/CountrySelectionModal.razor` : Nouveau composant modal
- `Shared/Countries.cs` : Données réglementaires par pays
- `Models/CountrySelectionResult.cs` : Modèle de données

### Base de données
- **Compatibilité maintenue** : pas de migration requise
- **Exclusions dynamiques** : mise à jour des canaux existants

## 📋 Notes de mise à jour

### Installation
- **Pas de migration requise** : installation directe sur v1.0.x
- **Données préservées** : tous les scans et configurations existants conservés

### Compatibilité
- **.NET 8.0** requis
- **MudBlazor 7.15+** pour les modals
- **Multiplateforme** : Windows, macOS, iOS, Android

### Prochaines versions
- **Refactoring backend** : migration vers serveur pour données pays
- **Géolocalisation GPS** : détection automatique du pays
- **Pays supplémentaires** : extension selon demandes utilisateurs

---

## 📞 Support

- **Documentation** : [UC-006 Gestion des filtres RF](docusaurus/docs/uml-analysis/use-cases/uc-006.md)
- **Issues** : GitHub Issues pour rapports de bugs
- **Fonctionnalités** : Suggestions via GitHub Discussions

**Bonne utilisation de RF_Go v1.0.2 ! 🎯** 