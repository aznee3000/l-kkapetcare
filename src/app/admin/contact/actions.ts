"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function toggleContactResolved(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("contact_id"));
  const resolved = String(formData.get("resolved")) === "true";

  const supabase = createAdminClient();
  await supabase
    .from("contact_requests")
    .update({ status: resolved ? "resolved" : "new" })
    .eq("id", id);

  revalidatePath("/admin/contact");
}
