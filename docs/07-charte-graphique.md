# Sphère 7 — Charte graphique

## Tokens actuels (source : `context/ThemeContext.js`)

| Rôle | Sombre | Clair |
|------|--------|--------|
| Fond | `#0a0a0b` | `#f5f5f7` |
| Surface | `#161618` | `#ffffff` |
| Texte | `#e8e8ea` | `#1a1a1c` |
| Accent défaut | Rose `#ff4d8d` | idem |
| Secondaire | Teal `#3ecf8e` | idem |

Accents utilisateur : rose, bleu, violet, noir, vert + saisons.

## Typographie

- Display : **Cormorant Garamond Light Italic** (`utils/fonts.js`).
- Corps : système (San Francisco / Roboto).
- Site : Cormorant + Inter.

Le **nom affiché** « Mes Pensées » en italic **est** le logo. Pas de wordmark SVG.

## V2 — kit minimum Play Store / site

1. Icône 512×512 + adaptive foreground/background.
2. Wordmark SVG « Mes Pensées » (une ligne, italic).
3. Feature graphic 1024×500.
4. Interdire le copy « cryptage militaire ».
5. Une page `/brand` optionnelle plus tard ; pour l’instant cette charte + captures propres (notes fictives).

## Contraste

Vérifier le rose `#ff4d8d` sur fond `#0a0a0b` (généralement OK) et sur fond clair (peut échouer AA en petit texte → utiliser `secondary` `#cc2266` pour le body light).
