# Migration Expo → React Native CLI (bare)

Ce dépôt a été migré côté **JavaScript** : plus d’imports `expo-`* ni `@expo-google-fonts`. Les dossiers `android/` et `ios/` sont présents (squelette RN 0.83) ; vérifiez le linking des modules natifs avant le premier build release.

## État actuel


| Ancien (Expo)                        | Remplacement                                             |
| ------------------------------------ | -------------------------------------------------------- |
| `expo-local-authentication`          | `react-native-biometrics`                                |
| `expo-camera`                        | `react-native-vision-camera`                             |
| `expo-notifications` + `expo-device` | `@notifee/react-native` + `react-native-device-info`     |
| `expo-av` (ambiances)                | `react-native-audio-recorder-player`                     |
| `expo-av` (enregistrement éditeur)   | `react-native-audio-recorder-player`                     |
| `expo-print` + `expo-sharing`        | `react-native-html-to-pdf` + `react-native-share`        |
| `expo-file-system`                   | `react-native-fs`                                        |
| `expo-location`                      | `react-native-geolocation-service` + géocodage Nominatim |
| `expo-image-picker`                  | `react-native-image-picker`                              |
| `@expo-google-fonts`                 | police liée dans `assets/fonts/`                         |
| `expo-status-bar`                    | `StatusBar` de `react-native`                            |
| `registerRootComponent`              | `AppRegistry` dans `index.js`                            |


Fichiers utilitaires : `utils/fonts.js`, `utils/location.js`, configs `babel.config.js`, `metro.config.js`, `react-native.config.js`.

## 1. Prérequis

- Node.js ≥ 18
- JDK 17 (Android)
- Android Studio + SDK
- Xcode 15+ (macOS, iOS)
- CocoaPods (`gem install cocoapods`)

## 2. Installer les dépendances JS

```bash
cd c:\Users\credo\Desktop\MesPensees
npm install
```

## 3. Générer les projets natifs

**Option A — Nouveau squelette RN 0.83 (recommandé)**

```bash
cd c:\Users\credo\Desktop
npx @react-native-community/cli@latest init MesPenseesNative --version 0.83.2 --skip-install
```

Copiez `android/` et `ios/` depuis `MesPenseesNative` vers `MesPensees`, puis :

- Dans `android/app/src/main/java/.../MainActivity.kt` (ou `.java`), le nom du composant doit être `**MesPensees**` (voir `app.json` → `name`).
- `android/app/build.gradle` : `applicationId` → `com.mespensees.app`
- iOS : bundle identifier → `com.mespensees.app`, `CFBundleDisplayName` → `Mes Pensées`

**Option B — `npx react-native-eject` n’existe plus** ; ne pas utiliser Expo prebuild si vous quittez Expo.

## 4. Polices

1. Ajoutez `assets/fonts/CormorantGaramond-LightItalic.ttf` (voir `assets/fonts/README.md`).
2. `npx react-native-asset` ou rebuild complet.

## 5. Permissions Android (`AndroidManifest.xml`)

```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.INTERNET" />
```

## 6. Permissions iOS (`Info.plist`)

```xml
<key>NSFaceIDUsageDescription</key>
<string>Mes Pensées utilise Face ID pour protéger votre journal privé.</string>
<key>NSCameraUsageDescription</key>
<string>Mes Pensées utilise la caméra pour les alertes d'intrusion.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Mes Pensées accède à vos photos pour les pièces jointes.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Mes Pensées enregistre des notes vocales.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Mes Pensées transcrit votre dictée vocale dans l'éditeur.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Mes Pensées enregistre la ville de vos pensées.</string>
```

## 7. Configuration native des modules

Après `npm install` :

```bash
cd ios && pod install && cd ..
```

Modules à vérifier dans la doc officielle :

- **Vision Camera** : `VisionCamera_enableFrameProcessors=false` si besoin, permissions caméra.
- **Notifee** : suivez [notifee.app](https://notifee.app/react-native/docs/installation) (Firebase optionnel pour FCM ; les notifications locales fonctionnent sans).
- **Ambiances sonores** (`react-native-audio-recorder-player`) : fichiers audio dans `assets/sounds/` (déjà référencés par `require`, voir `utils/ambiancePlayer.js`).
- **react-native-biometrics** : Face ID / empreinte.
- **Geolocation** : activer `locationWhenInUse` dans Xcode.

## 8. APK Android (build rapide)

**Pourquoi c’était lent ?** Le premier build compile du C++ pour chaque module natif (Vision Camera, Nitro, écran, audio). Avant, **4 architectures** (`arm`, `arm64`, `x86`, `x86_64`) multipliaient le temps par ~4. Évitez aussi `--no-daemon` (ralentit chaque build).

**Commande recommandée** (téléphone récent, une seule arch) :

```powershell
cd c:\Users\credo\Desktop\MesPensees
npm run android:apk
```

**Ne pas** lancer `clean` sauf en cas d’erreur bizarre.

| APK | Fichier | Sur le téléphone |
|-----|---------|------------------|
| **Autonome (recommandé)** | `android\app\build\outputs\apk\release\app-release.apk` | Fonctionne sans PC |
| **Debug** | `android\app\build\outputs\apk\debug\app-debug.apk` | **Metro obligatoire** sur le PC |

### Écran rouge « Unable to load script »

Normal si vous avez installé **app-debug.apk** sans lancer Metro : le JavaScript n’est pas dans l’APK.

**Solution rapide (dev)** — PC allumé, téléphone en USB :

```powershell
npm start
adb reverse tcp:8081 tcp:8081
```

Puis rouvrez l’app (ou secouez → Reload).

**Solution définitive** — rebuild avec JS intégré :

```powershell
npm run android:apk
adb install -r android\app\build\outputs\apk\release\app-release.apk
```

### Installer sur le téléphone

**Sans PC** — copier **app-release.apk** sur le téléphone, ouvrir, autoriser « sources inconnues ».

**ADB** :

```powershell
adb install -r android\app\build\outputs\apk\release\app-release.apk
```

Émulateur PC : `.\gradlew.bat assembleDebug -PreactNativeArchitectures=x86_64`

Si un build tourne déjà depuis 45+ min, **Ctrl+C**, puis relancez avec la config ci-dessus (une seule ABI dans `gradle.properties`).

### Erreur Windows « Filename longer than 260 characters »

React Native + New Architecture génère des chemins très longs. Solutions :

1. **Script fourni (recommandé)** : `npm run android:apk` (utilise le lecteur `M:` + cache Gradle court).
2. **Activer les chemins longs** (admin PowerShell) :  
   `New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force`  
   puis redémarrer le PC.
3. **Déplacer le projet** vers un chemin court : `C:\MesPensees`.

## 9. Lancer l’application

Terminal 1 :

```bash
npm start
```

Terminal 2 :

```bash
npm run android
# ou sur macOS :
npm run ios
```

## 10. Fichiers Expo retirés / obsolètes

- `eas.json` — plus nécessaire sans EAS (peut être supprimé).
- Ancien `app.json` Expo — remplacé par un manifeste minimal RN.
- Dossiers `.expo/`, `expo-env.d.ts` — ignorés ou supprimables.

## 11. Vérifier l’absence d’Expo

```bash
rg "expo-|@expo" --glob "!node_modules/**" --glob "!package-lock.json"
```

## 12. Splash screen (Android)

`assets/splash-screen.png` est copié vers `android/.../drawable-nodpi/splash_screen_image.png` par `scripts/sync-android-icons.ps1` (lancé avant `npm run android:apk`).

Au démarrage, l’image plein écran s’affiche puis l’onboarding / l’écran de verrouillage React Native prend le relais.

## 13. Widgets écran d'accueil

- **Android** : implémenté (voir `WIDGET.md`) — ajout manuel via Widgets sur l’écran d’accueil.
- **iOS** : non fait — Widget Extension + Mac + Xcode obligatoires.

## 13. iPhone (impossible sous Windows)

| Besoin | Où |
|--------|-----|
| Dossier `ios/` + `pod install` | Mac |
| Build sur appareil | Mac + Xcode + Apple ID |
| TestFlight / App Store | Compte Apple Developer (~99 USD/an) |
| Widget iOS | Mac + Widget Extension Swift |

Sans Mac : CI macOS (GitHub Actions, Codemagic) ou faire builder par un tiers.

## Blockers connus

1. **`ios/` absent** — génération sur Mac (étape 3).
2. **Polices** : TTF présent dans `assets/fonts/` ; rebuild après ajout.
3. **Géolocalisation** : Nominatim (réseau requis).
4. **Ambiances sonores** (`react-native-audio-recorder-player`) : tester sur appareil réel.
5. **Build iOS** : Mac + Xcode ; widget iOS non livré.
6. **Dépendances natives** : `react-native-nitro-modules@0.29.2` + `npm run postinstall` (patch voix).

## Identifiants d’application (inchangés)

- Android : `com.mespensees.app`
- iOS : `com.mespensees.app`

