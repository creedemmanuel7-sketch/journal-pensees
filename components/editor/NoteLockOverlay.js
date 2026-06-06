import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/**
 * Overlay de saisie PIN pour une note verrouillée (PIN ou biométrie).
 */
export default function NoteLockOverlay({
  lockPin,
  setLockPin,
  onUnlock,
  theme,
  accent,
}) {
  return (
    <View style={[styles.lockOverlay, { backgroundColor: theme.bg + 'F0' }]}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>🔒</Text>
      <Text style={[styles.lockTitle, { color: theme.text }]}>
        Note verrouillée
      </Text>
      <Text style={[styles.lockDesc, { color: theme.text3 }]}>
        Saisissez votre PIN ou utilisez la biométrie
      </Text>
      <View style={styles.lockPinRow}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.lockPinDot,
              { borderColor: theme.border },
              i < lockPin.length && {
                backgroundColor: accent.primary,
                borderColor: accent.primary,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.lockPad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(
          (key, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.lockKey, key === '' && { opacity: 0 }]}
              disabled={!key}
              onPress={() => {
                if (key === '⌫') setLockPin((p) => p.slice(0, -1));
                else if (lockPin.length < 4) setLockPin((p) => p + key);
              }}
            >
              <Text style={{ color: theme.text, fontSize: 20 }}>{key}</Text>
            </TouchableOpacity>
          ),
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.lockUnlockBtn,
          {
            backgroundColor: accent.primary,
            opacity: lockPin.length === 4 ? 1 : 0.5,
          },
        ]}
        disabled={lockPin.length !== 4}
        onPress={onUnlock}
      >
        <Text style={{ color: theme.bg, fontWeight: '600' }}>
          Déverrouiller
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onUnlock} style={{ marginTop: 12 }}>
        <Text style={{ color: accent.primary, fontSize: 13 }}>Biométrie</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  lockTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  lockDesc: { fontSize: 13, textAlign: 'center', marginBottom: 20 },
  lockPinRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  lockPinDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
  lockPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 220,
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  lockKey: {
    width: 64,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockUnlockBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
