// Server-side i18n helpers. Read the locale from the cookie and return the
// matching dictionary.
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { no } from "./dictionaries/no";

const DICTIONARIES: Record<Locale, Dictionary> = { en, no };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

// Reads the locale cookie (defaults to Norwegian). Server-only.
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

// Convenience: locale + dictionary in one call for server components.
export async function getTranslations(): Promise<{
  locale: Locale;
  t: Dictionary;
}> {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}

export type { Dictionary };
