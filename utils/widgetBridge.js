import { NativeModules, Platform } from 'react-native';

/**
 * Met à jour les widgets Android avec UNIQUEMENT des données non sensibles.
 *
 * Confidentialité : aucun titre ni contenu de note n'est transmis au widget
 * (les notes sont chiffrées et privées, et l'app possède un mode leurre).
 * Seule la série d'écriture (streak), donnée non sensible, est poussée.
 *
 * iOS nécessite une Widget Extension Swift (Mac + Xcode) → no-op ici.
 *
 * Note : on accepte un objet `{ streak }` ; tout autre champ (ex. `title`)
 * éventuellement passé par les appelants est volontairement ignoré.
 */
export async function refreshHomeWidget({ streak } = {}) {
  if (Platform.OS !== 'android') return;

  const widget = NativeModules.MesPenseesWidget;
  if (!widget?.update) return;

  try {
    await widget.update(Number(streak) || 0);
  } catch (e) {
    console.warn('Widget refresh failed:', e);
  }
}
