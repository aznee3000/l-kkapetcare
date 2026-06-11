"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { claimByEmail } from "@/lib/auth";
import { getTranslations } from "@/lib/i18n";
import { type FormState } from "@/lib/form-state";

// Creates a buyer account (profiles row is auto-created by the handle_new_user
// trigger, default role 'buyer'). If the project requires email confirmation,
// there is no session yet, so we ask the user to confirm then sign in.
export async function signUp(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim();

  const { t } = await getTranslations();

  if (!email || !password) {
    return { ok: false, message: t.auth.enterBoth };
  }
  if (password.length < 6) {
    return { ok: false, message: t.auth.passwordHint };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("already") || msg.includes("registered")) {
      return { ok: false, message: t.auth.emailInUse };
    }
    return { ok: false, message: t.auth.signUpError };
  }

  // Email confirmation enabled → no session yet.
  if (!data.session || !data.user) {
    return { ok: true, message: t.auth.checkEmail };
  }

  await claimByEmail(data.user);
  redirect(next && next.startsWith("/") ? next : "/dashboard");
}
