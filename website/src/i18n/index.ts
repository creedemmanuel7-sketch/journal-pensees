import fr from "./fr.json";
import en from "./en.json";

export type Locale = "fr" | "en";

export type Dictionary = typeof fr;

export const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
