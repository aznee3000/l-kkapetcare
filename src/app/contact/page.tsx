import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/forms/ContactForm";
import { getTranslations } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t.meta.contactTitle };
}

export default async function ContactPage() {
  const { t } = await getTranslations();
  return (
    <>
      <Navbar />
      <main className="bg-brand-50/40 py-12">
        <div className="container-narrow">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {t.contact.pageTitle}
            </h1>
            <p className="mt-3 text-gray-600">{t.contact.pageIntro}</p>
          </div>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
