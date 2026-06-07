import { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resolveNoteLocation } from '../utils/location';
import {
  encryptAllNotes,
  decryptAllNotes,
  initEncryption,
  rotateEncryptionKey,
  loadStoredKey,
} from '../utils/encryption';
import {
  scheduleCapsuleNotification,
  cancelCapsuleNotification,
} from '../utils/notifications';
import { replanAllSmart, cancelAllSmart } from '../utils/smartNotifications';
import { refreshHomeWidget } from '../utils/widgetBridge';
import {
  safeDate,
  safeDateStr,
  safeTimeStr,
  computeStreak,
} from '../utils/dates';
import { useAuth } from './AuthContext';

const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

function purgeExpiredTrash(items) {
  const now = Date.now();
  return items.filter((n) => {
    if (!n.deletedAt) return true;
    return now - new Date(n.deletedAt).getTime() < TRASH_RETENTION_MS;
  });
}

const NotesContext = createContext();

const DECOY_NOTES = [
  {
    id: 'decoy_1',
    titre: 'Liste de courses',
    contenu:
      'Acheter du pain, du lait, des œufs, du fromage, des fruits et légumes.',
    mood: '😌',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    pinned: false,
    capsule: null,
    wordCount: 18,
  },
  {
    id: 'decoy_2',
    titre: 'Idées pour le jardin',
    contenu:
      'Planter des tomates cette année. Regarder des tutoriels sur YouTube.',
    mood: '✨',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    pinned: false,
    capsule: null,
    wordCount: 14,
  },
  {
    id: 'decoy_3',
    titre: 'Recette tarte aux pommes',
    contenu:
      'Ingrédients : 4 pommes, 200g de farine, 100g de beurre, 2 œufs, 50g de sucre.',
    mood: '🕯️',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    pinned: false,
    capsule: null,
    wordCount: 18,
  },
  {
    id: 'decoy_4',
    titre: 'Rendez-vous semaine prochaine',
    contenu:
      'Lundi : dentiste à 14h. Mercredi : réunion au bureau. Vendredi : dîner chez les parents.',
    mood: '🦅',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    pinned: true,
    capsule: null,
    wordCount: 16,
  },
  {
    id: 'decoy_5',
    titre: 'Films à regarder',
    contenu:
      'Inception, Interstellar, The Revenant, Parasite, Everything Everywhere All at Once.',
    mood: '🌊',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    pinned: false,
    capsule: null,
    wordCount: 12,
  },
];

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [trash, setTrash] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDecoy, setIsDecoy] = useState(false);
  const [customDecoyNotes, setCustomDecoyNotes] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [encryptionReady, setEncryptionReady] = useState(false);
  const [cityFilter, setCityFilter] = useState(null);
  const [streak, setStreak] = useState(0);

  const { isAuthenticated } = useAuth();
  const prevAuthRef = useRef(isAuthenticated);

  useEffect(() => {
    loadNotes();
  }, []);

  // Bug 5 : purge des données déchiffrées de la mémoire dès le verrouillage
  // (manuel, incognito ou auto-lock). Le ré-accès exige PIN ou biométrie.
  useEffect(() => {
    if (prevAuthRef.current && !isAuthenticated) {
      lockNotes();
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    updateStreak();
  }, [notes]);

  useEffect(() => {
    if (loading || isDecoy) return;
    try {
      refreshHomeWidget({
        streak,
      });
    } catch (e) {
      console.warn('Widget refresh error:', e);
    }
  }, [notes, streak, loading, isDecoy]);

  const updateStreak = () => {
    try {
      setStreak(computeStreak(notes));
    } catch (e) {
      console.warn('updateStreak error:', e);
      setStreak(0);
    }
  };

  const getMoodStats = () => {
    const activeNotes = getActiveNotes();
    const moods = ['😌', '✨', '🦅', '🕯️', '🌊'];
    const moodNames = ['Sérénité', 'Productivité', 'Élan', 'Réflexion', 'Flot'];
    const counts = moods.map(
      (m) => activeNotes.filter((n) => n.mood === m).length,
    );
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    return moods
      .map((m, i) => ({
        emoji: m,
        name: moodNames[i],
        pct: Math.round((counts[i] / total) * 100) + '%',
        count: counts[i],
      }))
      .sort((a, b) => b.count - a.count);
  };

  const initWithPin = async (pin) => {
    try {
      const key = await initEncryption(pin);
      if (!key) return false;
      setEncryptionKey(key);
      setEncryptionReady(true);
      await reloadNotesWithKey(key);
      return true;
    } catch (e) {
      console.error('[NotesContext] Error inside initWithPin:', e);
      return false;
    }
  };

  // Change la clé pour `newPin` puis ré-enregistre les notes (en clair en mémoire)
  // chiffrées avec la nouvelle clé. Nécessite une session déjà déchiffrée.
  const reEncryptNotes = async (newPin) => {
    try {
      if (!encryptionKey) return false;
      const newKey = await rotateEncryptionKey(newPin);
      if (!newKey) return false;

      await AsyncStorage.setItem(
        'notes',
        JSON.stringify(encryptAllNotes(notes, newKey)),
      );
      await AsyncStorage.setItem(
        'trash',
        JSON.stringify(encryptAllNotes(trash, newKey)),
      );
      setEncryptionKey(newKey);
      return true;
    } catch (e) {
      console.error('Re-encryption error:', e);
      return false;
    }
  };

  // Vide les données déchiffrées + la clé de la mémoire (verrouillage).
  const lockNotes = () => {
    setNotes([]);
    setTrash([]);
    setEncryptionKey(null);
    setEncryptionReady(false);
  };

  // Recharge la clé déjà stockée et déchiffre (déverrouillage par biométrie).
  const unlockWithStoredKey = async () => {
    try {
      const key = await loadStoredKey();
      if (!key) return false;
      setEncryptionKey(key);
      setEncryptionReady(true);
      await reloadNotesWithKey(key);
      return true;
    } catch (e) {
      console.error('[NotesContext] unlockWithStoredKey:', e);
      return false;
    }
  };

  const reloadNotesWithKey = async (key) => {
    try {
      const data = await AsyncStorage.getItem('notes');
      const tData = await AsyncStorage.getItem('trash');
      let decryptedNotes = [];
      if (data) {
        const stored = JSON.parse(data);
        decryptedNotes = decryptAllNotes(stored, key);
        setNotes(decryptedNotes);
      }
      if (tData) {
        const tStored = JSON.parse(tData);
        setTrash(purgeExpiredTrash(decryptAllNotes(tStored, key)));
      }
      // Au déverrouillage de l'utilisateur réel : (re)planifie les notifs intelligentes.
      replanSmart(decryptedNotes);
    } catch (e) {
      console.error(e);
    }
  };

  // (Re)planifie les notifications intelligentes pour l'utilisateur RÉEL.
  // Jamais en mode leurre : on annule alors tout (confidentialité).
  const replanSmart = (nextNotes) => {
    try {
      if (isDecoy) {
        cancelAllSmart();
        return;
      }
      replanAllSmart(nextNotes, { isDecoy: false });
    } catch (e) {
      console.warn('replanSmart error:', e);
    }
  };

  const loadNotes = async () => {
    try {
      const data = await AsyncStorage.getItem('notes');
      const tData = await AsyncStorage.getItem('trash');
      const decoyData = await AsyncStorage.getItem('decoy_notes');

      if (decoyData) {
        try {
          const parsed = JSON.parse(decoyData);
          if (Array.isArray(parsed) && parsed.length > 0)
            setCustomDecoyNotes(parsed);
        } catch (_) {
          // ignore: fallback aux notes leurres par défaut
        }
      }

      if (data) setNotes(JSON.parse(data));
      if (tData) setTrash(purgeExpiredTrash(JSON.parse(tData)));

      if (encryptionKey) {
        if (data) setNotes(decryptAllNotes(JSON.parse(data), encryptionKey));
        if (tData)
          setTrash(
            purgeExpiredTrash(
              decryptAllNotes(JSON.parse(tData), encryptionKey),
            ),
          );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async (newNotes) => {
    try {
      const toStore = encryptionKey
        ? encryptAllNotes(newNotes, encryptionKey)
        : newNotes;
      await AsyncStorage.setItem('notes', JSON.stringify(toStore));
      setNotes(newNotes);
    } catch (e) {
      console.error(e);
    }
  };

  const saveTrash = async (newTrash) => {
    try {
      const toStore = encryptionKey
        ? encryptAllNotes(newTrash, encryptionKey)
        : newTrash;
      await AsyncStorage.setItem('trash', JSON.stringify(toStore));
      setTrash(newTrash);
    } catch (e) {
      console.error(e);
    }
  };

  const activateDecoyMode = () => {
    setIsDecoy(true);
    // Confidentialité : aucune notification intelligente en mode leurre.
    cancelAllSmart();
  };
  const deactivateDecoyMode = () => setIsDecoy(false);
  // Notes leurres effectivement affichées : personnalisées si présentes, sinon défaut.
  const effectiveDecoyNotes =
    customDecoyNotes && customDecoyNotes.length > 0
      ? customDecoyNotes
      : DECOY_NOTES;
  const getActiveNotes = () => (isDecoy ? effectiveDecoyNotes : notes);
  const getTrash = () => (isDecoy ? [] : trash);

  // Persiste les notes leurres personnalisées (clé `decoy_notes`).
  // `null`/[] => réinitialise au comportement par défaut (DECOY_NOTES).
  const setDecoyNotes = async (newDecoyNotes) => {
    try {
      if (!newDecoyNotes || newDecoyNotes.length === 0) {
        setCustomDecoyNotes(null);
        await AsyncStorage.removeItem('decoy_notes');
        return;
      }
      setCustomDecoyNotes(newDecoyNotes);
      await AsyncStorage.setItem('decoy_notes', JSON.stringify(newDecoyNotes));
    } catch (e) {
      console.error('setDecoyNotes error:', e);
    }
  };

  const addNote = async ({
    titre,
    contenu,
    mood,
    ambiance,
    location: manualLocation,
    capsule,
    media = [],
    bgImage = null,
  }) => {
    if (isDecoy) return null;

    let finalLocation = 'LOMÉ, TG';
    try {
      finalLocation = await resolveNoteLocation(manualLocation);
    } catch (e) {
      console.warn('Location error:', e);
      if (manualLocation) finalLocation = manualLocation;
    }

    const newNote = {
      id: Date.now().toString(),
      titre: titre || 'Sans titre',
      contenu,
      mood,
      ambiance,
      location: finalLocation,
      date: new Date().toISOString(),
      pinned: false,
      capsule,
      media,
      bgImage,
      wordCount: contenu.trim() === '' ? 0 : contenu.trim().split(/\s+/).length,
    };

    if (capsule) {
      await scheduleCapsuleNotification(
        new Date(capsule),
        titre || 'Une pensée scellée',
        newNote.id,
      );
    }

    const nextNotes = [newNote, ...notes];
    await saveNotes(nextNotes);
    replanSmart(nextNotes);
    return newNote;
  };

  const updateNote = async (id, changes) => {
    if (isDecoy) return;
    const existing = notes.find((n) => n.id === id);
    const updated = notes.map((n) => (n.id === id ? { ...n, ...changes } : n));
    await saveNotes(updated);
    replanSmart(updated);

    if (changes.capsule && changes.capsule !== existing?.capsule) {
      await scheduleCapsuleNotification(
        new Date(changes.capsule),
        changes.titre || existing?.titre || 'Une pensée scellée',
        id,
      );
    }
    if (changes.capsule === null && existing?.capsule) {
      await cancelCapsuleNotification(id);
    }
  };

  const deleteNote = async (id) => {
    if (isDecoy) return;
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const deletedNote = { ...note, deletedAt: new Date().toISOString() };
    const newTrash = purgeExpiredTrash([deletedNote, ...trash]);
    const newNotes = notes.filter((n) => n.id !== id);
    await saveTrash(newTrash);
    await saveNotes(newNotes);
    if (note.capsule) await cancelCapsuleNotification(id);
    replanSmart(newNotes);
  };

  const restoreNote = async (id) => {
    if (isDecoy) return;
    const note = trash.find((n) => n.id === id);
    if (!note) return;
    const { deletedAt, ...restored } = note;
    await saveNotes([restored, ...notes]);
    await saveTrash(trash.filter((n) => n.id !== id));
  };

  const restoreSelected = async (ids) => {
    if (isDecoy) return;
    const toRestore = trash.filter((n) => ids.includes(n.id));
    const cleaned = toRestore.map(({ deletedAt, ...note }) => note);
    await saveNotes([...cleaned, ...notes]);
    await saveTrash(trash.filter((n) => !ids.includes(n.id)));
  };

  const deleteForever = async (id) => {
    if (isDecoy) return;
    await saveTrash(trash.filter((n) => n.id !== id));
  };

  const deleteSelectedForever = async (ids) => {
    if (isDecoy) return;
    await saveTrash(trash.filter((n) => !ids.includes(n.id)));
  };

  const emptyTrash = async () => {
    if (isDecoy) return;
    await saveTrash([]);
  };

  const togglePin = async (id) => {
    if (isDecoy) return;
    await saveNotes(
      notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    );
  };

  const sealCapsule = async (id, date) => {
    if (isDecoy) return;
    await saveNotes(
      notes.map((n) => (n.id === id ? { ...n, capsule: date } : n)),
    );
  };

  const unsealCapsule = async (ids) => {
    if (isDecoy) return;
    const idArray = Array.isArray(ids) ? ids : [ids];
    await saveNotes(
      notes.map((n) => (idArray.includes(n.id) ? { ...n, capsule: null } : n)),
    );
  };

  const getTotalWords = () =>
    getActiveNotes().reduce((sum, n) => sum + (n.wordCount || 0), 0);

  const getVisibleNotes = () => {
    const active = getActiveNotes();
    if (isDecoy) return active;
    const now = new Date();
    return active.filter((n) => !n.capsule || new Date(n.capsule) <= now);
  };

  const getSealedNotes = () => {
    if (isDecoy) return [];
    const now = new Date();
    return notes.filter((n) => n.capsule && new Date(n.capsule) > now);
  };

  const getTimeUntilOpen = (capsuleDate) => {
    const diff = new Date(capsuleDate) - new Date();
    if (diff <= 0) return 'Prête à ouvrir';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 365) return `${Math.floor(days / 365)} an(s)`;
    if (days > 30) return `${Math.floor(days / 30)} mois`;
    if (days > 0) return `${days} jour(s)`;
    return `${Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h`;
  };

  const filterByCity = (city) => {
    setCityFilter(city);
  };

  const groupNotesByDate = () => {
    const visible = getVisibleNotes();
    let filtered = visible;
    if (cityFilter) {
      filtered = visible.filter((n) =>
        n.location?.toLowerCase().includes(cityFilter.toLowerCase()),
      );
    }

    const pinned = filtered.filter((n) => n.pinned);
    const unpinned = filtered.filter((n) => !n.pinned);

    const groups = {};
    if (pinned.length > 0) {
      groups['ÉPINGLÉES'] = pinned;
    }

    unpinned.forEach((note) => {
      try {
        const d = safeDate(note?.date);
        if (!d) {
          const label = 'DATE INCONNUE';
          if (!groups[label]) groups[label] = [];
          groups[label].push(note);
          return;
        }
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        let label;
        if (d.toDateString() === today.toDateString()) label = "AUJOURD'HUI";
        else if (d.toDateString() === yesterday.toDateString()) label = 'HIER';
        else
          label = d
            .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
            .toUpperCase();
        if (!groups[label]) groups[label] = [];
        groups[label].push(note);
      } catch (_) {
        const label = 'DATE INCONNUE';
        if (!groups[label]) groups[label] = [];
        groups[label].push(note);
      }
    });
    return groups;
  };

  const formatDate = (isoDate) => safeDateStr(isoDate, 'DATE INCONNUE');

  const formatTime = (isoDate) => safeTimeStr(isoDate, '--:--');

  return (
    <NotesContext.Provider
      value={{
        notes,
        trash: getTrash(),
        loading,
        isDecoy,
        encryptionKey,
        encryptionReady,
        addNote,
        updateNote,
        deleteNote,
        restoreNote,
        restoreSelected,
        deleteForever,
        deleteSelectedForever,
        emptyTrash,
        togglePin,
        sealCapsule,
        unsealCapsule,
        saveNotes,
        getMoodStats,
        getTotalWords,
        getVisibleNotes,
        groupNotesByDate,
        getSealedNotes,
        getTimeUntilOpen,
        formatDate,
        formatTime,
        activateDecoyMode,
        deactivateDecoyMode,
        getActiveNotes,
        getTrash,
        decoyNotes: effectiveDecoyNotes,
        setDecoyNotes,
        initWithPin,
        reEncryptNotes,
        lockNotes,
        unlockWithStoredKey,
        cityFilter,
        filterByCity,
        streak,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);
