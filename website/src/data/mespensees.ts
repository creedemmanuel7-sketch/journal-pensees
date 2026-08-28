export type LocalizedText = {
  fr: string;
  en: string;
};

export type Feature = {
  id: string;
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type StackItem = {
  name: string;
  category: LocalizedText;
};

export type DetailItem = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type ScreenshotItem = {
  id: string;
  image: string;
  label: LocalizedText;
  description: LocalizedText;
};

export const mespenseesData = {
  pitch: {
    fr: "MesPensees est une application Android de journal intime pensée pour écrire sans compromis : aucun compte, aucun serveur, aucune synchronisation forcée. Vos notes, images et audios restent sur l'appareil, protégés par chiffrement local, PIN et biométrie.",
    en: "MesPensees is an Android journaling app for private writing: no account, no server, no forced sync. Notes, images, and audio stay on-device with local encryption, PIN, and biometrics.",
  },
  highlights: [
    {
      id: "local-first",
      title: { fr: "100 % local", en: "100% local" },
      description: {
        fr: "L'application fonctionne sans backend : le contenu personnel reste dans le téléphone.",
        en: "The app works without a backend, so personal content stays on the phone.",
      },
    },
    {
      id: "private-by-design",
      title: { fr: "Confidentialité par défaut", en: "Private by design" },
      description: {
        fr: "PIN, biométrie, données chiffrées et widgets qui évitent d'afficher du contenu sensible.",
        en: "PIN, biometrics, encrypted data, and widgets that avoid exposing sensitive content.",
      },
    },
    {
      id: "expressive",
      title: { fr: "Écriture expressive", en: "Expressive writing" },
      description: {
        fr: "Notes, souvenirs visuels, audio, rappels et capsules temporelles pour écrire à son rythme.",
        en: "Notes, visual memories, audio, reminders, and time capsules for writing at your pace.",
      },
    },
  ] satisfies DetailItem[],
  features: [
    {
      id: "encryption",
      icon: "🔐",
      title: {
        fr: "Chiffrement local",
        en: "Local encryption",
      },
      description: {
        fr: "Notes chiffrées AES avec clé dérivée PBKDF2. Vos pensées ne quittent jamais l'appareil.",
        en: "AES-encrypted notes with PBKDF2 key derivation. Your thoughts never leave the device.",
      },
    },
    {
      id: "pin",
      icon: "🎭",
      title: {
        fr: "PIN & mode leurre",
        en: "PIN & decoy mode",
      },
      description: {
        fr: "Code PIN haché, biométrie et journal factice en cas d'accès forcé.",
        en: "Hashed PIN, biometrics, and a decoy journal for forced access scenarios.",
      },
    },
    {
      id: "capsules",
      icon: "⏳",
      title: {
        fr: "Capsules temporelles",
        en: "Time capsules",
      },
      description: {
        fr: "Scellez une pensée pour l'ouvrir plus tard — semaine, mois, année ou cinq ans.",
        en: "Seal a thought to open later — week, month, year, or five years.",
      },
    },
    {
      id: "widgets",
      icon: "📱",
      title: {
        fr: "Widgets Android",
        en: "Android widgets",
      },
      description: {
        fr: "Widgets natifs pour écrire ou consulter depuis l'écran d'accueil.",
        en: "Native widgets to write or browse from your home screen.",
      },
    },
    {
      id: "notifications",
      icon: "🔔",
      title: {
        fr: "Notifications intelligentes",
        en: "Smart notifications",
      },
      description: {
        fr: "Rappels locaux personnalisés pour cultiver l'habitude d'écrire.",
        en: "Personalized local reminders to build a writing habit.",
      },
    },
    {
      id: "tutorial",
      icon: "✨",
      title: {
        fr: "Tutoriel contextuel",
        en: "Contextual tutorial",
      },
      description: {
        fr: "Prise en main guidée dans l'éditeur et les fonctions premium.",
        en: "Guided onboarding in the editor and premium features.",
      },
    },
  ] satisfies Feature[],
  stack: [
    { name: "React Native 0.83", category: { fr: "Framework", en: "Framework" } },
    { name: "Hermes", category: { fr: "Moteur JS", en: "JS engine" } },
    { name: "crypto-js", category: { fr: "Chiffrement", en: "Encryption" } },
    { name: "AsyncStorage", category: { fr: "Stockage local", en: "Local storage" } },
    { name: "Notifee", category: { fr: "Notifications", en: "Notifications" } },
    { name: "Kotlin (Widgets)", category: { fr: "Natif Android", en: "Android native" } },
  ] satisfies StackItem[],
  screenshots: [
    {
      id: "lock",
      image: "/screenshots/lock.png",
      label: { fr: "Déverrouiller", en: "Unlock" },
      description: {
        fr: "L'app s'ouvre sur un écran de verrouillage. PIN ou biométrie, puis seulement vos notes apparaissent.",
        en: "The app opens on a lock screen. PIN or biometrics first — then your notes appear.",
      },
    },
    {
      id: "timeline",
      image: "/screenshots/timeline.png",
      label: { fr: "Lire le journal", en: "Open the journal" },
      description: {
        fr: "Vous arrivez dans la timeline : dates, humeurs et souvenirs, le tout resté sur l'appareil.",
        en: "You land in the timeline: dates, moods, and memories, all kept on-device.",
      },
    },
    {
      id: "editor",
      image: "/screenshots/editor.png",
      label: { fr: "Écrire une pensée", en: "Write a thought" },
      description: {
        fr: "Un tap, et l'éditeur s'ouvre : texte, médias, dictée vocale, dans une interface calme.",
        en: "One tap opens the editor: text, media, voice dictation, in a calm interface.",
      },
    },
    {
      id: "capsules",
      image: "/screenshots/capsules.png",
      label: { fr: "Sceller pour plus tard", en: "Seal for later" },
      description: {
        fr: "Une pensée peut devenir capsule temporelle : on la scelle aujourd'hui, on la rouvre demain.",
        en: "A thought can become a time capsule: seal it today, open it later.",
      },
    },
    {
      id: "capsules-tuto",
      image: "/screenshots/capsules-tuto.png",
      label: { fr: "Se laisser guider", en: "Get guided" },
      description: {
        fr: "Le tutoriel contextuel montre les gestes au bon moment, sans surcharge au premier lancement.",
        en: "The contextual tutorial shows gestures at the right moment, without overload on first launch.",
      },
    },
    {
      id: "stats",
      image: "/screenshots/stats.png",
      label: { fr: "Voir son rythme", en: "See your rhythm" },
      description: {
        fr: "Les stats restent personnelles : série d'écriture, humeurs, habitudes — sans tracking externe.",
        en: "Stats stay personal: writing streak, moods, habits — with no external tracking.",
      },
    },
    {
      id: "coffre",
      image: "/screenshots/coffre.png",
      label: { fr: "Protéger davantage", en: "Tighten security" },
      description: {
        fr: "Le coffre rassemble PIN, biométrie, mode leurre, exports et réinitialisation — tout en local.",
        en: "The vault gathers PIN, biometrics, decoy mode, exports, and reset — all local.",
      },
    },
  ] satisfies ScreenshotItem[],
} as const;
