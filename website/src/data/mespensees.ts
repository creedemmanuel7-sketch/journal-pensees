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
      id: "timeline",
      image: "/screenshots/timeline.png",
      label: { fr: "Timeline privée", en: "Private timeline" },
      description: {
        fr: "Retrouvez vos pensées par date, humeur et moment de vie sans exposer le contenu hors de l'appareil.",
        en: "Browse thoughts by date, mood, and life moment without exposing content off-device.",
      },
    },
    {
      id: "editor",
      image: "/screenshots/editor.png",
      label: { fr: "Éditeur intime", en: "Private editor" },
      description: {
        fr: "Écrivez vite, ajoutez des médias, dictez selon l'appareil et gardez une expérience calme.",
        en: "Write quickly, attach media, dictate when supported, and keep a calm experience.",
      },
    },
    {
      id: "coffre",
      image: "/screenshots/coffre.png",
      label: { fr: "Coffre chiffré", en: "Encrypted vault" },
      description: {
        fr: "Les notes sensibles sont protégées localement, avec une logique de coffre pensée pour la discrétion.",
        en: "Sensitive notes are protected locally with a vault flow designed for discretion.",
      },
    },
    {
      id: "stats",
      image: "/screenshots/stats.png",
      label: { fr: "Statistiques personnelles", en: "Personal stats" },
      description: {
        fr: "Suivez votre régularité, vos émotions et vos habitudes d'écriture sans suivi externe.",
        en: "Track streaks, emotions, and writing habits without external tracking.",
      },
    },
    {
      id: "lock",
      image: "/screenshots/lock.png",
      label: { fr: "Verrouillage", en: "Lock screen" },
      description: {
        fr: "PIN et biométrie gardent l'accès sous contrôle, même sur un téléphone partagé.",
        en: "PIN and biometrics keep access controlled, even on a shared phone.",
      },
    },
    {
      id: "capsules",
      image: "/screenshots/capsules.png",
      label: { fr: "Capsules temporelles", en: "Time capsules" },
      description: {
        fr: "Scellez une pensée pour la redécouvrir plus tard, comme un message à votre futur vous.",
        en: "Seal a thought and rediscover it later, like a message to your future self.",
      },
    },
    {
      id: "capsules-tuto",
      image: "/screenshots/capsules-tuto.png",
      label: { fr: "Tutoriel capsules", en: "Capsules tutorial" },
      description: {
        fr: "L'écran d'aide accompagne la prise en main des capsules temporelles directement dans l'application.",
        en: "The help screen guides users through time capsules directly in the app.",
      },
    },
  ] satisfies ScreenshotItem[],
} as const;
