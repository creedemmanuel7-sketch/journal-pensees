import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const INTRUSION_DIR = `${RNFS.DocumentDirectoryPath}/intrusion`;

export async function persistIntrusionPhoto(uri) {
  if (!uri) return null;
  try {
    const src = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
    await RNFS.mkdir(INTRUSION_DIR);
    const dest = `${INTRUSION_DIR}/intrusion_${Date.now()}.jpg`;
    await RNFS.copyFile(src, dest);
    return Platform.OS === 'android' ? `file://${dest}` : dest;
  } catch (e) {
    console.warn('persistIntrusionPhoto:', e);
    return uri;
  }
}
