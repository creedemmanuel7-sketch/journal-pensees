import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const MEDIA_DIR = `${RNFS.DocumentDirectoryPath}/mespensees-media`;

async function ensureMediaDir() {
  const exists = await RNFS.exists(MEDIA_DIR);
  if (!exists) await RNFS.mkdir(MEDIA_DIR);
}

function extensionForMedia(item) {
  if (item.type === 'audio') return '.m4a';
  if (item.type === 'video') return '.mp4';
  const uri = item.uri || '';
  const match = uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  if (match) return `.${match[1].toLowerCase()}`;
  return '.jpg';
}

function normalizeUri(uri) {
  if (!uri) return uri;
  if (uri.startsWith('file://')) return uri;
  if (uri.startsWith('/')) return `file://${uri}`;
  return uri;
}

function sourcePath(uri) {
  if (!uri) return null;
  if (uri.startsWith('file://')) return uri.replace('file://', '');
  if (uri.startsWith('content://')) return uri;
  return uri;
}

/**
 * Copie les médias vers le stockage persistant de l'app pour éviter la perte d'URI temporaires.
 */
export async function persistMediaList(mediaList = []) {
  if (!mediaList.length) return [];
  await ensureMediaDir();

  const persisted = [];
  for (const item of mediaList) {
    if (!item?.uri) {
      persisted.push(item);
      continue;
    }
    if (item.persistent && item.uri.includes('mespensees-media')) {
      persisted.push(item);
      continue;
    }

    const ext = extensionForMedia(item);
    const dest = `${MEDIA_DIR}/${item.id}${ext}`;
    const src = sourcePath(item.uri);

    try {
      if (src?.startsWith('content://')) {
        await RNFS.copyFile(src, dest);
      } else if (src && (await RNFS.exists(src))) {
        if (src !== dest) await RNFS.copyFile(src, dest);
      } else {
        persisted.push(item);
        continue;
      }
      persisted.push({
        ...item,
        uri: normalizeUri(Platform.OS === 'android' ? `file://${dest}` : dest),
        persistent: true,
      });
    } catch (e) {
      console.warn('persistMediaList:', e);
      persisted.push(item);
    }
  }
  return persisted;
}

export async function persistImageUri(uri, id) {
  const [result] = await persistMediaList([{ id, uri, type: 'image' }]);
  return result?.uri || uri;
}
