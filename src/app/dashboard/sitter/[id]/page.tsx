import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnSitterProfile } from "@/lib/auth";
import { getTranslations } from "@/lib/i18n";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import PhotoUpdateForm from "@/components/dashboard/PhotoUpdateForm";
import BookingChat from "@/components/dashboard/BookingChat";
import { SERVICE_LABELS } from "@/lib/constants";
import type { BookingRequest, BookingUpdate } from "@/lib/types";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">
        {value || "—"}
      </span>
    </div>
  );
}

export default async function SitterAssignmentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { t, locale } = await getTranslations();
  const sitter = await getOwnSitterProfile();
  if (!sitter || sitter.status !== "approved") notFound();

  const supabase = await createClient();
  const { data: bookingData } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const booking = bookingData as BookingRequest | null;
  if (!booking || booking.assigned_sitter_id !== sitter.id) notFound();

  const { data: updatesData } = await supabase
    .from("booking_updates")
    .select("*")
    .eq("booking_id", id)
    .order("created_at", { ascending: false });
  const updates = (updatesData as BookingUpdate[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard/sitter"
            className="text-sm text-gray-500 hover:text-brand-700"
          >
            {t.dashboard.backToList}
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {booking.pet_name} · {SERVICE_LABELS[booking.service_type]}
          </h1>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-semibold text-gray-900">
              {t.dashboard.serviceLabel}
            </h2>
            <Row label={t.dashboard.buyerLabel} value={booking.buyer_name} />
            <Row label={t.dashboard.petLabel} value={booking.pet_name} />
            <Row
              label={t.dashboard.serviceLabel}
              value={SERVICE_LABELS[booking.service_type]}
            />
            <Row label={t.dashboard.dateLabel} value={booking.preferred_date} />
            <Row label="Time" value={booking.preferred_time_window} />
            <Row label="Area" value={booking.neighborhood} />
            <Row label="Notes" value={booking.behavior_notes} />
            <Row label="Access" value={booking.access_instructions} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-semibold text-gray-900">
              {t.dashboard.activityTitle}
            </h2>
            <ActivityTimeline
              updates={updates}
              emptyLabel={t.dashboard.noActivity}
              locale={locale === "no" ? "nb-NO" : "en-GB"}
            />
          </div>

          <BookingChat bookingId={booking.id} />
        </div>

        <div className="space-y-6">
          <PhotoUpdateForm bookingId={booking.id} />
        </div>
      </div>
    </div>
  );
}
