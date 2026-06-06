import { Image, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const player = AudioRecorderPlayer;

/** Fichiers dans res/raw (sync-android-sounds.ps1) — noms avec extension pour copyFileRes */
export const AMBIANCE_RAW_FILES = {
  PLUIE: 'pluie.m4a',
  FORÊT: 'foret.m4a',
  CAFÉ: 'cafe.wav',
  FEU: 'feu.wav',
};

const AMBIANCE_REQUIRES = {
  PLUIE: require('../assets/sounds/pluie.m4a'),
  FORÊT: require('../assets/sounds/foret.m4a'),
  CAFÉ: require('../assets/sounds/cafe.wav'),
  FEU: require('../assets/sounds/feu.wav'),
};

const AMBIANCE_DIR = `${RNFS.DocumentDirectoryPath}/ambiances`;

async function ensureAmbianceDir() {
  if (!(await RNFS.exists(AMBIANCE_DIR))) {
    await RNFS.mkdir(AMBIANCE_DIR);
  }
}

/**
 * Retourne un chemin fichier local lisible par MediaPlayer (Android/iOS).
 */
export async function resolveAmbianceFilePath(key) {
  const fileName = AMBIANCE_RAW_FILES[key];
  if (!fileName) throw new Error(`Ambiance inconnue: ${key}`);

  await ensureAmbianceDir();
  const dest = `${AMBIANCE_DIR}/${fileName}`;
  if (await RNFS.exists(dest)) return dest;

  if (Platform.OS === 'android') {
    try {
      await RNFS.copyFileRes(fileName, dest);
      return dest;
    } catch (e) {
      console.warn('[Ambiance] copyFileRes échoué, repli Metro:', e?.message);
    }
  }

  const asset = AMBIANCE_REQUIRES[key];
  const { uri } = Image.resolveAssetSource(asset);
  if (!uri) throw new Error(`URI introuvable pour ${key}`);

  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    const { promise } = RNFS.downloadFile({ fromUrl: uri, toFile: dest });
    const result = await promise;
    if (result.statusCode < 200 || result.statusCode >= 300) {
      throw new Error(`Téléchargement ambiance échoué (${result.statusCode})`);
    }
    return dest;
  }

  const srcPath = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
  await RNFS.copyFile(srcPath, dest);
  return dest;
}

let playbackListener = null;

export async function playAmbianceFile(filePath, volume = 0.5) {
  stopAmbiancePlayback();

  await player.setVolume(Math.max(0, Math.min(1, volume)));
  await player.startPlayer(filePath);

  playbackListener = (e) => {
    if (e.duration > 0 && e.currentPosition >= e.duration - 400) {
      player.seekToPlayer(0).catch(() => {});
    }
  };
  player.addPlayBackListener(playbackListener);
}

export async function stopAmbiancePlayback() {
  try {
    player.removePlayBackListener();
    playbackListener = null;
    await player.stopPlayer();
  } catch (e) {
    console.warn('[Ambiance] stop:', e);
  }
}

export async function setAmbianceVolume(volume) {
  try {
    await player.setVolume(Math.max(0, Math.min(1, volume)));
  } catch (e) {
    console.warn('[Ambiance] volume:', e);
  }
}
