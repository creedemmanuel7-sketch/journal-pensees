/**
 * Polices liées nativement via react-native.config.js (assets/fonts/).
 * Placer CormorantGaramond-LightItalic.ttf dans assets/fonts/ avant le build.
 */
export const FONT_DISPLAY_ITALIC = 'CormorantGaramond-LightItalic';

export function useAppFonts() {
  return { fontsLoaded: true };
}
