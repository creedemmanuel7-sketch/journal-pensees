import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { modalStyles as styles } from './sharedStyles';

/**
 * Menu "+" : drawer d'enrichissement (photo, vocal, dictée, fond, modèle, capsule).
 */
export default function AddMenuModal({
  visible,
  onClose,
  onPickPhoto,
  onRecord,
  onDictation,
  onPickBackground,
  onTemplates,
  onCapsule,
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
                Enrichir votre pensée
              </Text>
              <Text
                style={[
                  styles.capsuleDesc,
                  { color: theme.text3, marginBottom: 20 },
                ]}
              >
                Ajoutez des médias ou structurez vos écrits
              </Text>

              <TouchableOpacity
                style={[
                  styles.addMenuOption,
                  { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
                onPress={() => {
                  onClose();
                  onPickPhoto();
                }}
              >
                <Text style={{ fontSize: 24 }}>📷</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.addMenuOptionText, { color: theme.text }]}
                  >
                    Ajouter une photo
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.text3 }}>
                    Capturez un instant précieux de votre vie
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addMenuOption,
                  { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
                onPress={() => {
                  onClose();
                  onRecord();
                }}
              >
                <Text style={{ fontSize: 24 }}>🎙️</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.addMenuOptionText, { color: theme.text }]}
                  >
                    Enregistrer un vocal
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.text3 }}>
                    Enregistrez vos émotions à haute voix
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addMenuOption,
                  { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
                onPress={() => {
                  onClose();
                  onDictation();
                }}
              >
                <Text style={{ fontSize: 24 }}>🗣️</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.addMenuOptionText, { color: theme.text }]}
                  >
                    Dictée vocale
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.text3 }}>
                    Dictez vos pensées pour les convertir en texte
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addMenuOption,
                  { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
                onPress={() => {
                  onClose();
                  onPickBackground();
                }}
              >
                <Text style={{ fontSize: 24 }}>🎨</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.addMenuOptionText, { color: theme.text }]}
                  >
                    Personnaliser l'arrière-plan
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.text3 }}>
                    Habillez votre note d'une image ou couleur
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addMenuOption,
                  { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
                onPress={() => {
                  onClose();
                  onTemplates();
                }}
              >
                <Text style={{ fontSize: 24 }}>📝</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.addMenuOptionText, { color: theme.text }]}
                  >
                    Appliquer un modèle d'écriture
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.text3 }}>
                    Guides d'écriture créative et de réflexion
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addMenuOption,
                  { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
                onPress={() => {
                  onClose();
                  onCapsule();
                }}
              >
                <Text style={{ fontSize: 24 }}>⏳</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.addMenuOptionText, { color: theme.text }]}
                  >
                    Créer une capsule temporelle
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.text3 }}>
                    Scellez cette note pour le futur
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.capsuleCancelBtn,
                  { backgroundColor: theme.bg4, marginTop: 16 },
                ]}
                onPress={onClose}
              >
                <Text style={{ color: theme.text2, fontWeight: '600' }}>
                  Fermer
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
