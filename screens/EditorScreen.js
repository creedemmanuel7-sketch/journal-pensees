import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppFonts, FONT_DISPLAY_ITALIC } from '../utils/fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNotes } from '../context/NotesContext';
import { useSound } from '../context/SoundContext';
import { useAuth } from '../context/AuthContext';
import { useScreenTutorial, useTutorialRef } from '../context/TutorialContext';
import { resolveNoteLocation } from '../utils/location';
import { persistMediaList, persistImageUri } from '../utils/mediaStorage';
import { WRITING_TEMPLATES } from '../utils/writingTemplates';
import {
  startDictation,
  stopDictation,
  isVoiceAvailable,
} from '../utils/voiceDictation';
import Slider from '@react-native-community/slider';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AudioNoteCard from '../components/editor/AudioNoteCard';
import MoodSelector from '../components/editor/MoodSelector';
import AmbiancePill from '../components/editor/AmbiancePill';
import RecordingOverlay from '../components/editor/RecordingOverlay';
import NoteLockOverlay from '../components/editor/NoteLockOverlay';
import AddMenuModal from '../components/editor/AddMenuModal';
import CapsuleModal from '../components/editor/CapsuleModal';
import TemplatesModal from '../components/editor/TemplatesModal';
import DeleteConfirmModal from '../components/editor/DeleteConfirmModal';

const AMBIANCES = ['PLUIE', 'FORÊT', 'CAFÉ', 'FEU', 'SILENCE'];
const MOODS = ['😌', '✨', '🦅', '🕯️', '🌊'];
const CAPSULE_OPTIONS = ['+1 semaine', '+1 mois', '+6 mois', '+1 an', '+5 ans'];
const CAPSULE_DELAYS = {
  '+1 semaine': 7,
  '+1 mois': 30,
  '+6 mois': 180,
  '+1 an': 365,
  '+5 ans': 1825,
};

export default function EditorScreen({ navigation, route }) {
  const { theme, accent } = useTheme();
  const { addNote, updateNote, deleteNote, getActiveNotes } = useNotes();
  const { authenticateWithPin, authenticateWithBiometric, isDecoyMode } =
    useAuth();
  const { playAmbiance, stopSound, isPlaying, volume, changeVolume } =
    useSound();
  const { fontsLoaded } = useAppFonts();

  // Lecteur audio mutualisé (singleton AudioRecorderPlayer + suivi position/durée)
  const {
    playerRef: audioRecorderRef,
    playingAudioId,
    playbackPosition,
    playbackDuration,
    handlePlayAudio,
  } = useAudioPlayer();

  const noteId = route?.params?.noteId;
  const allNotes = getActiveNotes();
  const existingNote = noteId ? allNotes.find((n) => n.id === noteId) : null;

  const [titre, setTitre] = useState(existingNote?.titre || '');
  const [contenu, setContenu] = useState(existingNote?.contenu || '');
  const [ambianceIndex, setAmbianceIndex] = useState(
    existingNote ? Math.max(0, AMBIANCES.indexOf(existingNote.ambiance)) : 0,
  );
  const [moodIndex, setMoodIndex] = useState(
    existingNote ? Math.max(0, MOODS.indexOf(existingNote.mood)) : 0,
  );
  const [fontSize, setFontSize] = useState(15);
  const [lineHeight, setLineHeight] = useState(28);
  const [showTT, setShowTT] = useState(false);
  const [showCapsule, setShowCapsule] = useState(false);
  const [capsuleSelected, setCapsuleSelected] = useState(null);
  const [capsuleSealed, setCapsuleSealed] = useState(!!existingNote?.capsule);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [media, setMedia] = useState(existingNote?.media || []);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [bgImage, setBgImage] = useState(existingNote?.bgImage || null);
  const [locationLabel, setLocationLabel] = useState(
    existingNote?.location || null,
  );
  const [showTemplates, setShowTemplates] = useState(false);
  const [locked, setLocked] = useState(!!existingNote?.locked);
  const [noteUnlocked, setNoteUnlocked] = useState(!existingNote?.locked);
  const [lockPin, setLockPin] = useState('');
  const [dictating, setDictating] = useState(false);
  const [voiceSupported] = useState(isVoiceAvailable());

  // New state variables for premium widgets, spacial layouts, and hints
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSoundTooltip, setShowSoundTooltip] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');

  // Tutoriel contextuel de l'éditeur
  const titreTargetRef = useTutorialRef('editor-titre');
  const contenuTargetRef = useTutorialRef('editor-contenu');
  const addMenuTargetRef = useTutorialRef('editor-add');
  const moodTargetRef = useTutorialRef('editor-mood');
  const ambianceTargetRef = useTutorialRef('editor-ambiance');
  const saveTargetRef = useTutorialRef('editor-save');
  const TUTORIAL_STEPS = [
    {
      targetId: 'editor-titre',
      title: 'Le titre',
      description: 'Donnez un titre à votre pensée — ou laissez-le vide.',
    },
    {
      targetId: 'editor-contenu',
      title: 'Votre texte',
      description:
        'Écrivez librement. Tout est chiffré localement sur votre appareil.',
    },
    {
      targetId: 'editor-add',
      title: 'Le menu +',
      description:
        'Ajoutez photos et fonds, dictée vocale, enregistrement audio, modèles, capsule temporelle et verrou de note.',
    },
    {
      targetId: 'editor-mood',
      title: 'Votre humeur',
      description: 'Associez une humeur à cette pensée pour vos statistiques.',
    },
    {
      targetId: 'editor-ambiance',
      title: 'Ambiance sonore',
      description: 'Écrivez en musique : pluie, forêt, café, feu ou silence.',
    },
    {
      targetId: 'editor-save',
      title: 'Sauvegarder',
      description:
        'Touchez « Terminer » pour enregistrer votre pensée en toute sécurité.',
    },
  ];
  useScreenTutorial('editor', TUTORIAL_STEPS, {
    enabled: !isDecoyMode && noteUnlocked,
  });

  useEffect(() => {
    if (!existingNote?.location) {
      resolveNoteLocation()
        .then(setLocationLabel)
        .catch(() => setLocationLabel('LOMÉ, TG'));
    }
    // Check if user has seen sound hint
    AsyncStorage.getItem('has_seen_sound_hint').then((val) => {
      if (!val) {
        setShowSoundTooltip(true);
      }
    });
  }, []);

  useEffect(() => {
    if (
      (route?.params?.record === true || route?.params?.record === 'true') &&
      noteUnlocked
    ) {
      const timer = setTimeout(() => {
        startRecording();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [route?.params?.record, noteUnlocked]);

  useEffect(() => {
    return () => {
      stopDictation().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (lockPin.length === 4 && locked && !noteUnlocked) {
      unlockNote();
    }
  }, [lockPin]);

  const wordCount =
    contenu.trim() === '' ? 0 : contenu.trim().split(/\s+/).length;

  const applyTemplate = (template) => {
    if (template.titre) setTitre(template.titre);
    setContenu(template.contenu);
    setShowTemplates(false);
  };

  const unlockNote = async () => {
    if (lockPin.length === 4) {
      const result = await authenticateWithPin(lockPin);
      if (result.success && !result.decoy) {
        setNoteUnlocked(true);
        setLockPin('');
        return;
      }
    }
    const bio = await authenticateWithBiometric();
    if (bio.success) setNoteUnlocked(true);
  };

  const toggleDictation = async () => {
    if (dictating) {
      await stopDictation();
      setDictating(false);
      return;
    }
    setDictating(true);
    const started = await startDictation(
      (text) => setContenu((prev) => (prev ? `${prev} ${text}` : text)),
      (err) => {
        setDictating(false);
        Alert.alert(
          'Dictée',
          err?.message || 'Impossible de démarrer la reconnaissance vocale.',
        );
      },
    );
    if (!started) setDictating(false);
  };

  // Vérifie le support hors ligne avant d'activer la dictée vocale
  const handleDictationOption = () => {
    if (!voiceSupported) {
      Alert.alert(
        'Dictée vocale hors ligne',
        "La dictée vocale nécessite le service de reconnaissance vocale Google installé sur votre appareil.\n\nPour l'activer, vérifiez que l'application 'Reconnaissance vocale de Google' est installée et activée dans les paramètres de Langue et Saisie de votre système.",
        [{ text: 'Compris' }],
      );
    } else {
      toggleDictation();
    }
  };

  const cycleAmbiance = async () => {
    const nextIndex = (ambianceIndex + 1) % AMBIANCES.length;
    setAmbianceIndex(nextIndex);
    const nextAmbiance = AMBIANCES[nextIndex];
    if (nextAmbiance === 'SILENCE') {
      await stopSound();
    } else {
      await playAmbiance(nextAmbiance);
    }
  };

  const sealCapsule = (option) => {
    setCapsuleSelected(option);
    setCapsuleSealed(true);
    setShowCapsule(false);
  };

  const getCapsuleDate = (option) => {
    const days = CAPSULE_DELAYS[option] || 365;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  };

  const handleTerminer = async () => {
    if (!titre.trim() && !contenu.trim()) {
      setSaving(false);
      navigation.goBack();
      return;
    }

    setSaving(true);
    await stopSound();
    await audioRecorderRef.current.stopPlayer().catch(() => {});
    try {
      const persistedMedia = await persistMediaList(media);
      const persistedBg = bgImage
        ? await persistImageUri(bgImage, `bg-${existingNote?.id || Date.now()}`)
        : null;
      const capsuleDate =
        capsuleSealed && capsuleSelected
          ? getCapsuleDate(capsuleSelected)
          : existingNote?.capsule || null;
      const payload = {
        titre: titre || 'Sans titre',
        contenu,
        mood: MOODS[moodIndex],
        ambiance: AMBIANCES[ambianceIndex],
        capsule: capsuleDate,
        wordCount,
        media: persistedMedia,
        bgImage: persistedBg,
        locked,
      };
      if (existingNote) {
        await updateNote(existingNote.id, payload);
      } else {
        await addNote({
          ...payload,
          location: locationLabel,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
      navigation.goBack();
    }
  };

  const handleDelete = async () => {
    if (existingNote) {
      await deleteNote(existingNote.id);
      navigation.goBack();
    }
  };

  // Media selection restricts strictly to Photos only (Removing Video to preserve app speed and size)
  const pickMedia = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (!result.didCancel && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        setMedia([
          ...media,
          {
            id: Date.now().toString(),
            uri: asset.uri,
            type: 'image',
            size: asset.fileSize,
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to pick media', err);
    }
  };

  const pickBgImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });
      if (!result.didCancel && result.assets?.[0]?.uri) {
        setBgImage(result.assets[0].uri);
      }
    } catch (e) {
      console.error('BG Pick Error:', e);
    }
  };

  const requestAudioPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permission Microphone',
          message:
            "Mes Pensées a besoin d'accéder à votre micro pour enregistrer des vocaux.",
          buttonPositive: 'Autoriser',
          buttonNegative: 'Refuser',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Audio permission request failed:', err);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      if (isRecording) return;
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission refusée',
          "Impossible d'enregistrer sans accès au microphone.",
        );
        return;
      }
      const path = Platform.select({
        ios: `${RNFS.DocumentDirectoryPath}/recording-${Date.now()}.m4a`,
        android: `${RNFS.CachesDirectoryPath}/recording-${Date.now()}.m4a`,
      });
      const player = audioRecorderRef.current;
      player.setSubscriptionDuration?.(0.2);
      const recordedPath = await player.startRecorder(path);

      setRecording(recordedPath || path);
      setIsRecording(true);
      setRecordTime('00:00');

      player.addRecordBackListener((e) => {
        const sec = Math.floor(e.currentPosition / 1000);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        setRecordTime(
          `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
        );
      });
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert(
        'Enregistrement vocal',
        err?.message ||
          'Impossible de démarrer l’enregistrement. Réinstallez l’APK release si le problème persiste.',
      );
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    audioRecorderRef.current.removeRecordBackListener();
    if (!recording) return;
    try {
      const uri = await audioRecorderRef.current.stopRecorder();
      setMedia([
        ...media,
        {
          id: Date.now().toString(),
          uri,
          type: 'audio',
        },
      ]);
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      setRecording(null);
    }
  };

  const removeMedia = (id) => {
    setMedia(media.filter((m) => m.id !== id));
  };

  const dismissSoundTooltip = async () => {
    setShowSoundTooltip(false);
    await AsyncStorage.setItem('has_seen_sound_hint', 'true');
  };

  const now = new Date();
  const dateStr = now
    .toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();

  // Filter photo images for horizontal picker list
  const photosMedia = media.filter((m) => m.type === 'image');
  // Filter audio vocaux for custom player cards
  const audioMedia = media.filter((m) => m.type === 'audio');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <View style={styles.chiffreBadge}>
            <View
              style={[styles.chiffreDot, { backgroundColor: accent.teal }]}
            />
            <Text style={[styles.chiffreText, { color: accent.teal }]}>
              CHIFFRÉ EN LOCAL
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            {capsuleSealed && (
              <View
                style={[
                  styles.capsuleBadge,
                  {
                    backgroundColor: accent.light,
                    borderColor: accent.teal + '50',
                  },
                ]}
              >
                <Text style={[styles.capsuleBadgeText, { color: accent.teal }]}>
                  ⏳ {capsuleSelected}
                </Text>
              </View>
            )}
            <TouchableOpacity
              ref={saveTargetRef}
              style={[
                styles.terminerBtn,
                { backgroundColor: saving ? theme.bg4 : accent.primary },
              ]}
              onPress={handleTerminer}
              disabled={saving}
            >
              <Text
                style={[
                  styles.terminerText,
                  { color: saving ? theme.text3 : theme.bg },
                ]}
              >
                {saving ? '...' : 'Terminer'}
              </Text>
            </TouchableOpacity>
            {existingNote && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => setShowDeleteConfirm(true)}
              >
                <Text style={{ fontSize: 18 }}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Zone d'écriture */}
        <View style={{ flex: 1 }}>
          {locked && !noteUnlocked && (
            <NoteLockOverlay
              lockPin={lockPin}
              setLockPin={setLockPin}
              onUnlock={unlockNote}
              theme={theme}
              accent={accent}
            />
          )}
          {bgImage && (
            <>
              <Image
                source={{ uri: bgImage }}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: 'rgba(0,0,0,0.45)' },
                ]}
              />
            </>
          )}

          <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
            <TextInput
              ref={titreTargetRef}
              style={[
                styles.titreInput,
                { color: accent.primary + 'B0' },
                fontsLoaded && { fontFamily: FONT_DISPLAY_ITALIC },
              ]}
              placeholder="Titre de la pensée..."
              placeholderTextColor={accent.primary + '40'}
              value={titre}
              onChangeText={setTitre}
              multiline={false}
            />
            <Text style={[styles.dateLoc, { color: theme.text4 }]}>
              {dateStr} • 📍{' '}
              {locationLabel || existingNote?.location || 'LOMÉ, TG'}
            </Text>

            <TextInput
              ref={contenuTargetRef}
              style={[
                styles.contenuInput,
                { fontSize, lineHeight, color: theme.text2 },
              ]}
              placeholder="Commencez à écrire votre vérité..."
              placeholderTextColor={theme.text4}
              value={contenu}
              onChangeText={setContenu}
              multiline={true}
              textAlignVertical="top"
            />

            {/* Premium Interactive Audio Player Widgets */}
            {audioMedia.length > 0 && (
              <View style={styles.audioPlayersContainer}>
                {audioMedia.map((m) => (
                  <AudioNoteCard
                    key={m.id}
                    item={m}
                    isPlaying={playingAudioId === m.id}
                    playbackPosition={playbackPosition}
                    playbackDuration={playbackDuration}
                    onPlayPause={handlePlayAudio}
                    onDelete={removeMedia}
                    theme={theme}
                    accent={accent}
                  />
                ))}
              </View>
            )}

            {/* Photos horizontally scrollable picker */}
            {photosMedia.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.mediaList}
              >
                {photosMedia.map((m) => (
                  <View key={m.id} style={styles.mediaItem}>
                    <Image
                      source={{ uri: m.uri }}
                      style={styles.mediaThumbnail}
                    />
                    <TouchableOpacity
                      style={styles.removeMediaBtn}
                      onPress={() => removeMedia(m.id)}
                    >
                      <Text style={{ color: '#fff', fontSize: 10 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={{ height: 200 }} />
          </ScrollView>
        </View>

        {/* Panneau typographie */}
        {showTT && (
          <View
            style={[
              styles.ttPanel,
              { backgroundColor: theme.bg3, borderTopColor: theme.border },
            ]}
          >
            <Text style={[styles.ttPanelLabel, { color: theme.text3 }]}>
              TAILLE DU TEXTE
            </Text>
            <View style={styles.ttRow}>
              <TouchableOpacity
                style={[
                  styles.ttBtn,
                  { backgroundColor: theme.bg4, borderColor: theme.border },
                ]}
                onPress={() => setFontSize((f) => Math.max(12, f - 1))}
              >
                <Text style={[styles.ttBtnText, { color: theme.text }]}>
                  A−
                </Text>
              </TouchableOpacity>
              <Text style={[styles.ttValue, { color: accent.primary }]}>
                {fontSize}px
              </Text>
              <TouchableOpacity
                style={[
                  styles.ttBtn,
                  { backgroundColor: theme.bg4, borderColor: theme.border },
                ]}
                onPress={() => setFontSize((f) => Math.min(24, f + 1))}
              >
                <Text style={[styles.ttBtnText, { color: theme.text }]}>
                  A+
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.ttPanelLabel,
                { color: theme.text3, marginTop: 12 },
              ]}
            >
              INTERLIGNE
            </Text>
            <View style={styles.ttRow}>
              <TouchableOpacity
                style={[
                  styles.ttBtn,
                  { backgroundColor: theme.bg4, borderColor: theme.border },
                ]}
                onPress={() => setLineHeight((l) => Math.max(20, l - 2))}
              >
                <Text style={[styles.ttBtnText, { color: theme.text }]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.ttValue, { color: accent.primary }]}>
                {lineHeight}px
              </Text>
              <TouchableOpacity
                style={[
                  styles.ttBtn,
                  { backgroundColor: theme.bg4, borderColor: theme.border },
                ]}
                onPress={() => setLineHeight((l) => Math.min(48, l + 2))}
              >
                <Text style={[styles.ttBtnText, { color: theme.text }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Toolbar */}
        <View
          style={[
            styles.toolbar,
            { backgroundColor: theme.bg3, borderTopColor: theme.border },
          ]}
        >
          {/* Row 1: Word Count & Mood Selector */}
          <View style={styles.toolbarRow1}>
            <View style={styles.wordCountWrap}>
              <Text style={[styles.wordCountNum, { color: theme.text }]}>
                {wordCount}
              </Text>
              <Text style={[styles.wordCountLabel, { color: theme.text3 }]}>
                MOTS
              </Text>
            </View>
            <View ref={moodTargetRef} collapsable={false} style={{ flex: 1 }}>
              <MoodSelector
                moods={MOODS}
                selectedIndex={moodIndex}
                onSelect={setMoodIndex}
                theme={theme}
                accent={accent}
              />
            </View>
          </View>

          {/* Row 2: Refactored & Spacious primary toolbar */}
          <View style={styles.toolbarRow2}>
            {/* The '+' button for secondary tools, freeing massive spacing */}
            <TouchableOpacity
              ref={addMenuTargetRef}
              style={[
                styles.toolBtn,
                {
                  backgroundColor: theme.bg4,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setShowAddMenu(true)}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: accent.primary,
                  fontWeight: 'bold',
                }}
              >
                ＋
              </Text>
            </TouchableOpacity>

            {/* Typography TT */}
            <TouchableOpacity
              style={[
                styles.toolBtn,
                showTT && { backgroundColor: accent.light, borderRadius: 10 },
              ]}
              onPress={() => setShowTT(!showTT)}
            >
              <Text
                style={[
                  styles.ttText,
                  { color: showTT ? accent.primary : theme.text2 },
                ]}
              >
                TT
              </Text>
            </TouchableOpacity>

            {/* Lock note */}
            <TouchableOpacity
              style={[
                styles.toolBtn,
                locked && { backgroundColor: accent.light, borderRadius: 10 },
              ]}
              onPress={() => setLocked((v) => !v)}
            >
              <Text style={{ fontSize: 16 }}>{locked ? '🔒' : '🔓'}</Text>
            </TouchableOpacity>

            {/* If dictating, show active dictation stop button */}
            {dictating && (
              <TouchableOpacity
                style={[
                  styles.toolBtn,
                  {
                    backgroundColor: 'rgba(229,85,85,0.2)',
                    borderRadius: 10,
                    width: 80,
                    flexDirection: 'row',
                    gap: 4,
                    paddingHorizontal: 8,
                  },
                ]}
                onPress={toggleDictation}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 14, color: '#e55' }}>🗣️ Stop</Text>
              </TouchableOpacity>
            )}

            {/* Ambiance Pill with floating Onboarding Tooltip hint */}
            <View
              ref={ambianceTargetRef}
              collapsable={false}
              style={{ flex: 1 }}
            >
              <AmbiancePill
                label={AMBIANCES[ambianceIndex]}
                isPlaying={isPlaying}
                onPress={cycleAmbiance}
                showTooltip={showSoundTooltip}
                onDismissTooltip={dismissSoundTooltip}
                theme={theme}
                accent={accent}
              />
            </View>
          </View>

          {/* Slider volume */}
          {isPlaying && (
            <View
              style={[
                styles.volumeRow,
                { backgroundColor: theme.bg4, borderColor: theme.border },
              ]}
            >
              <Text style={{ fontSize: 12 }}>🔈</Text>
              <Slider
                style={{ flex: 1, height: 30 }}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={changeVolume}
                minimumTrackTintColor={accent.primary}
                maximumTrackTintColor={theme.border}
                thumbTintColor={accent.primary}
                step={0.05}
              />
              <Text style={{ fontSize: 12 }}>🔊</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Stunning Live Pulse Recording Overlay (100% visible visual feedback) */}
      <RecordingOverlay
        visible={isRecording}
        recordTime={recordTime}
        onStop={stopRecording}
        theme={theme}
      />

      {/* Modal Ajout (Plus Menu + slide-up drawer) */}
      <AddMenuModal
        visible={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        onPickPhoto={pickMedia}
        onRecord={startRecording}
        onDictation={handleDictationOption}
        onPickBackground={pickBgImage}
        onTemplates={() => setShowTemplates(true)}
        onCapsule={() => setShowCapsule(true)}
        theme={theme}
        accent={accent}
      />

      {/* Modal Capsule */}
      <CapsuleModal
        visible={showCapsule}
        onClose={() => setShowCapsule(false)}
        options={CAPSULE_OPTIONS}
        selected={capsuleSelected}
        onSelect={sealCapsule}
        fontsLoaded={fontsLoaded}
        theme={theme}
        accent={accent}
      />

      {/* Modèles d'écriture */}
      <TemplatesModal
        visible={showTemplates}
        onClose={() => setShowTemplates(false)}
        templates={WRITING_TEMPLATES}
        onApply={applyTemplate}
        theme={theme}
        accent={accent}
      />

      {/* Modal Suppression */}
      <DeleteConfirmModal
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        theme={theme}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  chiffreBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chiffreDot: { width: 8, height: 8, borderRadius: 4 },
  chiffreText: { fontSize: 10, letterSpacing: 1.5 },
  terminerBtn: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20 },
  terminerText: { fontSize: 13, fontWeight: '500' },
  capsuleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  capsuleBadgeText: { fontSize: 10, letterSpacing: 1 },
  body: { flex: 1, paddingHorizontal: 24 },
  titreInput: {
    fontSize: 32,
    marginBottom: 10,
    marginTop: 24,
    paddingVertical: 0,
  },
  dateLoc: { fontSize: 11, letterSpacing: 1.5, marginBottom: 28 },
  contenuInput: { minHeight: 300, paddingVertical: 0 },
  ttPanel: { borderTopWidth: 1, padding: 16 },
  ttPanelLabel: { fontSize: 9, letterSpacing: 2, marginBottom: 10 },
  ttRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ttBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  ttBtnText: { fontSize: 14, fontWeight: '500' },
  ttValue: { fontSize: 14, minWidth: 40, textAlign: 'center' },
  toolbar: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
  toolbarRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  wordCountWrap: { marginRight: 4 },
  wordCountNum: { fontSize: 18, fontWeight: '500' },
  wordCountLabel: { fontSize: 9, letterSpacing: 1 },
  toolbarRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  toolBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ttText: { fontSize: 13, fontWeight: '600' },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  mediaList: { flexDirection: 'row', marginTop: 16, marginBottom: 8 },
  mediaItem: { marginRight: 12, position: 'relative' },
  mediaThumbnail: { width: 80, height: 80, borderRadius: 12 },
  removeMediaBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e55',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  deleteBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Custom Voice Notes & Player Cards container
  audioPlayersContainer: { marginTop: 16, gap: 10 },
});
