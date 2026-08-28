export type ChangeKind =
  | "added"
  | "changed"
  | "fixed"
  | "security"
  | "removed";

export type Localized = { fr: string; en: string };

export type ChangeItem = {
  kind: ChangeKind;
  text: Localized;
};

export type Release = {
  version: string;
  date: string;
  status: "released" | "unreleased";
  title: Localized;
  summary: Localized;
  items: ChangeItem[];
};

export const KIND_LABEL: Record<ChangeKind, Localized> = {
  added: { fr: "Ajouté", en: "Added" },
  changed: { fr: "Modifié", en: "Changed" },
  fixed: { fr: "Corrigé", en: "Fixed" },
  security: { fr: "Sécurité", en: "Security" },
  removed: { fr: "Retiré", en: "Removed" },
};

/** Semantic Versioning : MAJOR.MINOR.PATCH */
export const versioningScheme = {
  name: "SemVer",
  spec: "https://semver.org/lang/fr/",
  changelogSpec: "https://keepachangelog.com/fr/1.1.0/",
} as const;

export const releases: Release[] = [
  {
    version: "2.0.0",
    date: "",
    status: "unreleased",
    title: {
      fr: "Prochaine version majeure",
      en: "Next major version",
    },
    summary: {
      fr: "En conception. CGU, kit de marque, motion plus lisible, release Play Store. Rien n’est figé ici tant que ce n’est pas publié.",
      en: "In design. Terms of use, brand kit, clearer motion, Play Store release. Nothing is final until it ships.",
    },
    items: [
      {
        kind: "added",
        text: {
          fr: "Conditions d’utilisation + politique de confidentialité accessibles dans l’app.",
          en: "In-app terms of use and privacy policy.",
        },
      },
      {
        kind: "changed",
        text: {
          fr: "Parcours verrouillage → journal plus clair, animations plus courtes et utiles.",
          en: "Clearer lock-to-journal flow, shorter meaningful motion.",
        },
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-08-28",
    status: "released",
    title: {
      fr: "Première version publique",
      en: "First public release",
    },
    summary: {
      fr: "Journal intime Android 100 % local : écriture, chiffrement, PIN, capsules, widgets et site vitrine. APK via GitHub Releases.",
      en: "Local-first Android journal: writing, encryption, PIN, capsules, widgets, and marketing site. APK via GitHub Releases.",
    },
    items: [
      {
        kind: "added",
        text: {
          fr: "Éditeur de notes (texte, images, audio, dictée), humeurs, lieu optionnel, modèles d’écriture.",
          en: "Note editor (text, images, audio, dictation), moods, optional location, writing templates.",
        },
      },
      {
        kind: "added",
        text: {
          fr: "Timeline, recherche, stats, capsules temporelles, corbeille 30 jours, coffre, partage anonymisé, export TXT/PDF.",
          en: "Timeline, search, stats, time capsules, 30-day trash, vault, anonymized share, TXT/PDF export.",
        },
      },
      {
        kind: "added",
        text: {
          fr: "PIN haché PBKDF2, biométrie, mode leurre, auto-destruction, alerte intrusion, récupération par mots-clés, auto-verrouillage.",
          en: "Hashed PIN, biometrics, decoy mode, auto-wipe, intrusion alert, keyword recovery, auto-lock.",
        },
      },
      {
        kind: "added",
        text: {
          fr: "Notifications intelligentes génériques, tutoriel contextuel, widgets Inspiration / Série / Raccourcis (sans contenu de notes).",
          en: "Generic smart notifications, contextual tutorial, Inspiration / Streak / Shortcuts widgets (no note content).",
        },
      },
      {
        kind: "security",
        text: {
          fr: "Chiffrement AES local, rotation de clé au changement de PIN, wipe AsyncStorage + fichiers, plus de titre de note dans les widgets.",
          en: "Local AES encryption, key rotation on PIN change, full wipe, no note titles in widgets.",
        },
      },
      {
        kind: "fixed",
        text: {
          fr: "Suppression Timeline, fuites mode leurre, biométrie cosmétique, rétrospective factice.",
          en: "Timeline delete, decoy leaks, cosmetic biometrics, hardcoded retrospective.",
        },
      },
    ],
  },
];
