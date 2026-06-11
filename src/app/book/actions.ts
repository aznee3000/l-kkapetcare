"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { bookingSchema } from "@/lib/validation";
import { type FormState, zodErrorsToState } from "@/lib/form-state";
import { getTranslations } from "@/lib/i18n";

// Creates a pet record + a booking request. Public (no auth required).
// We use the admin (service-role) client here so the related `pets` row and
// the `booking_requests` row are written together without needing a logged-in
// user. Input is strictly validated with Zod first.
export async function submitBooking(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    buyer_name: formData.get("buyer_name"),
    buyer_email: formData.get("buyer_email"),
    buyer_phone: formData.get("buyer_phone"),
    neighborhood: formData.get("neighborhood"),
    address_optional: formData.get("address_optional") ?? "",
    pet_type: formData.get("pet_type"),
    pet_name: formData.get("pet_name"),
    service_type: formData.get("service_type"),
    preferred_date: formData.get("preferred_date") ?? "",
    preferred_time_window: formData.get("preferred_time_window") ?? "",
    recurrence: formData.get("recurrence") ?? "one_time",
    pet_size: formData.get("pet_size") ?? "",
    behavior_notes: formData.get("behavior_notes") ?? "",
    access_instructions: formData.get("access_instructions") ?? "",
    emergency_contact_name: formData.get("emergency_contact_name") ?? "",
    emergency_contact_phone: formData.get("emergency_contact_phone") ?? "",
    vet_info: formData.get("vet_info") ?? "",
    requested_sitter_id: formData.get("requested_sitter_id") ?? "",
    consent: formData.get("consent") ?? "",
  };

  const { t } = await getTranslations();

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ...zodErrorsToState(parsed.error.flatten().fieldErrors),
      message: t.errors.fix_errors,
    };
  }

  const data = parsed.data;

  // If the buyer is signed in, link the booking to their account so it shows up
  // in their dashboard. Anonymous bookings keep user_id null.
  let userId: string | null = null;
  const auth = await createClient();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (user) userId = user.id;

  try {
    const supabase = createAdminClient();

    // 1. Create the pet record (captures owner + pet details).
    const { data: pet, error: petError } = await supabase
      .from("pets")
      .insert({
        owner_name: data.buyer_name,
        owner_email: data.buyer_email,
        owner_phone: data.buyer_phone,
        pet_name: data.pet_name,
        pet_type: data.pet_type,
        pet_size: data.pet_size || null,
        behavior_notes: data.behavior_notes || null,
        vet_info: data.vet_info || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
      })
      .select("id")
      .single();

    if (petError) throw petError;

    // 2. Create the booking request, linked to the pet.
    const { error: bookingError } = await supabase
      .from("booking_requests")
      .insert({
        user_id: userId,
        buyer_name: data.buyer_name,
        buyer_email: data.buyer_email,
        buyer_phone: data.buyer_phone,
        neighborhood: data.neighborhood,
        address_optional: data.address_optional || null,
        pet_id: pet.id,
        pet_type: data.pet_type,
        pet_name: data.pet_name,
        service_type: data.service_type,
        preferred_date: data.preferred_date || null,
        preferred_time_window: data.preferred_time_window || null,
        recurrence: data.recurrence,
        behavior_notes: data.behavior_notes || null,
        access_instructions: data.access_instructions || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
        vet_info: data.vet_info || null,
        requested_sitter_id: data.requested_sitter_id || null,
        status: "new",
      });

    if (bookingError) throw bookingError;

    return { ok: true, message: t.book.successMessage };
  } catch (err) {
    console.error("submitBooking failed:", err);
    return { ok: false, message: t.book.errorMessage };
  }
}
