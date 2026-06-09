import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
  RECURRENCE_OPTIONS,
  SERVICE_LABELS,
} from "@/lib/constants";
import type {
  BookingRequest,
  BookingUpdate,
  Pet,
  SitterProfile,
} from "@/lib/types";
import {
  assignSitter,
  changeStatus,
  saveBookingDetails,
  togglePaid,
} from "../actions";

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

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: bookingData } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!bookingData) notFound();
  const booking = bookingData as BookingRequest;

  const [{ data: sittersData }, { data: petData }, { data: updatesData }] =
    await Promise.all([
      supabase
        .from("sitter_profiles")
        .select("*")
        .eq("status", "approved")
        .order("full_name"),
      booking.pet_id
        ? supabase.from("pets").select("*").eq("id", booking.pet_id).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("booking_updates")
        .select("*")
        .eq("booking_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const sitters = (sittersData as SitterProfile[] | null) ?? [];
  const pet = petData as Pet | null;
  const updates = (updatesData as BookingUpdate[] | null) ?? [];
  const requestedSitter = sitters.find(
    (s) => s.id === booking.requested_sitter_id,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/bookings"
            className="text-sm text-gray-500 hover:text-brand-700"
          >
            ← Back to bookings
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {booking.buyer_name} · {booking.pet_name}
          </h1>
          <p className="text-sm text-gray-500">
            {SERVICE_LABELS[booking.service_type]} · {booking.neighborhood}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-semibold text-gray-900">Request details</h2>
            <Row label="Buyer" value={booking.buyer_name} />
            <Row label="Email" value={booking.buyer_email} />
            <Row label="Phone" value={booking.buyer_phone} />
            <Row label="Neighborhood" value={booking.neighborhood} />
            <Row label="Service" value={SERVICE_LABELS[booking.service_type]} />
            <Row
              label="Recurrence"
              value={
                RECURRENCE_OPTIONS.find((r) => r.value === booking.recurrence)
                  ?.label
              }
            />
            <Row label="Preferred date" value={booking.preferred_date} />
            <Row
              label="Time window"
              value={booking.preferred_time_window}
            />
            <Row
              label="Requested sitter"
              value={requestedSitter?.full_name ?? "No preference"}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-semibold text-gray-900">
              Pet &amp; safety
            </h2>
            <Row label="Pet name" value={booking.pet_name} />
            <Row label="Pet type" value={booking.pet_type} />
            <Row label="Pet size" value={pet?.pet_size} />
            <Row label="Behavior notes" value={booking.behavior_notes} />
            <Row
              label="Access instructions"
              value={booking.access_instructions}
            />
            <Row
              label="Emergency contact"
              value={
                booking.emergency_contact_name
                  ? `${booking.emergency_contact_name} (${booking.emergency_contact_phone ?? ""})`
                  : null
              }
            />
            <Row label="Vet info" value={booking.vet_info} />
          </div>

          {/* Timeline (also feeds future photo updates / GPS) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-semibold text-gray-900">Activity</h2>
            {updates.length === 0 ? (
              <p className="text-sm text-gray-500">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {updates.map((u) => (
                  <li key={u.id} className="flex gap-3 text-sm">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
                    <div>
                      <p className="text-gray-800">{u.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(u.created_at).toLocaleString("en-GB")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* FUTURE: sitters post photo_update rows here from their dashboard. */}
          </div>
        </div>

        {/* Right: actions */}
        <div className="space-y-6">
          {/* Assign sitter */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-semibold text-gray-900">Assign sitter</h2>
            <form action={assignSitter} className="space-y-3">
              <input type="hidden" name="booking_id" value={booking.id} />
              <Select
                name="assigned_sitter_id"
                defaultValue={booking.assigned_sitter_id ?? ""}
              >
                <option value="">— Unassigned —</option>
                {sitters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name} ({s.neighborhood})
                  </option>
                ))}
              </Select>
              <Button type="submit" variant="secondary" className="w-full">
                Save assignment
              </Button>
            </form>
            {requestedSitter && (
              <p className="mt-2 text-xs text-gray-500">
                Buyer requested: {requestedSitter.full_name}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-semibold text-gray-900">Status</h2>
            <form action={changeStatus} className="space-y-3">
              <input type="hidden" name="booking_id" value={booking.id} />
              <Select name="status" defaultValue={booking.status}>
                {BOOKING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {BOOKING_STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
              <Button type="submit" className="w-full">
                Update status
              </Button>
            </form>
            <form action={changeStatus} className="mt-2">
              <input type="hidden" name="booking_id" value={booking.id} />
              <input type="hidden" name="status" value="completed" />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full"
              >
                Mark as completed
              </Button>
            </form>
          </div>

          {/* Payment (manual for MVP) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-1 font-semibold text-gray-900">Payment</h2>
            <p className="mb-3 text-xs text-gray-500">
              Manual for the MVP. {/* FUTURE: Stripe / Vipps */}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span
                className={
                  booking.paid_manually
                    ? "font-semibold text-green-600"
                    : "font-semibold text-amber-600"
                }
              >
                {booking.paid_manually ? "Paid" : "Unpaid"}
              </span>
            </div>
            <form action={togglePaid} className="mt-3">
              <input type="hidden" name="booking_id" value={booking.id} />
              <input
                type="hidden"
                name="paid"
                value={(!booking.paid_manually).toString()}
              />
              <Button
                type="submit"
                variant={booking.paid_manually ? "outline" : "primary"}
                className="w-full"
              >
                {booking.paid_manually ? "Mark as unpaid" : "Mark as paid"}
              </Button>
            </form>
          </div>

          {/* Internal details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-semibold text-gray-900">Internal</h2>
            <form action={saveBookingDetails} className="space-y-3">
              <input type="hidden" name="booking_id" value={booking.id} />
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Price (NOK)
                </label>
                <Input
                  name="price_nok"
                  type="number"
                  min="0"
                  defaultValue={booking.price_nok ?? ""}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Full address
                </label>
                <Input
                  name="address_optional"
                  defaultValue={booking.address_optional ?? ""}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Admin notes
                </label>
                <Textarea
                  name="admin_notes"
                  defaultValue={booking.admin_notes ?? ""}
                />
              </div>
              <Button type="submit" variant="outline" className="w-full">
                Save details
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
