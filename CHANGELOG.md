# Changelog

Toutes les versions notables de **Mes Pensées** sont documentées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).
Le projet suit [Semantic Versioning](https://semver.org/lang/fr/) :
`MAJEUR.MINEUR.CORRECTIF`.

- **MAJEUR** : changement qui casse un usage existant (ex. nouveau PIN obligatoire, format de stockage incompatible).
- **MINEUR** : nouvelle fonctionnalité compatible.
- **CORRECTIF** : bug, perf, sécurité sans changer le contrat utilisateur.

La page publique : [mespensees.vercel.app/changelog](https://mespensees.vercel.app/changelog).

## [Unreleased] — 2.0.0

Pas de rupture prévue. Voir P1/P2 dans `docs/10-proposition-v2.md`.

### Added

- Kit de marque (wordmark, icône Play Store) (prévu).

### Changed

- Parcours verrouillage → journal plus clair, motion plus court (prévu).

## [1.0.1] — 2026-08-28

Correctif store / confiance. Pas de changement de contrat utilisateur.

### Added

- Politique de confidentialité et conditions d’utilisation dans l’app (menu + Coffre).
- Page publique `/terms` (URL Play Store).

### Changed

- Copy coffre : « chiffrement local » à la place d’un discours « militaire ».
- Privacy : Nominatim (OpenStreetMap) si un lieu est associé à une note.
- Build Android `versionCode` 2 / `versionName` 1.0.1 ; signature release via `android/keystore.properties` si présent.

## [1.0.0] — 2026-08-28

Première version publique Android (APK debug via GitHub Releases).

### Added

- Éditeur : texte, images, audio, dictée, humeurs, lieu optionnel, modèles.
- Timeline, recherche, statistiques, capsules temporelles, corbeille 30 jours.
- Coffre, export TXT/PDF, partage d’image anonymisé.
- PIN haché PBKDF2, biométrie, mode leurre, auto-destruction, intrusion, récupération par mots-clés.
- Notifications intelligentes (messages génériques), tutoriel contextuel.
- Widgets Android : Inspiration, Série, Raccourcis (aucun contenu de note).
- Site vitrine Next.js (`website/`).

### Security

- Chiffrement AES local, rotation de clé au changement de PIN.
- Wipe AsyncStorage + fichiers médias.
- Widgets sans titre ni texte de note.

### Fixed

- Suppression depuis la Timeline.
- Fuites du mode leurre.
- Contrôles biométrie / leurre non câblés.
- Rétrospective « il y a un an » factice.

[Unreleased]: https://github.com/creedemmanuel7-sketch/journal-pensees/compare/v0.1.0...HEAD
[1.0.1]: https://github.com/creedemmanuel7-sketch/journal-pensees/compare/v0.1.0...HEAD
[1.0.0]: https://github.com/creedemmanuel7-sketch/journal-pensees/releases/tag/v0.1.0
