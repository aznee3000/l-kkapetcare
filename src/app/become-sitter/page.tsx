import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SitterForm from "@/components/forms/SitterForm";
import { getTranslations } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t.meta.becomeSitterTitle };
}

export default async function BecomeSitterPage() {
  const { t } = await getTranslations();
  return (
    <>
      <Navbar />
      <main className="bg-sage-50/40 py-12">
        <div className="container-narrow">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {t.sitter.pageTitle}
            </h1>
            <p className="mt-3 text-gray-600">{t.sitter.pageIntro}</p>
          </div>
          <SitterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
