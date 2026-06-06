import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { modalStyles as styles } from './sharedStyles';

/**
 * Modale de confirmation de suppression (déplacement en corbeille).
 */
export default function DeleteConfirmModal({
  visible,
  onClose,
  onConfirm,
  theme,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.capsuleModal,
                {
                  backgroundColor: theme.bg3,
                  borderColor: theme.border,
                  padding: 24,
                },
              ]}
            >
              <Text
                style={{ fontSize: 32, textAlign: 'center', marginBottom: 16 }}
              >
                🗑️
              </Text>
              <Text
                style={[
                  styles.capsuleTitle,
                  { color: theme.text, fontSize: 18 },
                ]}
              >
                Supprimer cette pensée ?
              </Text>
              <Text style={[styles.capsuleDesc, { color: theme.text2 }]}>
                Elle sera déplacée dans la corbeille.
              </Text>
              <TouchableOpacity
                style={[
                  styles.capsuleCancelBtn,
                  { backgroundColor: 'rgba(229,85,85,0.15)', marginBottom: 8 },
                ]}
                onPress={onConfirm}
              >
                <Text style={{ color: '#e55', fontWeight: '600' }}>
                  Supprimer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.capsuleCancelBtn,
                  { backgroundColor: theme.bg4 },
                ]}
                onPress={onClose}
              >
                <Text style={{ color: theme.text2 }}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
