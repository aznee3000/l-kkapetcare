"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { reviewSchema } from "@/lib/validation";
import { type FormState, zodErrorsToState } from "@/lib/form-state";

// Recalculates and stores a sitter's average_rating from their PUBLISHED
// reviews. Called whenever reviews change.
async function recalcSitterRating(
  supabase: ReturnType<typeof createAdminClient>,
  sitterId: string,
) {
  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("sitter_id", sitterId)
    .eq("published", true);

  const ratings = (data ?? []).map((r) => r.rating as number);
  const avg =
    ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) /
        10
      : null;

  await supabase
    .from("sitter_profiles")
    .update({ average_rating: avg })
    .eq("id", sitterId);
}

export async function addReview(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const raw = {
    sitter_id: formData.get("sitter_id"),
    booking_id: formData.get("booking_id") ?? "",
    reviewer_name: formData.get("reviewer_name"),
    rating: formData.get("rating"),
    text: formData.get("text") ?? "",
    published: formData.get("published") === "on",
  };

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return zodErrorsToState(parsed.error.flatten().fieldErrors);
  }

  const data = parsed.data;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("reviews").insert({
      sitter_id: data.sitter_id,
      booking_id: data.booking_id || null,
      reviewer_name: data.reviewer_name,
      rating: data.rating,
      text: data.text || null,
      published: data.published ?? true,
    });
    if (error) throw error;

    await recalcSitterRating(supabase, data.sitter_id);

    revalidatePath("/admin/reviews");
    return { ok: true, message: "Review added." };
  } catch (err) {
    console.error("addReview failed:", err);
    return { ok: false, message: "Could not save the review. Try again." };
  }
}

export async function toggleReviewPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("review_id"));
  const sitterId = String(formData.get("sitter_id"));
  const published = String(formData.get("published")) === "true";

  const supabase = createAdminClient();
  await supabase.from("reviews").update({ published }).eq("id", id);
  await recalcSitterRating(supabase, sitterId);

  revalidatePath("/admin/reviews");
}
