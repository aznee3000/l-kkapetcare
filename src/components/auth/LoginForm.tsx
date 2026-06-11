"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "@/app/login/actions";
import { initialFormState } from "@/lib/form-state";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? t.auth.signingIn : t.auth.signInCta}
    </Button>
  );
}

export default function LoginForm({
  next,
  initialError,
}: {
  next?: string;
  initialError?: string;
}) {
  const { t } = useI18n();
  const [state, formAction] = useActionState(signIn, initialFormState);
  const message = state.message || initialError;

  return (
    <>
      {message && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {message}
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        {next && <input type="hidden" name="next" value={next} />}
        <Field label={t.auth.email} htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
        <Field label={t.auth.password} htmlFor="password" required>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        <SubmitButton />
      </form>
    </>
  );
}
