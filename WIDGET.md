# Widgets écran d'accueil — Mes Pensées

> **Confidentialité (règle absolue).** Les widgets n'affichent **jamais** le
> contenu d'une note — **ni le titre, ni le texte**. Les notes sont chiffrées,
> privées, et l'app possède un mode leurre / anti-intrusion. Seules des données
> **non sensibles** transitent : invitations d'écriture codées en dur côté natif
> et série d'écriture (streak). Aucune donnée déchiffrée ne quitte l'app.

## Android — implémenté

Trois widgets natifs (Kotlin), tous en français et au design sombre cohérent
avec l'app (fond `#2A231C`, texte `#F5F0E8`).

Fichiers : `android/app/src/main/java/com/mespensees/app/widget/`

## Décision de versionnement

Les widgets Android doivent être dans Git, car ce sont des sources de
fonctionnalité : providers Kotlin, layouts XML, chaînes, drawables et
déclarations `AndroidManifest.xml` / `res/xml/*_widget_info.xml`.

À ne pas versionner avec eux : APK générés, builds Gradle, logs, keystores,
captures privées et toute donnée utilisateur. Le widget peut exposer uniquement
des données explicitement non sensibles.

### 1. Inspiration du jour — `MesPenseesWidgetProvider`

- Layout : `res/layout/widget_mes_pensees.xml`
- Affiche une **invitation d'écriture** (prompt) qui change chaque jour, choisie
  de façon déterministe dans une liste codée en dur dans le provider
  (`PROMPTS`). Aucune donnée privée.
- Bouton **Écrire** + tap sur le widget → `mespensees://editor`.
- `updatePeriodMillis = 21600000` (6 h) pour que le prompt suive le changement
  de jour ; l'app peut aussi le rafraîchir (voir Bridge JS).

### 2. Série d'écriture — `StreakWidgetProvider`

- Layout : `res/layout/widget_streak.xml`
- Affiche le **nombre de jours consécutifs d'écriture** (streak), donnée non
  sensible lue depuis `SharedPreferences` (`MesPenseesWidget` / clé `streak`).
- État vide : « Commencez votre série aujourd'hui ».
- Bouton **Écrire** + tap → `mespensees://editor`.

### 3. Raccourcis — `QuickActionsWidgetProvider`

- Layout : `res/layout/widget_quick_actions.xml`
- 4 actions (aucune donnée affichée) : Écrire, Vocal, Chercher, Coffre.
- Deep links : `mespensees://editor`, `mespensees://editor?record=true`,
  `mespensees://search`, `mespensees://coffre`.

**Déclarations** : `AndroidManifest.xml` (3 `<receiver>`) + `res/xml/*_widget_info.xml`.

**Ajouter un widget** : appui long sur l'écran d'accueil → Widgets → Mes Pensées.

## Pont JS (données non sensibles uniquement)

- Bridge JS : `utils/widgetBridge.js` → module natif `MesPenseesWidget`.
- Module natif : `WidgetBridgeModule.kt` (méthode `update(streak)`), enregistré
  via `WidgetPackage.kt`.
- Le bridge **ne transmet que la série** ; il rafraîchit les widgets Inspiration
  et Série. Tout champ `title` éventuellement passé est ignoré.

```javascript
import { refreshHomeWidget } from './utils/widgetBridge';

await refreshHomeWidget({ streak: 3 }); // jamais de titre/contenu
```

Appelé depuis `NotesContext` après chargement / modification des notes (seul le
`streak` est effectivement utilisé). Sur iOS : no-op.

## Données exposées au widget

- Invitation d'écriture du jour (texte générique codé en dur, non lié aux notes)
- Série d'écriture (`streak`) — entier non sensible
- **Aucun** titre ni contenu de note dans `SharedPreferences`

## Checklist confidentialité avant push

- Aucun appel widget ne doit transmettre de titre ou contenu de note au module
  natif.
- `WidgetBridgeModule.kt` doit continuer à écrire uniquement `KEY_STREAK`.
- Les textes affichés par `MesPenseesWidgetProvider` doivent rester génériques et
  codés en dur.
- Les raccourcis doivent ouvrir l'app via deep links sans afficher de données.

## Rebuild nécessaire

Les modifications sont natives (Kotlin/XML + Manifest) : un **rebuild Gradle**
est requis.

```bash
npx react-native run-android
# ou
cd android && ./gradlew assembleDebug
```

Les widgets déjà posés se mettent à jour après réinstallation de l'app
(ou automatiquement au prochain cycle pour Inspiration).

## iOS — non implémenté (Mac requis)

Nécessite sur **macOS** :

1. Dossier `ios/` généré (`MIGRATION.md` §3).
2. Xcode → **File → New → Target → Widget Extension**.
3. App Group `group.com.mespensees.app` pour partager **uniquement** la série
   (jamais de titre ni de corps de note).
4. SwiftUI : lire le snapshot, `WidgetCenter.shared.reloadAllTimelines()` après
   sauvegarde.

Packages possibles : [react-native-widget-extension](https://www.npmjs.com/package/react-native-widget-extension) ou bridge Swift manuel.
