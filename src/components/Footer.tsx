import Link from "next/link";
import { getTranslations } from "@/lib/i18n";

export default async function Footer() {
  const { t } = await getTranslations();

  return (
    <footer className="mt-20 border-t border-brand-100 bg-brand-50/60">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-brand-700">
            <span className="text-2xl" aria-hidden>
              🐾
            </span>
            <span>Løkka Pet Care</span>
          </div>
          <p className="mt-3 text-sm text-gray-600">{t.footer.tagline}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            {t.footer.forOwnersTitle}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/book" className="hover:text-brand-700">
                {t.footer.bookPetHelp}
              </Link>
            </li>
            <li>
              <Link href="/sitters" className="hover:text-brand-700">
                {t.footer.browseSitters}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            {t.footer.forSittersTitle}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/become-sitter" className="hover:text-brand-700">
                {t.footer.becomeSitter}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            {t.footer.companyTitle}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {/* FUTURE: real terms & privacy pages (founder to add with legal help). */}
            <li>
              <span className="cursor-not-allowed text-gray-400">
                {t.footer.terms}
              </span>
            </li>
            <li>
              <span className="cursor-not-allowed text-gray-400">
                {t.footer.privacy}
              </span>
            </li>
            <li>
              <Link href="/login" className="hover:text-brand-700">
                {t.footer.admin}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-100 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Løkka Pet Care · {t.footer.rights}
      </div>
    </footer>
  );
}
