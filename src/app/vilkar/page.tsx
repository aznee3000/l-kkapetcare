import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTranslations } from "@/lib/i18n";

const PDF_URL = "/policies/vilkar_lokkapetcare.pdf";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t.meta.termsTitle };
}

export default async function TermsPage() {
  const { t } = await getTranslations();

  return (
    <>
      <Navbar />
      <main className="bg-brand-50/40 py-12">
        <div className="container-narrow">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {t.legal.termsTitle}
            </h1>
            <p className="mt-3 text-gray-600">{t.legal.intro}</p>
            {t.legal.langNote && (
              <p className="mt-2 text-sm text-gray-500">{t.legal.langNote}</p>
            )}
            <div className="mt-4">
              <a
                href={PDF_URL}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
              >
                {t.legal.openInNewTab}
              </a>
            </div>
          </div>

          <object
            data={PDF_URL}
            type="application/pdf"
            className="h-[80vh] w-full rounded-xl border border-brand-100 bg-white shadow-soft"
          >
            <a href={PDF_URL} className="text-brand-700 underline">
              {t.legal.openInNewTab}
            </a>
          </object>
        </div>
      </main>
      <Footer />
    </>
  );
}
