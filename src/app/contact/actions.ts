"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validation";
import { type FormState, zodErrorsToState } from "@/lib/form-state";
import { getTranslations } from "@/lib/i18n";

// Public contact / help request. Saved with status 'new' so it shows up in the
// admin contact queue. Uses the service-role client (no auth required).
export async function submitContact(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    message: formData.get("message"),
  };

  const { t } = await getTranslations();

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ...zodErrorsToState(parsed.error.flatten().fieldErrors),
      message: t.errors.fix_errors,
    };
  }

  const data = parsed.data;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_requests").insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      message: data.message,
      status: "new",
    });

    if (error) throw error;

    return { ok: true, message: t.contact.successMessage };
  } catch (err) {
    console.error("submitContact failed:", err);
    return { ok: false, message: t.contact.errorMessage };
  }
}
