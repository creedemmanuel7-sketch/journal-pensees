import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/**
 * Carte de lecture d'une note vocale (play/pause, position/durée, suppression).
 */
export default function AudioNoteCard({
  item,
  isPlaying,
  playbackPosition,
  playbackDuration,
  onPlayPause,
  onDelete,
  theme,
  accent,
}) {
  return (
    <View
      style={[
        styles.audioCard,
        { backgroundColor: theme.bg3, borderColor: theme.border },
      ]}
    >
      <TouchableOpacity
        style={[styles.audioPlayBtn, { backgroundColor: accent.primary }]}
        onPress={() => onPlayPause(item)}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 15, color: theme.bg }}>
          {isPlaying ? '⏸️' : '▶️'}
        </Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text
          style={[styles.audioCardTitle, { color: theme.text }]}
          numberOfLines={1}
        >
          Note vocale chiffrée
        </Text>
        <Text style={[styles.audioCardTime, { color: theme.text3 }]}>
          {isPlaying
            ? `${playbackPosition} / ${playbackDuration}`
            : 'Prêt à écouter'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.audioDeleteBtn}
        onPress={() => onDelete(item.id)}
      >
        <Text style={{ fontSize: 16 }}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  audioPlayBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioCardTitle: { fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
  audioCardTime: { fontSize: 11, letterSpacing: 0.5, marginTop: 2 },
  audioDeleteBtn: { paddingHorizontal: 8 },
});
