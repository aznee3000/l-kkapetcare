import Link from "next/link";
import { getTranslations } from "@/lib/i18n";
import SignupForm from "@/components/auth/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { t } = await getTranslations();
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50/50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 font-bold text-brand-700"
        >
          <span className="text-2xl" aria-hidden>
            🐾
          </span>
          <span className="text-lg">Løkka Pet Care</span>
        </Link>

        <div className="rounded-2xl border border-brand-100 bg-white p-8 shadow-soft">
          <h1 className="text-2xl font-bold text-gray-900">
            {t.auth.signUpTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{t.auth.signUpSubtitle}</p>

          <SignupForm next={next} />

          <p className="mt-6 text-center text-sm text-gray-500">
            {t.auth.haveAccount}{" "}
            <Link
              href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
              className="font-semibold text-brand-700 hover:underline"
            >
              {t.auth.signInLink}
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          {t.auth.optionalNote}
        </p>
      </div>
    </main>
  );
}
