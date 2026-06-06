import { PermissionsAndroid, Platform, NativeModules } from 'react-native';

let Voice = null;

try {
  const mod = require('@react-native-voice/voice');
  Voice = mod.default || mod;
} catch (e) {
  Voice = null;
}

export function isVoiceAvailable() {
  return !!Voice && !!NativeModules.Voice;
}

async function requestMicPermission() {
  if (Platform.OS !== 'android') return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: 'Microphone',
      message: 'Mes Pensées a besoin du micro pour la dictée vocale.',
      buttonPositive: 'Autoriser',
      buttonNegative: 'Refuser',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function startDictation(onPartialResult, onError) {
  if (!isVoiceAvailable()) {
    onError?.(
      new Error(
        'Reconnaissance vocale indisponible. Réinstallez l’APK release et vérifiez que « Reconnaissance vocale Google » est activée dans les paramètres Android.',
      ),
    );
    return false;
  }

  const ok = await requestMicPermission();
  if (!ok) {
    onError?.(new Error('Permission micro refusée.'));
    return false;
  }

  Voice.onSpeechResults = (e) => {
    const text = e.value?.[0];
    if (text) onPartialResult?.(text);
  };
  Voice.onSpeechError = (e) => {
    onError?.(
      new Error(e.error?.message || 'Erreur de reconnaissance vocale.'),
    );
  };

  try {
    await Voice.start('fr-FR');
    return true;
  } catch (err) {
    onError?.(err);
    return false;
  }
}

export async function stopDictation() {
  if (!isVoiceAvailable()) return;
  try {
    await Voice.stop();
    await Voice.cancel();
  } catch (e) {
    console.warn('stopDictation:', e);
  }
}
