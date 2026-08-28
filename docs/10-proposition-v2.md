# Sphère 10 — Proposition v2

Priorité : **fiabiliser le produit 1.0 et le rendre publiable**, pas empiler des écrans.

## P0 — Confiance et store

Livré en **1.0.1** (août 2026) : CGU + privacy in-app, URLs site `/privacy` `/terms`, copy chiffrement honnête, Nominatim, Gradle release si `keystore.properties` présent.

Reste côté **compte Play** (pas du code) : keystore réel, icône 512, feature graphic 1024×500, questionnaire Data safety — voir [11-keystore-release.md](11-keystore-release.md).

## P1 — UX (Laws of UX + Material Motion)

4. Parcours lock → timeline sans bouton mort (biométrie déjà branchée : auditer le reste).
5. Menu « + » de l’éditeur : 4 actions max au premier niveau.
6. Motion tokens + reduced motion.
7. Timeline : perf si beaucoup de notes.

## P2 — Marque et récit

8. Wordmark SVG + captures marketing (notes fictives).
9. Vidéo démo 20 s sur le site.
10. Chaque ship = entrée `/changelog` (SemVer).

## Hors scope v2

- iOS production.
- Sync cloud / compte.
- Réécriture Jetpack Compose.
- Changer `com.mespensees.app`.

## Versioning proposé

| Version | Contenu |
|---------|---------|
| **1.0.x** | Correctifs store, privacy, copy. |
| **1.1.0** | Aide in-app, menu + simplifié, motion. |
| **2.0.0** | Seulement s’il y a une rupture (nouveau format de notes, nouveau modèle de PIN). |

On ne saute pas à 2.0.0 pour « faire joli ». 2.0 = contrat utilisateur cassé.
