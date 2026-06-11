import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOwnSitterProfile } from "@/lib/auth";
import { getTranslations } from "@/lib/i18n";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import { SERVICE_LABELS } from "@/lib/constants";
import type { BookingRequest } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SitterAssignmentsPage() {
  const { t } = await getTranslations();
  const sitter = await getOwnSitterProfile();

  if (!sitter) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-soft">
        <h1 className="text-xl font-bold text-gray-900">
          {t.dashboard.sitterEmptyTitle}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          {t.dashboard.becomeSitterPrompt}
        </p>
        <Link
          href="/become-sitter"
          className="mt-4 inline-flex rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {t.dashboard.becomeSitterCta}
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("assigned_sitter_id", sitter.id)
    .order("created_at", { ascending: false });

  const bookings = (data as BookingRequest[] | null) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t.dashboard.myAssignments}
      </h1>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-soft">
          <h2 className="text-lg font-semibold text-gray-900">
            {t.dashboard.sitterEmptyTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            {t.dashboard.sitterEmptyBody}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li key={b.id}>
              <Link
                href={`/dashboard/sitter/${b.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft transition hover:border-brand-200"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {b.pet_name} · {SERVICE_LABELS[b.service_type]}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {b.buyer_name} · {b.neighborhood}
                    {b.preferred_date ? ` · ${b.preferred_date}` : ""}
                  </p>
                </div>
                <BookingStatusBadge status={b.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
