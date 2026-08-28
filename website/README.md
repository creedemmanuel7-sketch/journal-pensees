# MesPensees Website

Site vitrine officiel de **MesPensees**, application Android de journal intime chiffré, local et sans compte.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion (animations scroll/reveal)
- React Three Fiber + drei (hero 3D léger, lazy-loaded avec fallback WebGL)

## Démarrage local

```bash
cd c:\Users\credo\Desktop\MesPensees\website
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Build & production

```bash
cd c:\Users\credo\Desktop\MesPensees\website
npm install
npm run build
npm run start
```

## Déploiement Vercel

Le site est intégré dans le monorepo principal sous `website/`.

Dans Vercel, configurer le projet ainsi :

1. Repository : dépôt principal `MesPensees`.
2. Root Directory : `website`.
3. Framework preset : **Next.js**.
4. Install command : `npm install`.
5. Build command : `npm run build`.
6. Output directory : laisser vide / valeur par défaut Next.js (`.next`).
7. Production domain : `https://journal-pensees.vercel.app/`.

Aucune variable d'environnement n'est requise.

Ne pas pousser depuis un environnement automatisé sans remote confirmé et instruction explicite.

## APK

Le fichier APK (~97 Mo) **ne doit plus vivre dans Git**. GitHub limite les fichiers recommandés à 50 Mo.

Le bouton du site pointe vers **GitHub Releases** :

`https://github.com/creedemmanuel7-sketch/journal-pensees/releases/latest/download/mespensees-debug.apk`

### Publier une nouvelle version

```powershell
cd C:\Users\credo\Desktop\MesPensees
gh release create v0.1.0 "android/app/build/outputs/apk/debug/app-debug.apk#mespensees-debug.apk" --title "MesPensees 0.1.0" --notes "APK debug pour test. Pas une release Play Store."
```

C'est un APK **debug** pour test. Il ne remplace pas une release Play Store signée.

## Structure

```
src/
  app/                    # layout, page, privacy, legal, globals.css
  components/             # Hero, MesPensees, À propos, Contact, 3D…
  contexts/
    LanguageContext.tsx   # i18n FR/EN + localStorage
  data/
    site.ts               # liens sociaux, email, metadata
    mespensees.ts         # features, stack, screenshots (éditable)
  i18n/
    fr.json / en.json     # traductions UI
public/
  downloads/              # APK public et notes de remplacement
  screenshots/            # captures réelles de l'application
  og-image.svg            # image Open Graph
```

## Personnalisation

| Fichier | À modifier |
|---------|------------|
| `src/data/site.ts` | Email, URL du site, liens LinkedIn/GitHub/portfolio, APK |
| `src/data/mespensees.ts` | Pitch, features, stack MesPensees |
| `src/i18n/fr.json` / `en.json` | Textes d'interface |
| `public/screenshots/*.png` | Captures réelles affichées dans la séquence verticale |
| GitHub Releases | APK public (hors Git) |
| `public/og-image.svg` | Image de partage social |

## i18n

Switch FR/EN dans le header et le footer. La préférence est sauvegardée dans `localStorage`.

## Licence

Projet personnel — Crédo Adjignon.
