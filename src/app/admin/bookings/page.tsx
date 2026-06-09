import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
  SERVICE_LABELS,
} from "@/lib/constants";
import type { BookingRequest, BookingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = BOOKING_STATUSES.includes(status as BookingStatus)
    ? (status as BookingStatus)
    : undefined;

  const supabase = createAdminClient();
  let query = supabase
    .from("booking_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (activeStatus) query = query.eq("status", activeStatus);

  const { data } = await query;
  const bookings = (data as BookingRequest[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review requests, assign sitters and track each booking.
        </p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/bookings"
          className={[
            "rounded-full px-3 py-1.5 text-sm font-medium",
            !activeStatus
              ? "bg-brand-600 text-white"
              : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50",
          ].join(" ")}
        >
          All
        </Link>
        {BOOKING_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/bookings?status=${s}`}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium",
              activeStatus === s
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            {BOOKING_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Buyer / Pet</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Area</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Paid</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{b.buyer_name}</p>
                    <p className="text-xs text-gray-500">{b.pet_name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {SERVICE_LABELS[b.service_type]}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.neighborhood}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(b.preferred_date)}
                  </td>
                  <td className="px-4 py-3">
                    <BookingStatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    {b.paid_manually ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="text-sm font-medium text-brand-700 hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
