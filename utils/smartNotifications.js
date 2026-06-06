// Notifications « intelligentes » (adaptatives) — surcouche des rappels quotidiens.
//
// CONFIDENTIALITÉ (prioritaire) :
//  - Aucun message ne révèle le contenu d'une note (ni titre, ni texte) :
//    messages génériques uniquement.
//  - Ces notifications ne sont planifiées QUE pour l'utilisateur réel.
//    En mode leurre, on annule tout et on ne planifie rien (voir replanAllSmart).
//
// La logique pure et testable (inactivité, horaire habituel, « il y a un an »…)
// vit dans utils/dates.js afin de rester testable sans modules natifs.

import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  computeStreak,
  lastNoteDate,
  hasWrittenToday,
  findOnThisDayNote,
} from './dates';

const CHANNEL_ID = 'mespensees-default';

// Identifiants stables des notifications intelligentes (uniques par type).
export const SMART_IDS = {
  inactivity: 'smart-inactivity',
  streak: 'smart-streak',
  onthisday: 'smart-onthisday',
};

// Clés de préférences AsyncStorage (explicites).
export const PREF_KEYS = {
  inactivity: 'notif_inactivity',
  streak: 'notif_streak',
  capsule: 'notif_capsule',
  onthisday: 'notif_onthisday',
  smarttime: 'notif_smarttime',
  inactivityDays: 'notif_inactivity_days',
};

// Heure de rappel en soirée par défaut (protection de série / inactivité).
const EVENING_HOUR = 20;
// Heure du rappel « il y a un an » (matin).
const MORNING_HOUR = 9;
const DEFAULT_INACTIVITY_DAYS = 3;

const DAY_MS = 24 * 60 * 60 * 1000;

async function ensureChannel() {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Mes Pensées',
    importance: AndroidImportance.HIGH,
  });
}

/** Charge l'ensemble des préférences des notifications intelligentes. */
export const loadSmartSettings = async () => {
  try {
    const [inactivity, streak, capsule, onthisday, smarttime, days] =
      await Promise.all([
        AsyncStorage.getItem(PREF_KEYS.inactivity),
        AsyncStorage.getItem(PREF_KEYS.streak),
        AsyncStorage.getItem(PREF_KEYS.capsule),
        AsyncStorage.getItem(PREF_KEYS.onthisday),
        AsyncStorage.getItem(PREF_KEYS.smarttime),
        AsyncStorage.getItem(PREF_KEYS.inactivityDays),
      ]);
    return {
      // Désactivées par défaut, sauf la capsule (comportement historique préservé).
      inactivity: inactivity === 'true',
      streak: streak === 'true',
      capsule: capsule == null ? true : capsule === 'true',
      onthisday: onthisday === 'true',
      smarttime: smarttime === 'true',
      inactivityDays: days ? parseInt(days, 10) : DEFAULT_INACTIVITY_DAYS,
    };
  } catch (e) {
    return {
      inactivity: false,
      streak: false,
      capsule: true,
      onthisday: false,
      smarttime: false,
      inactivityDays: DEFAULT_INACTIVITY_DAYS,
    };
  }
};

/** Persiste une préférence booléenne. */
export const setSmartPref = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value ? 'true' : 'false');
  } catch (e) {
    console.warn('setSmartPref:', e);
  }
};

/** Persiste le seuil d'inactivité (nombre de jours). */
export const setInactivityDays = async (days) => {
  try {
    await AsyncStorage.setItem(PREF_KEYS.inactivityDays, String(days));
  } catch (e) {
    console.warn('setInactivityDays:', e);
  }
};

/** Annule TOUTES les notifications intelligentes (utilisé en mode leurre aussi). */
export const cancelAllSmart = async () => {
  try {
    await Promise.all(
      Object.values(SMART_IDS).map((id) => notifee.cancelNotification(id)),
    );
  } catch (e) {
    console.warn('cancelAllSmart:', e);
  }
};

/** Renvoie un timestamp futur correspondant à `hour:00` aujourd'hui, sinon demain. */
function nextOccurrence(hour, now = new Date()) {
  const t = new Date(now);
  t.setHours(hour, 0, 0, 0);
  if (t.getTime() <= now.getTime()) t.setDate(t.getDate() + 1);
  return t.getTime();
}

async function scheduleTrigger(id, body, timestamp) {
  await notifee.createTriggerNotification(
    {
      id,
      title: 'Mes Pensées',
      body,
      android: {
        channelId: CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        pressAction: { id: 'default' },
      },
    },
    { type: TriggerType.TIMESTAMP, timestamp },
  );
}

// --- Planificateurs par type -------------------------------------------------
// Chaque planificateur annule d'abord son propre identifiant pour éviter les
// doublons, puis (re)planifie si les conditions sont réunies. Messages génériques.

/**
 * Relance d'inactivité : si aucune note depuis N jours, rappel doux en soirée.
 * Replanifié à chaque sauvegarde : tant que l'utilisateur écrit, l'échéance recule.
 */
async function scheduleInactivity(notes, settings, now = new Date()) {
  await notifee.cancelNotification(SMART_IDS.inactivity);
  const last = lastNoteDate(notes);
  const days = settings.inactivityDays || DEFAULT_INACTIVITY_DAYS;
  // Jour d'échéance = dernière note + N jours, à l'heure du soir.
  const base = last ? last.getTime() : now.getTime();
  const dueDay = new Date(base + days * DAY_MS);
  dueDay.setHours(EVENING_HOUR, 0, 0, 0);
  let timestamp = dueDay.getTime();
  // Si l'échéance est déjà passée (et toujours inactif), viser ce soir / demain soir.
  if (timestamp <= now.getTime()) {
    timestamp = nextOccurrence(EVENING_HOUR, now);
  }
  await scheduleTrigger(
    SMART_IDS.inactivity,
    'Cela fait quelques jours… prends un instant pour écrire. 🕯️',
    timestamp,
  );
}

/**
 * Protection de série : si une série est en cours et que rien n'a été écrit
 * aujourd'hui, rappel en soirée. Aucun rappel si déjà écrit aujourd'hui.
 */
async function scheduleStreak(notes, now = new Date()) {
  await notifee.cancelNotification(SMART_IDS.streak);
  if (hasWrittenToday(notes, now)) return;
  const streak = computeStreak(notes, now);
  if (streak <= 0) return;
  // Rappel ce soir uniquement (si l'heure du soir n'est pas déjà passée).
  const t = new Date(now);
  t.setHours(EVENING_HOUR, 0, 0, 0);
  if (t.getTime() <= now.getTime()) return;
  await scheduleTrigger(
    SMART_IDS.streak,
    `Garde ta série de ${streak} jour${streak > 1 ? 's' : ''} ✍️`,
    t.getTime(),
  );
}

/**
 * « Il y a un an » : s'il existe une note réelle datant d'~1 an (±2 semaines),
 * rappel le matin suivant, sans aucun contenu.
 */
async function scheduleOnThisDay(notes, now = new Date()) {
  await notifee.cancelNotification(SMART_IDS.onthisday);
  const note = findOnThisDayNote(notes, now);
  if (!note) return;
  await scheduleTrigger(
    SMART_IDS.onthisday,
    "Un souvenir d'il y a un an t'attend. 📖",
    nextOccurrence(MORNING_HOUR, now),
  );
}

/**
 * Replanifie toutes les notifications intelligentes activées à partir des notes
 * RÉELLES fournies. En mode leurre (`isDecoy`), annule tout et ne planifie rien.
 *
 * @param {Array} notes  Notes réelles déchiffrées (jamais les notes leurres).
 * @param {{ isDecoy?: boolean }} opts
 */
export const replanAllSmart = async (notes, { isDecoy = false } = {}) => {
  try {
    if (isDecoy) {
      // Confidentialité : aucune activité sur les données du mode leurre.
      await cancelAllSmart();
      return;
    }

    const settings = await loadSmartSettings();

    // Inactivité.
    if (settings.inactivity) {
      await ensureChannel();
      await scheduleInactivity(notes, settings);
    } else {
      await notifee.cancelNotification(SMART_IDS.inactivity);
    }

    // Protection de série.
    if (settings.streak) {
      await ensureChannel();
      await scheduleStreak(notes);
    } else {
      await notifee.cancelNotification(SMART_IDS.streak);
    }

    // Il y a un an.
    if (settings.onthisday) {
      await ensureChannel();
      await scheduleOnThisDay(notes);
    } else {
      await notifee.cancelNotification(SMART_IDS.onthisday);
    }

    // Les capsules sont planifiées à la création de la note (NotesContext) ;
    // rien à replanifier ici.
  } catch (e) {
    console.warn('replanAllSmart:', e);
  }
};
