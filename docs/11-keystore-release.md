# Keystore release (Play Store)

Le build **release** utilise encore le keystore **debug** tant que `android/keystore.properties` n’existe pas (pratique pour tester). Pour le Play Store, il faut une clé **à toi**, une seule fois, **jamais perdue**.

## Générer (une fois)

Dans un terminal (JDK 21) :

```powershell
keytool -genkeypair -v -storetype PKCS12 -keystore mespensees-release.keystore -alias mespensees -keyalg RSA -keysize 2048 -validity 10000
```

Place le fichier **hors Git** (ex. `C:\Users\credo\Secrets\mespensees-release.keystore`).

Copie `android/keystore.properties.example` vers `android/keystore.properties` et remplis les mots de passe + le chemin `storeFile`.

`keystore.properties` et `*.jks` / le `.keystore` release sont dans `.gitignore`.

Compte développeur Google Play (25 $) encore requis pour publier. Ce fichier prépare seulement la signature.

## Fiche Play Store (quand le compte existe)

| Asset | Taille |
|---|---|
| Icône haute res | 512 × 512 PNG, sans transparence |
| Feature graphic | 1024 × 500 |
| Captures téléphone | au moins 2, 16:9 ou 9:16 |

URLs à coller dans la fiche :

- Confidentialité : `https://mespensees.vercel.app/privacy`
- Conditions : `https://mespensees.vercel.app/terms`

## Data safety (réponses prévues)

Application **locale**, pas de compte Mes Pensées.

| Question Play | Réponse |
|---|---|
| Collecte de données utilisateur ? | Non, pas par l’éditeur. Les notes restent sur l’appareil. |
| Chiffrement en transit ? | Pas de serveur Mes Pensées. Nominatim (option lieu) est un appel HTTPS tiers. |
| Partage avec des tiers ? | Uniquement Nominatim si l’utilisateur ajoute un lieu (IP + coordonnées). |
| Données sensibles (notes) ? | Stockées localement, chiffrées au repos. Non envoyées à l’éditeur. |
| Suppression | Désinstallation / reset in-app. Pas de compte cloud à supprimer chez l’éditeur. |
