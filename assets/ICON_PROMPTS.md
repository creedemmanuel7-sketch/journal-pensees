# Prompts pour générer l’icône Mes Pensées

Utilisez un générateur d’images (DALL·E, Midjourney, Ideogram, etc.) puis exportez en **1024×1024 PNG**, fond opaque.

## Icône principale (launcher)

```
Minimal app icon for a private French journal app "Mes Pensées", single padlock merged with an open notebook page, elegant serif mood, dark charcoal background #0a0a0b, accent rose gold #ff4d8d subtle glow, no text, no letters, centered, flat modern iOS style, high contrast, rounded square safe zone 80%, premium calm feeling
```

## Variante sombre (Android adaptive – premier plan)

```
Same icon: padlock + notebook, rose gold #ff4d8d lines on transparent background, only the symbol, no square background, vector-like, thick strokes, readable at 48px
```

## Fond adaptive Android

```
Solid gradient dark #0a0a0b to #161618, subtle grain, no objects, minimalist
```

## Splash / marketing

```
Vertical mobile splash, title mood "Mes Pensées" feeling without text, floating light lines like thoughts, dark sanctuary atmosphere, rose and soft violet accents, cinematic, no faces, privacy luxury aesthetic
```

## Après génération

- Icône : `assets/icon.png` (1024×1024)
- Android adaptive foreground : `assets/android-icon-foreground.png`
- Android background : `assets/android-icon-background.png` (#0a0a0b)
- Puis copiez dans `android/app/src/main/res/mipmap-*` ou relancez le build.
