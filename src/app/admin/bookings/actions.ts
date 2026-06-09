"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingStatus } from "@/lib/types";
import { BOOKING_STATUSES } from "@/lib/constants";

// Writes a row to the booking timeline so the admin (and later sitters/buyers)
// can see what happened and when.
async function logUpdate(
  bookingId: string,
  update_type: "admin_note" | "status_change",
  message: string,
) {
  const supabase = createAdminClient();
  await supabase.from("booking_updates").insert({
    booking_id: bookingId,
    update_type,
    message,
  });
}

export async function assignSitter(formData: FormData) {
  await requireAdmin();
  const bookingId = String(formData.get("booking_id"));
  const sitterId = String(formData.get("assigned_sitter_id") || "");

  const supabase = createAdminClient();
  await supabase
    .from("booking_requests")
    .update({ assigned_sitter_id: sitterId || null })
    .eq("id", bookingId);

  await logUpdate(
    bookingId,
    "admin_note",
    sitterId ? "Sitter assigned." : "Sitter unassigned.",
  );

  revalidatePath(`/admin/bookings/${bookingId}`);
}

export async function changeStatus(formData: FormData) {
  await requireAdmin();
  const bookingId = String(formData.get("booking_id"));
  const status = String(formData.get("status")) as BookingStatus;

  if (!BOOKING_STATUSES.includes(status)) return;

  const supabase = createAdminClient();
  const updates: Record<string, unknown> = { status };

  // Keep the completed counter on the sitter in sync when marking complete.
  if (status === "completed") {
    const { data: booking } = await supabase
      .from("booking_requests")
      .select("assigned_sitter_id, status")
      .eq("id", bookingId)
      .single();

    if (
      booking?.assigned_sitter_id &&
      booking.status !== "completed"
    ) {
      const { data: sitter } = await supabase
        .from("sitter_profiles")
        .select("completed_bookings_count")
        .eq("id", booking.assigned_sitter_id)
        .single();
      if (sitter) {
        await supabase
          .from("sitter_profiles")
          .update({
            completed_bookings_count:
              (sitter.completed_bookings_count ?? 0) + 1,
          })
          .eq("id", booking.assigned_sitter_id);
      }
    }
  }

  await supabase.from("booking_requests").update(updates).eq("id", bookingId);
  await logUpdate(bookingId, "status_change", `Status changed to "${status}".`);

  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/admin/bookings");
}

export async function saveBookingDetails(formData: FormData) {
  await requireAdmin();
  const bookingId = String(formData.get("booking_id"));
  const adminNotes = String(formData.get("admin_notes") || "");
  const priceRaw = String(formData.get("price_nok") || "");
  const address = String(formData.get("address_optional") || "");

  const supabase = createAdminClient();
  await supabase
    .from("booking_requests")
    .update({
      admin_notes: adminNotes || null,
      price_nok: priceRaw ? Number(priceRaw) : null,
      address_optional: address || null,
    })
    .eq("id", bookingId);

  revalidatePath(`/admin/bookings/${bookingId}`);
}

export async function togglePaid(formData: FormData) {
  await requireAdmin();
  const bookingId = String(formData.get("booking_id"));
  const paid = String(formData.get("paid")) === "true";

  // MVP: payment is recorded manually here. See src/lib/payments.ts for the
  // future Stripe/Vipps integration point.
  const supabase = createAdminClient();
  await supabase
    .from("booking_requests")
    .update({ paid_manually: paid })
    .eq("id", bookingId);

  await logUpdate(
    bookingId,
    "admin_note",
    paid ? "Marked as paid (manual)." : "Marked as unpaid.",
  );

  revalidatePath(`/admin/bookings/${bookingId}`);
}
