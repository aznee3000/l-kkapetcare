import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/forms/BookingForm";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t.meta.bookTitle };
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ sitter_id?: string }>;
}) {
  const { t } = await getTranslations();
  const { sitter_id } = await searchParams;

  // If a sitter was requested from the directory, look up their name to confirm
  // it back to the buyer. Public client only sees approved sitters (RLS).
  let requestedSitterName: string | undefined;
  let requestedSitterId: string | undefined;
  if (sitter_id) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("sitter_profiles")
      .select("id, full_name")
      .eq("id", sitter_id)
      .eq("status", "approved")
      .maybeSingle();
    if (data) {
      requestedSitterId = data.id;
      requestedSitterName = data.full_name.split(" ")[0];
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-brand-50/40 py-12">
        <div className="container-narrow">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {t.book.pageTitle}
            </h1>
            <p className="mt-3 text-gray-600">{t.book.pageIntro}</p>
          </div>
          <BookingForm
            requestedSitterId={requestedSitterId}
            requestedSitterName={requestedSitterName}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
