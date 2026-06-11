"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth";

// A buyer cancels their own pending request. Ownership is verified against the
// session before the status change is written with the service-role client.
export async function cancelBooking(formData: FormData) {
  const user = await requireUser();
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!bookingId) return;

  const supabase = createAdminClient();
  const { data: booking } = await supabase
    .from("booking_requests")
    .select("id, user_id, status")
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking || booking.user_id !== user.id) return;
  if (booking.status === "completed" || booking.status === "cancelled") return;

  await supabase
    .from("booking_requests")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  revalidatePath(`/dashboard/bookings/${bookingId}`);
  revalidatePath("/dashboard");
}
