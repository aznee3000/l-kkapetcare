import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser, claimByEmail, getOwnSitterProfile } from "@/lib/auth";
import { getTranslations } from "@/lib/i18n";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import { SERVICE_LABELS } from "@/lib/constants";
import type { BookingRequest } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const user = await requireUser();
  // First-load claim: link any anonymous bookings / sitter profile by email.
  await claimByEmail(user);

  const { t } = await getTranslations();
  const sitter = await getOwnSitterProfile();

  const supabase = await createClient();
  const { data } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const bookings = (data as BookingRequest[] | null) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t.dashboard.myBookings}
      </h1>

      {sitter && (
        <Link
          href="/dashboard/sitter"
          className="flex items-center justify-between rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-medium text-brand-800 hover:bg-brand-100"
        >
          <span>{t.dashboard.myAssignments}</span>
          <span aria-hidden>→</span>
        </Link>
      )}

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-soft">
          <h2 className="text-lg font-semibold text-gray-900">
            {t.dashboard.buyerEmptyTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            {t.dashboard.buyerEmptyBody}
          </p>
          <Link
            href="/book"
            className="mt-4 inline-flex rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {t.dashboard.buyerEmptyCta}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li key={b.id}>
              <Link
                href={`/dashboard/bookings/${b.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft transition hover:border-brand-200"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {b.pet_name} · {SERVICE_LABELS[b.service_type]}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {b.neighborhood}
                    {b.preferred_date ? ` · ${b.preferred_date}` : ""}
                  </p>
                </div>
                <BookingStatusBadge status={b.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!sitter && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-center text-sm text-gray-600">
          <p>{t.dashboard.becomeSitterPrompt}</p>
          <Link
            href="/become-sitter"
            className="mt-2 inline-flex font-semibold text-brand-700 hover:underline"
          >
            {t.dashboard.becomeSitterCta}
          </Link>
        </div>
      )}
    </div>
  );
}
