"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUp } from "@/app/signup/actions";
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
      {pending ? t.auth.signingUp : t.auth.signUpCta}
    </Button>
  );
}

export default function SignupForm({ next }: { next?: string }) {
  const { t } = useI18n();
  const [state, formAction] = useActionState(signUp, initialFormState);

  return (
    <>
      {state.message && (
        <div
          className={[
            "mt-4 rounded-xl border p-3 text-sm",
            state.ok
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {state.message}
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        {next && <input type="hidden" name="next" value={next} />}
        <Field
          label={t.auth.fullName}
          htmlFor="full_name"
          optionalLabel={t.field.optional}
        >
          <Input id="full_name" name="full_name" autoComplete="name" />
        </Field>
        <Field label={t.auth.email} htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
        <Field
          label={t.auth.password}
          htmlFor="password"
          required
          hint={t.auth.passwordHint}
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </Field>
        <SubmitButton />
      </form>
    </>
  );
}
