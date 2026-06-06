import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';

/**
 * Modale d'enregistrement vocal en cours (cercle pulsant + minuteur).
 */
export default function RecordingOverlay({
  visible,
  recordTime,
  onStop,
  theme,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.recordingOverlay}>
        <View
          style={[
            styles.recordingCard,
            { backgroundColor: theme.bg3, borderColor: theme.border },
          ]}
        >
          <View
            style={[
              styles.recordingPulseCircle,
              { borderColor: '#e55', backgroundColor: theme.bg },
            ]}
          >
            <Text style={{ fontSize: 44 }}>🎙️</Text>
          </View>
          <Text style={[styles.recordingTitle, { color: theme.text }]}>
            Enregistrement en cours...
          </Text>
          <Text style={styles.recordingTimer}>{recordTime}</Text>
          <Text style={[styles.recordingSubtitle, { color: theme.text3 }]}>
            Votre note vocale est chiffrée en local de bout en bout
          </Text>

          <TouchableOpacity
            style={styles.recordingStopBtn}
            onPress={onStop}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
              ✓ Terminer & Sauvegarder
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  recordingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,10,11,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  recordingCard: {
    width: '100%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
  },
  recordingPulseCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  recordingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  recordingTimer: {
    fontSize: 48,
    fontWeight: '300',
    color: '#e55',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  recordingSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  recordingStopBtn: {
    backgroundColor: '#e55',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
});
