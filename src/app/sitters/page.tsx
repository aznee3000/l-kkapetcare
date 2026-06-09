import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SitterCard from "@/components/SitterCard";
import { LinkButton } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "@/lib/i18n";
import type { SitterProfile } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t.meta.sittersTitle };
}

// Always fetch fresh approved sitters.
export const dynamic = "force-dynamic";

export default async function SittersPage() {
  const { t } = await getTranslations();
  const supabase = await createClient();
  // RLS limits this to status = 'approved' for the public anon client.
  const { data, error } = await supabase
    .from("sitter_profiles")
    .select("*")
    .eq("status", "approved")
    .order("average_rating", { ascending: false, nullsFirst: false });

  const sitters = (data as SitterProfile[] | null) ?? [];

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-brand-50 to-[var(--background)] py-14">
          <div className="container-page text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">
              {t.directory.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              {t.directory.subtitle}
            </p>
          </div>
        </section>

        <section className="container-page py-12">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {t.directory.loadError}
            </div>
          )}

          {!error && sitters.length === 0 && (
            <div className="mx-auto max-w-xl rounded-2xl border border-brand-100 bg-white p-10 text-center shadow-soft">
              <div className="text-5xl">🐾</div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {t.directory.emptyTitle}
              </h2>
              <p className="mt-2 text-gray-600">{t.directory.emptyBody}</p>
              <div className="mt-6">
                <LinkButton href="/book">{t.directory.emptyCta}</LinkButton>
              </div>
            </div>
          )}

          {sitters.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sitters.map((sitter) => (
                <SitterCard key={sitter.id} sitter={sitter} t={t} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
