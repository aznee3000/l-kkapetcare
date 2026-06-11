import Link from "next/link";
import { getTranslations } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function Navbar() {
  const { t } = await getTranslations();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const accountHref = user ? "/dashboard" : "/login";
  const accountLabel = user ? t.nav.dashboard : t.nav.signIn;

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-[var(--background)]/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700">
          <span className="text-2xl" aria-hidden>
            🐾
          </span>
          <span className="text-lg">Løkka Pet Care</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/sitters"
            className="text-sm font-medium text-gray-700 hover:text-brand-700"
          >
            {t.nav.findSitter}
          </Link>
          <Link
            href="/become-sitter"
            className="text-sm font-medium text-gray-700 hover:text-brand-700"
          >
            {t.nav.becomeSitter}
          </Link>
          <Link
            href={accountHref}
            className="text-sm font-medium text-gray-700 hover:text-brand-700"
          >
            {accountLabel}
          </Link>
          <Link
            href="/book"
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          >
            {t.nav.book}
          </Link>
          <LanguageSwitcher />
        </div>

        {/* On small screens, show the language toggle and the primary CTA. */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <Link
            href={accountHref}
            className="text-sm font-medium text-gray-700 hover:text-brand-700"
          >
            {accountLabel}
          </Link>
          <Link
            href="/book"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {t.nav.bookShort}
          </Link>
        </div>
      </nav>
    </header>
  );
}
