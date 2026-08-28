export const LEGAL_UPDATED = '28 août 2026';

export const PRIVACY_SECTIONS = [
  {
    title: 'Principe',
    body: 'Mes Pensées est une application locale. Elle ne crée pas de compte, n’a pas de serveur Mes Pensées et ne synchronise pas vos notes dans le cloud. Vos textes, images, audios et réglages restent sur l’appareil, chiffrés au repos (AES, clé dérivée par PBKDF2). L’accès peut être protégé par un PIN haché et, si vous l’activez, par la biométrie.',
  },
  {
    title: 'Données traitées',
    body: 'Uniquement ce que vous saisissez ou configurez : notes, médias, humeurs, capsules, rappels, préférences, journal d’intrusion local. Ces contenus ne sont pas envoyés à l’éditeur.',
  },
  {
    title: 'Géolocalisation (Nominatim)',
    body: 'Si vous ajoutez un lieu à une note, l’app peut interroger le service public Nominatim (OpenStreetMap) pour transformer des coordonnées en nom de lieu. Cela implique un échange réseau (adresse IP et coordonnées approximatives) avec ce service, pas avec un serveur Mes Pensées. Sans cette option, l’écriture reste hors ligne de ce point de vue.',
  },
  {
    title: 'Permissions',
    body: 'Caméra : photos de notes et, si vous l’activez, photo d’alerte en cas d’échecs PIN. Micro : notes vocales et dictée. Stockage : fichiers locaux. Notifications : rappels génériques, sans le texte de vos pensées.',
  },
  {
    title: 'Widgets et notifications',
    body: 'Les widgets n’affichent pas le titre ni le contenu des notes. Les notifications intelligentes restent génériques (habitude d’écriture, capsule prête, etc.).',
  },
  {
    title: 'Suppression',
    body: 'Vous pouvez vider ou réinitialiser les données depuis l’app. Désinstaller l’app retire en général les données locales, sauf sauvegarde Android que vous auriez activée vous-même.',
  },
  {
    title: 'Contact',
    body: 'creedemmanuel7@gmail.com',
  },
];

export const TERMS_SECTIONS = [
  {
    title: 'Objet',
    body: 'Mes Pensées est un journal intime personnel fourni en l’état, sans abonnement obligatoire. L’éditeur est ADJIGNON Kokou Crédo Gérald (Crédo), Lomé, Togo.',
  },
  {
    title: 'Usage',
    body: 'Vous êtes responsable de votre PIN, de vos mots-clés de récupération et de la sécurité de votre téléphone. L’éditeur ne peut pas récupérer vos notes si l’appareil est perdu, réinitialisé, ou si le PIN et les mots-clés sont oubliés.',
  },
  {
    title: 'Pas de garantie de récupération cloud',
    body: 'Il n’existe pas de copie serveur chez Mes Pensées. Une sauvegarde système Android, si vous l’activez, échappe au contrôle de l’app.',
  },
  {
    title: 'Chiffrement',
    body: 'Les notes sont chiffrées localement (AES + PBKDF2). Ce n’est pas une certification « militaire » ni une garantie contre tout attaquant qui aurait déjà le téléphone déverrouillé et des outils avancés.',
  },
  {
    title: 'APK hors magasin',
    body: 'Les fichiers APK distribués hors Play Store (ex. GitHub Releases) sont destinés aux tests. Une version signée Play Store suivra un processus de publication distinct.',
  },
  {
    title: 'Droit applicable',
    body: 'Pour toute question : creedemmanuel7@gmail.com. Les mentions du site mespensees.vercel.app complètent ces conditions.',
  },
];
