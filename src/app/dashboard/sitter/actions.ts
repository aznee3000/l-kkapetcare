"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOwnSitterProfile } from "@/lib/auth";
import { getTranslations } from "@/lib/i18n";
import { type FormState } from "@/lib/form-state";

const PHOTO_BUCKET = "booking-photos";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

// A signed-in sitter posts an update (optional photo + message) to a booking
// assigned to them. Ownership is verified server-side before writing.
export async function postPhotoUpdate(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { t } = await getTranslations();
  const bookingId = String(formData.get("booking_id") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  const sitter = await getOwnSitterProfile();
  if (!sitter || !bookingId) {
    return { ok: false, message: t.dashboard.updateError };
  }

  try {
    const supabase = createAdminClient();

    // Verify this booking is assigned to the current sitter.
    const { data: booking } = await supabase
      .from("booking_requests")
      .select("id, assigned_sitter_id")
      .eq("id", bookingId)
      .maybeSingle();

    if (!booking || booking.assigned_sitter_id !== sitter.id) {
      return { ok: false, message: t.dashboard.updateError };
    }

    // Optional photo upload.
    let photoUrl: string | null = null;
    const photo = formData.get("photo");
    if (photo instanceof File && photo.size > 0) {
      if (photo.size > MAX_PHOTO_BYTES) {
        return { ok: false, message: t.errors.photo_too_large };
      }
      const ext = photo.name.split(".").pop() || "jpg";
      const path = `${bookingId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, photo, {
          contentType: photo.type || "image/jpeg",
          upsert: false,
        });
      if (uploadError) throw uploadError;
      const { data: pub } = supabase.storage
        .from(PHOTO_BUCKET)
        .getPublicUrl(path);
      photoUrl = pub.publicUrl;
    }

    if (!message && !photoUrl) {
      return { ok: false, message: t.dashboard.updateError };
    }

    const { error } = await supabase.from("booking_updates").insert({
      booking_id: bookingId,
      sitter_id: sitter.id,
      update_type: "photo_update",
      message: message || null,
      photo_url: photoUrl,
    });
    if (error) throw error;

    revalidatePath(`/dashboard/sitter/${bookingId}`);
    revalidatePath(`/dashboard/bookings/${bookingId}`);
    return { ok: true, message: t.dashboard.updatePosted };
  } catch (err) {
    console.error("postPhotoUpdate failed:", err);
    return { ok: false, message: t.dashboard.updateError };
  }
}
