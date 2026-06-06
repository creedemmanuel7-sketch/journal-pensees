import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_STORAGE = 'encryption_key';
const PIN_HASH_ITERATIONS = 10000;

// ── Hachage du code PIN (jamais stocké en clair) ──

/** Détecte un PIN stocké en clair (ancien format, avant hachage). */
export const isLegacyPin = (stored) =>
  !!stored && typeof stored === 'string' && !stored.startsWith('{');

/** Produit une enveloppe JSON { v, hash, salt } à stocker à la place du PIN brut. */
export const hashPin = (pin) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const hash = CryptoJS.PBKDF2(pin, salt, {
    keySize: 256 / 32,
    iterations: PIN_HASH_ITERATIONS,
  }).toString();
  return JSON.stringify({ v: 1, hash, salt: salt.toString() });
};

/** Vérifie un PIN saisi contre la valeur stockée (gère l'ancien format en clair). */
export const verifyPinHash = (pin, stored) => {
  if (pin == null || !stored || typeof stored !== 'string') return false;
  if (isLegacyPin(stored)) return pin === stored;
  try {
    const { hash, salt } = JSON.parse(stored);
    const derived = CryptoJS.PBKDF2(pin, CryptoJS.enc.Hex.parse(salt), {
      keySize: 256 / 32,
      iterations: PIN_HASH_ITERATIONS,
    }).toString();
    return derived === hash;
  } catch (e) {
    return false;
  }
};

export const generateKey = (pin) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = CryptoJS.PBKDF2(pin, salt, {
    keySize: 256 / 32,
    iterations: 5000,
  });
  return { key: key.toString(), salt: salt.toString() };
};

export const saveEncryptionKey = async (pin) => {
  try {
    const { key, salt } = generateKey(pin);
    await AsyncStorage.setItem(KEY_STORAGE, JSON.stringify({ key, salt }));
    return key;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const loadEncryptionKey = async (pin) => {
  try {
    const stored = await AsyncStorage.getItem(KEY_STORAGE);
    if (!stored) return null;
    const { key, salt } = JSON.parse(stored);
    const derived = CryptoJS.PBKDF2(pin, CryptoJS.enc.Hex.parse(salt), {
      keySize: 256 / 32,
      iterations: 5000,
    });
    return derived.toString() === key ? key : null;
  } catch (e) {
    return null;
  }
};

export const encryptNote = (note, key) => {
  try {
    if (!key || !note) return note;
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(note),
      key,
    ).toString();
    return { encrypted: true, data: encrypted, id: note.id, date: note.date };
  } catch (e) {
    console.error(e);
    return note;
  }
};

export const decryptNote = (encryptedNote, key) => {
  try {
    if (!encryptedNote?.encrypted || !key) return encryptedNote;
    const bytes = CryptoJS.AES.decrypt(encryptedNote.data, key);
    const raw = bytes.toString(CryptoJS.enc.Utf8);
    if (!raw || raw.trim().length === 0) return null;
    const decrypted = JSON.parse(raw);
    // Ensure essential fields exist
    if (decrypted && !decrypted.date) {
      decrypted.date = encryptedNote.date || new Date().toISOString();
    }
    if (decrypted && !decrypted.id) {
      decrypted.id = encryptedNote.id || Date.now().toString();
    }
    return decrypted;
  } catch (e) {
    console.error('decryptNote error:', e);
    return null;
  }
};

export const encryptAllNotes = (notes, key) => {
  if (!key) return notes;
  return notes.map((note) => encryptNote(note, key));
};

export const decryptAllNotes = (notes, key) => {
  if (!key) return notes;
  return notes
    .map((note) => {
      if (note?.encrypted) return decryptNote(note, key);
      return note;
    })
    .filter(Boolean);
};

export const reEncryptAllNotes = (notes, oldKey, newKey) => {
  if (!oldKey || !newKey) return notes;
  const decrypted = decryptAllNotes(notes, oldKey);
  return encryptAllNotes(decrypted, newKey);
};

export const initEncryption = async (pin) => {
  try {
    const stored = await AsyncStorage.getItem(KEY_STORAGE);
    if (!stored) {
      const key = await saveEncryptionKey(pin);
      return key;
    }
    return await loadEncryptionKey(pin);
  } catch (e) {
    return null;
  }
};

/**
 * Génère une nouvelle clé/sel pour `newPin` et écrase la clé stockée.
 * Utilisé lors d'un changement de PIN : il faut ensuite re-chiffrer les notes
 * (en clair en mémoire) avec la clé retournée.
 */
export const rotateEncryptionKey = async (newPin) => saveEncryptionKey(newPin);

/** Charge la clé de chiffrement déjà enregistrée, sans validation par PIN. */
export const loadStoredKey = async () => {
  try {
    const stored = await AsyncStorage.getItem(KEY_STORAGE);
    if (!stored) return null;
    const { key } = JSON.parse(stored);
    return key || null;
  } catch (e) {
    return null;
  }
};
