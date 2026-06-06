# Polices

Téléchargez **Cormorant Garamond Light Italic** depuis [Google Fonts](https://fonts.google.com/specimen/Cormorant+Garamond) et placez le fichier ici sous le nom :

`CormorantGaramond-LightItalic.ttf`

Puis liez la police au projet natif :

```bash
npx react-native-asset
npm run android:apk
```

Sans cette étape, l’app utilise l’italique système (la police téléchargée n’apparaît pas dans l’APK).
