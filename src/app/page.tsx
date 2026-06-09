import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import { LinkButton } from "@/components/ui/Button";
import { getTranslations } from "@/lib/i18n";

export default async function LandingPage() {
  const { t } = await getTranslations();
  const tp = t.landing.trustPoints;

  const trustPoints = [
    { icon: "🪪", ...tp.idVerified },
    { icon: "🏘️", ...tp.local },
    { icon: "⭐", ...tp.reviews },
    { icon: "📸", ...tp.photos },
    { icon: "✅", ...tp.adminApproved },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-[var(--background)]">
          <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft">
                {t.landing.badge}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                {t.landing.heroTitle}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-gray-600">
                {t.landing.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="/book" size="lg">
                  {t.landing.bookCta}
                </LinkButton>
                <LinkButton href="/become-sitter" variant="outline" size="lg">
                  {t.landing.becomeCta}
                </LinkButton>
              </div>
              <p className="mt-4 text-sm text-gray-500">{t.landing.heroNote}</p>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-100 shadow-soft">
                <Image
                  src="/hero-pets.webp"
                  alt={t.landing.heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="container-page py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {t.landing.servicesTitle}
            </h2>
            <p className="mt-3 text-gray-600">{t.landing.servicesSubtitle}</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
              <div className="text-4xl">🐕</div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                {t.landing.dogWalkTitle}
              </h3>
              <p className="mt-2 text-gray-600">{t.landing.dogWalkBody}</p>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
              <div className="text-4xl">🐈</div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                {t.landing.catTitle}
              </h3>
              <p className="mt-2 text-gray-600">{t.landing.catBody}</p>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-white p-7 shadow-soft">
              <div className="text-4xl">🧳</div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                {t.landing.vacationTitle}
              </h3>
              <p className="mt-2 text-gray-600">{t.landing.vacationBody}</p>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="bg-sage-50/70 py-16">
          <div className="container-page">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                {t.landing.trustTitle}
              </h2>
              <p className="mt-3 text-gray-600">{t.landing.trustSubtitle}</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trustPoints.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-sage-100 bg-white p-6 shadow-soft"
                >
                  <div className="text-3xl">{p.icon}</div>
                  <h3 className="mt-3 font-bold text-gray-900">{p.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For buyers */}
        <section className="container-page py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                {t.landing.buyersEyebrow}
              </span>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {t.landing.buyersTitle}
              </h2>
              <ol className="mt-6 space-y-4">
                {[t.landing.step1, t.landing.step2, t.landing.step3].map(
                  (step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                        {i + 1}
                      </span>
                      <p className="text-gray-600">{step}</p>
                    </li>
                  ),
                )}
              </ol>
              <div className="mt-8">
                <LinkButton href="/book" size="lg">
                  {t.landing.bookCta}
                </LinkButton>
              </div>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 shadow-soft">
              <blockquote className="text-lg text-gray-700">
                “{t.landing.buyerQuote}”
              </blockquote>
              <p className="mt-4 text-sm font-semibold text-gray-900">
                {t.landing.buyerQuoteAuthor}
              </p>
            </div>
          </div>
        </section>

        {/* For sitters */}
        <section className="bg-brand-600 py-16 text-white">
          <div className="container-page grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-100">
                {t.landing.sittersEyebrow}
              </span>
              <h2 className="mt-2 text-3xl font-bold">
                {t.landing.sittersTitle}
              </h2>
              <p className="mt-4 text-brand-50">{t.landing.sittersBody}</p>
              <ul className="mt-6 space-y-2 text-brand-50">
                <li>• {t.landing.sittersBullet1}</li>
                <li>• {t.landing.sittersBullet2}</li>
                <li>• {t.landing.sittersBullet3}</li>
              </ul>
              <div className="mt-8">
                <LinkButton
                  href="/become-sitter"
                  variant="secondary"
                  size="lg"
                >
                  {t.landing.becomeCta}
                </LinkButton>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur">
              <div className="text-6xl">🧡</div>
              <p className="mt-4 text-lg text-brand-50">
                {t.landing.sittersCard}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container-page py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {t.landing.faqTitle}
            </h2>
          </div>
          <div className="mt-10">
            <FAQ />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
