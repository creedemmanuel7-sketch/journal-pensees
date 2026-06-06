import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHANNEL_ID = 'mespensees-default';
export const DAILY_REMINDER_ID = 'daily-writing-reminder';

const MESSAGES = [
  {
    title: 'Mes Pensées ✨',
    body: "Votre sanctuaire vous attend. Qu'avez-vous ressenti aujourd'hui ?",
  },
  {
    title: 'Un moment pour vous 🕯️',
    body: 'Prenez quelques minutes pour écrire vos pensées du jour.',
  },
  {
    title: 'Votre journal vous manque 📖',
    body: "Il est temps de capturer ce moment avant qu'il ne s'envole.",
  },
  {
    title: 'Mes Pensées 🌙',
    body: 'La nuit est propice à la réflexion. Écrivez ce que vous ressentez.',
  },
  {
    title: "Un instant d'introspection 💭",
    body: 'Quelques mots suffisent pour garder trace de votre journée.',
  },
  {
    title: 'Votre vérité vous attend 🔐',
    body: 'Ouvrez votre sanctuaire et libérez vos pensées.',
  },
];

async function ensureChannel() {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Mes Pensées',
    importance: AndroidImportance.HIGH,
  });
}

export const requestPermissions = async () => {
  const isEmulator = await DeviceInfo.isEmulator();
  if (isEmulator) {
    await ensureChannel();
    return true;
  }

  await ensureChannel();
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1;
};

function nextDailyTimestamp(hour, minute) {
  const trigger = new Date();
  trigger.setHours(hour, minute, 0, 0);
  if (trigger.getTime() <= Date.now()) {
    trigger.setDate(trigger.getDate() + 1);
  }
  return trigger.getTime();
}

export const scheduleDaily = async (hour, minute) => {
  try {
    await notifee.cancelNotification(DAILY_REMINDER_ID);
    const granted = await requestPermissions();
    if (!granted) return { success: false, reason: 'permission' };

    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

    await notifee.createTriggerNotification(
      {
        id: DAILY_REMINDER_ID,
        title: msg.title,
        body: msg.body,
        android: {
          channelId: CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default' },
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: nextDailyTimestamp(hour, minute),
        repeatFrequency: RepeatFrequency.DAILY,
      },
    );

    await AsyncStorage.setItem('notif_hour', hour.toString());
    await AsyncStorage.setItem('notif_minute', minute.toString());
    await AsyncStorage.setItem('notif_enabled', 'true');

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: e };
  }
};

export const cancelNotifications = async () => {
  try {
    await notifee.cancelNotification(DAILY_REMINDER_ID);
    await AsyncStorage.setItem('notif_enabled', 'false');
    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};

// noteId/title conservés pour compat ; le titre n'est JAMAIS affiché
// (confidentialité : aucune fuite de contenu dans une notification).
export const scheduleCapsuleNotification = async (
  date,
  title,
  noteId = null,
) => {
  try {
    // Préférence dédiée : la notification de capsule peut être désactivée.
    const capsulePref = await AsyncStorage.getItem('notif_capsule');
    if (capsulePref === 'false') return { success: false, reason: 'disabled' };

    const granted = await requestPermissions();
    if (!granted) return { success: false };

    const triggerDate = date instanceof Date ? date : new Date(date);
    if (triggerDate.getTime() <= Date.now()) {
      return { success: false, reason: 'past' };
    }

    const notifId = noteId
      ? `capsule-${noteId}`
      : `capsule-${triggerDate.getTime()}`;

    await notifee.createTriggerNotification(
      {
        id: notifId,
        title: 'Capsule Temporelle ⏳',
        body: 'Une capsule temporelle est prête à être ouverte.',
        android: { channelId: CHANNEL_ID, pressAction: { id: 'default' } },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
      },
    );
    return { success: true, id: notifId };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const cancelCapsuleNotification = async (noteId) => {
  if (!noteId) return;
  try {
    await notifee.cancelNotification(`capsule-${noteId}`);
  } catch (e) {
    console.warn('cancelCapsuleNotification:', e);
  }
};

export const loadNotifSettings = async () => {
  try {
    const hour = await AsyncStorage.getItem('notif_hour');
    const minute = await AsyncStorage.getItem('notif_minute');
    const enabled = await AsyncStorage.getItem('notif_enabled');
    return {
      hour: hour ? parseInt(hour, 10) : 20,
      minute: minute ? parseInt(minute, 10) : 0,
      enabled: enabled === 'true',
    };
  } catch (e) {
    return { hour: 20, minute: 0, enabled: false };
  }
};
