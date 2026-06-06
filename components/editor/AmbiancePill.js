import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/**
 * Pastille d'ambiance sonore + tooltip d'onboarding.
 */
export default function AmbiancePill({
  label,
  isPlaying,
  onPress,
  showTooltip,
  onDismissTooltip,
  theme,
  accent,
}) {
  return (
    <View style={styles.ambianceWrap}>
      {showTooltip && (
        <View
          style={[styles.tooltipContainer, { backgroundColor: accent.primary }]}
        >
          <Text style={[styles.tooltipText, { color: theme.bg }]}>
            🎧 Écrivez en musique !
          </Text>
          <TouchableOpacity
            style={styles.tooltipClose}
            onPress={onDismissTooltip}
          >
            <Text style={{ color: theme.bg, fontWeight: 'bold', fontSize: 10 }}>
              ✕
            </Text>
          </TouchableOpacity>
          <View
            style={[styles.tooltipArrow, { borderTopColor: accent.primary }]}
          />
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.ambiancePill,
          {
            backgroundColor: isPlaying ? accent.primary : theme.bg4,
            borderColor: theme.border,
            borderWidth: 1,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 13 }}>🎧</Text>
        <Text
          style={[
            styles.ambianceLabel,
            { color: isPlaying ? theme.bg : theme.text2 },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {isPlaying && <View style={styles.playingDot} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ambianceWrap: { flex: 1, position: 'relative' },
  ambiancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  ambianceLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '500',
    flex: 1,
  },
  playingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  tooltipContainer: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    left: -100,
    width: 220,
    borderRadius: 12,
    padding: 12,
    zIndex: 10,
  },
  tooltipText: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
    paddingRight: 10,
  },
  tooltipClose: { position: 'absolute', top: 8, right: 8 },
  tooltipArrow: {
    position: 'absolute',
    bottom: -6,
    right: 40,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
