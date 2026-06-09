"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { setLocale } from "@/lib/i18n/actions";
import { LOCALES, type Locale } from "@/lib/i18n/config";

// NO / EN toggle. Submits the locale via a server action that sets the cookie
// and revalidates, so the whole page re-renders in the chosen language.
export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const { locale, t } = useI18n();

  return (
    <form
      action={setLocale}
      className={["inline-flex items-center", className]
        .filter(Boolean)
        .join(" ")}
      aria-label={t.language.label}
    >
      <div className="inline-flex overflow-hidden rounded-full border border-brand-200">
        {LOCALES.map((loc: Locale) => {
          const active = loc === locale;
          return (
            <button
              key={loc}
              type="submit"
              name="locale"
              value={loc}
              aria-pressed={active}
              className={[
                "px-2.5 py-1 text-xs font-semibold uppercase transition",
                active
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-600 hover:bg-brand-50",
              ].join(" ")}
            >
              {loc}
            </button>
          );
        })}
      </div>
    </form>
  );
}
