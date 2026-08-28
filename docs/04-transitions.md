# Sphère 4 — Transitions d’interface

Référence Material : [Motion overview](https://m3.material.io/styles/motion/overview/how-it-works) — le mouvement **explique** un changement d’état, il ne décore pas.

## Carte des écrans (continuité)

```
Onboarding → PIN setup → Lock → Timeline
                              ├→ Éditeur (push)
                              ├→ Stats / Coffre (tabs)
                              └→ Drawer → Recherche, Capsules, Corbeille…
```

**Shared axis** — Timeline → Éditeur : l’écran glisse depuis la droite (stack natif, déjà le cas). Ne pas fondre en fade (on perd le « d’où je viens »).

**Fade through** — Lock → Timeline : fondu court OK (changement de monde : fermé → ouvert).

**Container transform** — Carte de note → Éditeur : idéal v2 (la carte s’agrandit). Coûteux en RN ; priorité basse.

## Règles Mes Pensées

- Durée 200–400 ms (Material : emphasized easing).
- Pas d’anim sur le pavé PIN (latence = frustration, Hick + Fitts).
- Le tutoriel (coachmarks) : une étape à la fois, Passer toujours visible.
- Modales (supprimer, capsule) : entrée depuis le bas, pas un zoom 3D.

## V2

- Inventaire : lister chaque `navigate(` et lui coller un type de motion.
- Respecter « reduced motion » (couper les springs du site **et** de l’app).
