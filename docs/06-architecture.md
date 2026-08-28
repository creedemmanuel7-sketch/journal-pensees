# Sphère 6 — Architecture applicative

## Aujourd’hui

```
App.js
  ThemeProvider
  AuthProvider
  NotesProvider
  SoundProvider
  TutorialProvider
    Navigation (native-stack)
```

- **JS**, pas TypeScript.
- Stockage : AsyncStorage (JSON chiffré) + `react-native-fs` (médias).
- Crypto : `utils/encryption.js`.
- Wipe : `utils/wipe.js`.
- Native Android : widgets Kotlin, Notifee, Vision Camera.

## Limites

- Context Notes trop gros (CRUD + capsules + trash + chiffrement).
- Pas de couche « repository » testable sans mocks RN partout.
- iOS non branché.

## V2 (sans réécriture totale)

1. **Ne pas migrer tout en TypeScript d’un coup.** Fichiers nouveaux en TS si on bascule le bundler ; sinon JS + JSDoc.
2. Découper Notes : `notesStore`, `capsuleStore`, `trashStore`.
3. Un module `privacyPolicy` / `terms` (textes versionnés, même source que le site).
4. Garder le package `com.mespensees.app` (changer l’id = nouvelle app Play Store).
5. Widgets : continuer à ne pousser que `streak` + prompts génériques.

## Ce qu’on ne fait pas en v2

- Backend « pour plus tard ».
- Sync cloud.
- Réécrire en Compose / Kotlin UI (coût énorme, stack actuelle = RN).
