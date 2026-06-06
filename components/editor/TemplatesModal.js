import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { modalStyles as styles } from './sharedStyles';

/**
 * Modale des modèles d'écriture.
 */
export default function TemplatesModal({
  visible,
  onClose,
  templates,
  onApply,
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
              <Text style={[styles.capsuleTitle, { color: accent.primary }]}>
                Modèles d'écriture
              </Text>
              {templates.map((tpl) => (
                <TouchableOpacity
                  key={tpl.id}
                  style={[
                    styles.capsuleOption,
                    { borderBottomWidth: 1, borderBottomColor: theme.border },
                  ]}
                  onPress={() => onApply(tpl)}
                >
                  <Text style={{ fontSize: 20 }}>{tpl.icon}</Text>
                  <Text
                    style={[styles.capsuleOptionText, { color: theme.text }]}
                  >
                    {tpl.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.capsuleCancelBtn,
                  { backgroundColor: theme.bg4 },
                ]}
                onPress={onClose}
              >
                <Text style={{ color: theme.text2 }}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
