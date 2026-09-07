import az from "./dictionaries/az.json";
import en from "./dictionaries/en.json";

export const locales = ["az", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "az";

/** The Azerbaijani file is the source of truth for the shape of a dictionary. */
export type Dictionary = typeof az;

const dictionaries: Record<Locale, Dictionary> = { az, en: en as Dictionary };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Fill {placeholders} in a dictionary string. */
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}
