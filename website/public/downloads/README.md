# Téléchargement APK

Le bouton "Télécharger l'APK" pointe vers :

```text
/downloads/mespensees-debug.apk
```

Remplacer le fichier placeholder `mespensees-debug.apk` par le vrai APK généré depuis l'application mobile, par exemple :

```powershell
Copy-Item "C:\Users\credo\Desktop\MesPensees\android\app\build\outputs\apk\debug\app-debug.apk" "C:\Users\credo\Desktop\mespensees-website\public\downloads\mespensees-debug.apk" -Force
```

Au moment de cette préparation, aucun fichier `.apk` n'a été trouvé dans `C:\Users\credo\Desktop\MesPensees`.
