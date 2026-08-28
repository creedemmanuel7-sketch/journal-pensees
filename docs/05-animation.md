# Sphère 5 — Animation et effets

Sources : [Material easing](https://m3.material.io/styles/motion/easing-and-duration), [Making Motion Meaningful](https://design.google/library/making-motion-meaningful).

**Mes Pensées n’est pas en Jetpack Compose.** Les playgrounds Compose (skydoves) servent d’**inspiration de courbes**, pas de code à coller. Ici : React Native `Animated`, Reanimated (si on l’ajoute), LayoutAnimation avec parcimonie.

## Philosophie

Une anim est **utile** si elle répond à : « qu’est-ce qui a changé ? d’où ça vient ? puis-je l’interrompre ? »

Exemples utiles déjà dans l’esprit de l’app :

- Shake du PIN (feedback d’erreur).
- Pulse discret sur l’icône lock (l’app écoute la biométrie).
- Coachmark fade (attention dirigée).

Exemples à éviter :

- Particules permanentes (batterie, accessibilité).
- Spring sur chaque carte de la Timeline (jank).
- 3D lourde dans l’app (réserver au site).

## Durées cibles (Material)

| Type | Durée |
|------|--------|
| Micro (toggle, couleur) | 50–100 ms |
| Élément (bouton, chip) | 200–300 ms |
| Écran | 300–400 ms |
| Spatial / grand | 500 ms max |

Easing : **emphasized** pour les entrées d’écran ; **standard** pour les fades.

## V2

- Extraire 3 tokens : `motion.fast`, `motion.screen`, `motion.spring` dans un petit module JS.
- Couper les anims si `AccessibilityInfo.isReduceMotionEnabled()`.
- Ne pas ajouter Reanimated tant que la Timeline n’est pas mesurée (FPS).
