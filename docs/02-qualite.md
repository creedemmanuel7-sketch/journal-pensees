# Sphère 2 — Qualité

## Définition de « fini » (Definition of Done)

Une fonction n’est pas finie si :

- le bouton existe mais ne persiste rien ;
- elle fuit des données en mode leurre ;
- elle n’a pas d’état vide / erreur ;
- `npm test` casse ;
- elle n’est pas dans le [CHANGELOG](../CHANGELOG.md).

## Niveaux déjà en place

- Jest (crypto, wipe, dates, notifs intelligentes).
- ESLint + Prettier.
- Build Android debug.

## V2 — ce qu’il faut ajouter

| Niveau | Action |
|--------|--------|
| Tests | Écrans critiques : PIN, leurre, wipe (plus de tests unitaires purs). |
| Manuel | Checklist 15 min : créer note, lock, biométrie off, leurre, capsule, widget. |
| Perf | Timeline : virtualisation si > 200 notes (`FlashList` / `FlatList` window). |
| Accessibilité | Labels sur le FAB, le PIN, les switches du Coffre. |
| Release | Plus d’APK dans Git ; uniquement GitHub Releases + SemVer. |

## Dette connue (ne pas oublier)

- Mentions « cryptage militaire » à retirer du Coffre (discours faux).
- Géoloc Nominatim = réseau : le dire dans la privacy.
- iOS squelette : ne pas promettre iOS en v2 store.
