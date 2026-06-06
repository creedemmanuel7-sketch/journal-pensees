import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { FONT_DISPLAY_ITALIC } from '../../utils/fonts';
import { modalStyles as styles } from './sharedStyles';

/**
 * Modale de scellement en capsule temporelle.
 */
export default function CapsuleModal({
  visible,
  onClose,
  options,
  selected,
  onSelect,
  fontsLoaded,
  theme,
  accent,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.capsuleModal,
                { backgroundColor: theme.bg3, borderColor: theme.border },
              ]}
            >
              <Text
                style={[
                  styles.capsuleTitle,
                  { color: accent.primary },
                  fontsLoaded && {
                    fontFamily: FONT_DISPLAY_ITALIC,
                    fontStyle: 'italic',
                  },
                ]}
              >
                Capsule Temporelle
              </Text>
              <Text style={[styles.capsuleDesc, { color: theme.text2 }]}>
                Cette note sera scellée et invisible jusqu'à la date choisie.
              </Text>
              <View
                style={[
                  styles.capsuleDivider,
                  { backgroundColor: theme.border },
                ]}
              />
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.capsuleOption,
                    selected === opt && { backgroundColor: accent.light },
                  ]}
                  onPress={() => onSelect(opt)}
                >
                  <Text style={{ fontSize: 18 }}>⏳</Text>
                  <Text
                    style={[
                      styles.capsuleOptionText,
                      { color: theme.text },
                      selected === opt && { color: accent.primary },
                    ]}
                  >
                    {opt}
                  </Text>
                  {selected === opt && (
                    <Text style={{ color: accent.primary, marginLeft: 'auto' }}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.capsuleCancelBtn,
                  { backgroundColor: theme.bg4 },
                ]}
                onPress={onClose}
              >
                <Text
                  style={[styles.capsuleCancelText, { color: theme.text2 }]}
                >
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
