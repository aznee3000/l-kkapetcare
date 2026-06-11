"use server";

import { createClient } from "@/lib/supabase/server";
import { type FormState } from "@/lib/form-state";

// Posts a message to a booking thread. The insert goes through the RLS client,
// so Postgres itself enforces that the sender is a participant (buyer, assigned
// sitter) or an admin — see 0008_messaging.sql.
export async function sendMessage(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const bookingId = String(formData.get("booking_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!bookingId || !body) {
    return { ok: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false };
  }

  const { error } = await supabase.from("messages").insert({
    booking_id: bookingId,
    sender_id: user.id,
    body,
  });

  if (error) {
    console.error("sendMessage failed:", error);
    return { ok: false };
  }

  return { ok: true };
}
