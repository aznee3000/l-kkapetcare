"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOwnSitterProfile } from "@/lib/auth";

// Adds a weekly availability slot for the current sitter. Ownership is implicit:
// the slot is always tied to the caller's own sitter profile.
export async function addSlot(formData: FormData) {
  const sitter = await getOwnSitterProfile();
  if (!sitter) return;

  const weekday = Number(formData.get("weekday"));
  const start = String(formData.get("start_time") ?? "");
  const end = String(formData.get("end_time") ?? "");

  if (
    !Number.isInteger(weekday) ||
    weekday < 0 ||
    weekday > 6 ||
    !start ||
    !end ||
    start >= end
  ) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from("sitter_availability").insert({
    sitter_id: sitter.id,
    weekday,
    start_time: start,
    end_time: end,
  });

  revalidatePath("/dashboard/availability");
}

// Removes one of the current sitter's slots (verified against their profile).
export async function removeSlot(formData: FormData) {
  const sitter = await getOwnSitterProfile();
  if (!sitter) return;

  const slotId = String(formData.get("slot_id") ?? "");
  if (!slotId) return;

  const supabase = createAdminClient();
  await supabase
    .from("sitter_availability")
    .delete()
    .eq("id", slotId)
    .eq("sitter_id", sitter.id);

  revalidatePath("/dashboard/availability");
}
