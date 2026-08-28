# Sphère 1 — Ergonomie

Références : [Laws of UX](https://lawsofux.com), [Nielsen Norman Group](https://www.nngroup.com/articles/), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines), [Material 3](https://m3.material.io).

## Principes à garder pour Mes Pensées

**Jakob’s Law** — Les gens attendent un journal comme un journal : liste, + pour écrire, cadenas pour verrouiller. Ne pas inventer une navigation exotique.

**Fitts’s Law** — Le FAB d’écriture et le pavé PIN doivent être grands et en bas (pouce). Éviter les cibles de 24 px en haut à droite.

**Hick’s Law** — Le menu « + » de l’éditeur est dense. En v2 : 4 actions visibles max, le reste dans un second niveau.

**Miller / charge mentale** — Un écran = un job. Lock = ouvrir. Timeline = lire. Éditeur = écrire. Coffre = sécurité. Ne pas mélanger les trois.

**Postel (tolérance)** — PIN faux : message clair + shake, pas un écran vide. Capsule pas encore ouverte : expliquer le délai.

**Peak-end** — La dernière chose vue au lock doit rassurer (icône, « vos notes sont ici »), pas un slogan marketing.

## Heuristiques Nielsen (utilisabilité)

1. Visibilité du statut (série, capsule qui s’ouvre).
2. Correspondance au monde réel (mots FR, pas « vault encrypt »).
3. Contrôle utilisateur (annuler une capsule, restaurer la corbeille).
4. Cohérence (même bouton rose = action principale partout).
5. Prévention d’erreur (confirmer wipe / auto-destruction).
6. Reconnaissance plutôt que rappel (tutoriel contextuel déjà là : le garder court).
7. Flexibilité (PIN vs biométrie).
8. Esthétique minimale (moins de MAJUSCULES que le portfolio).
9. Aide à l’erreur (PIN oublié → recovery).
10. Documentation courte (une page Aide in-app en v2).

## Contrôle v2

- Zone tactile ≥ 44 pt (Apple) / 48 dp (Material).
- Contraste texte/fond WCAG AA sur thème clair **et** sombre.
- `prefers-reduced-motion` si on ajoute plus d’anim.
