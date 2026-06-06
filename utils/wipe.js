import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

// Répertoires créés par l'app (médias, photos d'intrusion, ambiances copiées).
const APP_DIRS = ['mespensees-media', 'intrusion', 'ambiances'];

/**
 * Efface TOUTES les données locales : préférences/notes chiffrées (AsyncStorage)
 * et fichiers sur disque (médias, intrusion, ambiances).
 * Utilisé par l'auto-destruction et la réinitialisation totale.
 */
export async function wipeAllData() {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.warn('[wipe] AsyncStorage:', e);
  }

  for (const dir of APP_DIRS) {
    const path = `${RNFS.DocumentDirectoryPath}/${dir}`;
    try {
      if (await RNFS.exists(path)) {
        await RNFS.unlink(path);
      }
    } catch (e) {
      console.warn(`[wipe] ${dir}:`, e);
    }
  }

  return true;
}
