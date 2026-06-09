// i18n configuration. Cookie-based locale, no URL routing.
export const LOCALES = ["no", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "no";
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "no" || value === "en";
}
