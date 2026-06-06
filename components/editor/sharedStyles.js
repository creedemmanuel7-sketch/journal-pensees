import { StyleSheet } from 'react-native';

// Styles partagés par les modales de l'éditeur (menu +, capsule, modèles, suppression).
export const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  capsuleModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  capsuleTitle: { fontSize: 24, textAlign: 'center', marginBottom: 8 },
  capsuleDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  capsuleDivider: { height: 1, marginBottom: 8 },
  capsuleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 12,
  },
  capsuleOptionText: { fontSize: 15 },
  capsuleCancelBtn: {
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  capsuleCancelText: { fontSize: 14 },
  addMenuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingVertical: 16,
  },
  addMenuOptionText: { fontSize: 16, fontWeight: '600' },
});
