"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sitterApplicationSchema } from "@/lib/validation";
import { type FormState, zodErrorsToState } from "@/lib/form-state";
import { getTranslations } from "@/lib/i18n";

const PHOTO_BUCKET = "sitter-photos";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

// Public sitter application. Saved with status 'pending_review' so it never
// appears in the directory until an admin approves it. Photo (if provided) is
// uploaded to Supabase Storage server-side.
export async function submitSitterApplication(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    neighborhood: formData.get("neighborhood"),
    bio: formData.get("bio"),
    pet_experience: formData.get("pet_experience"),
    profile_photo_url: "",
    services_offered: formData.getAll("services_offered"),
    dog_sizes_accepted: formData.getAll("dog_sizes_accepted"),
    tags: formData.getAll("tags"),
    availability_notes: formData.get("availability_notes") ?? "",
    references: formData.get("references") ?? "",
    consent: formData.get("consent") ?? "",
  };

  const { t } = await getTranslations();

  const parsed = sitterApplicationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ...zodErrorsToState(parsed.error.flatten().fieldErrors),
      message: t.errors.fix_errors,
    };
  }

  const data = parsed.data;

  try {
    const supabase = createAdminClient();

    // Optional photo upload.
    let photoUrl: string | null = null;
    const photo = formData.get("profile_photo");
    if (photo instanceof File && photo.size > 0) {
      if (photo.size > MAX_PHOTO_BYTES) {
        return {
          ok: false,
          message: t.errors.photo_too_large,
          errors: { profile_photo: ["photo_too_large"] },
        };
      }
      const ext = photo.name.split(".").pop() || "jpg";
      const path = `applications/${crypto.randomUUID()}.${ext}`;
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

    // Append references into availability/bio context for admin review.
    const { error } = await supabase.from("sitter_profiles").insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      neighborhood: data.neighborhood,
      bio: data.bio,
      pet_experience: data.references
        ? `${data.pet_experience}\n\nReferences: ${data.references}`
        : data.pet_experience,
      profile_photo_url: photoUrl,
      services_offered: data.services_offered,
      dog_sizes_accepted: data.dog_sizes_accepted ?? [],
      tags: data.tags ?? [],
      availability_notes: data.availability_notes || null,
      status: "pending_review",
    });

    if (error) throw error;

    return { ok: true, message: t.sitter.successMessage };
  } catch (err) {
    console.error("submitSitterApplication failed:", err);
    return { ok: false, message: t.sitter.errorMessage };
  }
}
