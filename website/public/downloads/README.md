# Téléchargement APK

Le bouton "Télécharger l'APK" pointe vers :

```text
/downloads/mespensees-debug.apk
```

Le fichier `mespensees-debug.apk` est un APK debug généré depuis l'application mobile.
Pour le remplacer après un nouveau build Android :

```powershell
Copy-Item "C:\Users\credo\Desktop\MesPensees\android\app\build\outputs\apk\debug\app-debug.apk" "C:\Users\credo\Desktop\MesPensees\website\public\downloads\mespensees-debug.apk" -Force
```

Cet APK est destiné au téléchargement direct temporaire depuis le site. Il ne remplace pas une release Play Store signée.
