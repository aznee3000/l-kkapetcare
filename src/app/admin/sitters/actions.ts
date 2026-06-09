"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SitterStatus } from "@/lib/types";

// Approve / reject / unpublish a sitter by setting their status.
export async function setSitterStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("sitter_id"));
  const status = String(formData.get("status")) as SitterStatus;

  const allowed: SitterStatus[] = [
    "pending_review",
    "approved",
    "rejected",
    "unpublished",
  ];
  if (!allowed.includes(status)) return;

  const supabase = createAdminClient();
  await supabase.from("sitter_profiles").update({ status }).eq("id", id);

  revalidatePath(`/admin/sitters/${id}`);
  revalidatePath("/admin/sitters");
}

// Toggle a single verification badge (id_verified, reference_checked, etc.).
export async function toggleBadge(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("sitter_id"));
  const field = String(formData.get("field"));
  const value = String(formData.get("value")) === "true";

  const allowedFields = [
    "id_verified",
    "reference_checked",
    "local_neighbor",
    "pet_experience_verified",
  ];
  if (!allowedFields.includes(field)) return;

  const supabase = createAdminClient();
  await supabase
    .from("sitter_profiles")
    .update({ [field]: value })
    .eq("id", id);

  revalidatePath(`/admin/sitters/${id}`);
}

// Edit the core sitter profile fields.
export async function saveSitterProfile(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("sitter_id"));

  const priceRaw = String(formData.get("starting_price_nok") || "");
  const ratingRaw = String(formData.get("average_rating") || "");

  const supabase = createAdminClient();
  await supabase
    .from("sitter_profiles")
    .update({
      full_name: String(formData.get("full_name") || ""),
      neighborhood: String(formData.get("neighborhood") || "") || null,
      bio: String(formData.get("bio") || "") || null,
      pet_experience: String(formData.get("pet_experience") || "") || null,
      availability_notes:
        String(formData.get("availability_notes") || "") || null,
      services_offered: formData.getAll("services_offered").map(String),
      dog_sizes_accepted: formData.getAll("dog_sizes_accepted").map(String),
      starting_price_nok: priceRaw ? Number(priceRaw) : null,
      average_rating: ratingRaw ? Number(ratingRaw) : null,
    })
    .eq("id", id);

  revalidatePath(`/admin/sitters/${id}`);
}
