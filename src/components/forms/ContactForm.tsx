"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact } from "@/app/contact/actions";
import { initialFormState } from "@/lib/form-state";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function SubmitButton({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? busy : idle}
    </Button>
  );
}

export default function ContactForm() {
  const { t } = useI18n();
  const tc = t.contact;
  const [state, formAction] = useActionState(submitContact, initialFormState);

  const err = (field: string) => {
    const key = state.errors?.[field]?.[0];
    if (!key) return undefined;
    return (t.errors as Record<string, string>)[key] ?? key;
  };

  if (state.ok) {
    return (
      <Card className="text-center">
        <div className="text-5xl">📬</div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          {tc.confirmTitle}
        </h2>
        <p className="mt-3 text-gray-600">{state.message}</p>
        <p className="mt-2 text-sm text-gray-500">{tc.confirmFollowup}</p>
      </Card>
    );
  }

  const opt = t.field.optional;

  return (
    <form action={formAction} className="space-y-8">
      {state.message && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <Card>
        <div className="grid gap-4">
          <Field
            label={tc.name}
            htmlFor="name"
            required
            error={err("name")}
            optionalLabel={opt}
          >
            <Input id="name" name="name" autoComplete="name" />
          </Field>
          <p className="text-xs text-gray-500">{tc.contactHint}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={tc.email}
              htmlFor="email"
              error={err("email")}
              optionalLabel={opt}
            >
              <Input id="email" name="email" type="email" autoComplete="email" />
            </Field>
            <Field
              label={tc.phone}
              htmlFor="phone"
              error={err("phone")}
              optionalLabel={opt}
            >
              <Input id="phone" name="phone" type="tel" autoComplete="tel" />
            </Field>
          </div>
          <Field
            label={tc.message}
            htmlFor="message"
            required
            hint={tc.messageHint}
            error={err("message")}
            optionalLabel={opt}
          >
            <Textarea id="message" name="message" rows={6} />
          </Field>
        </div>
      </Card>

      <div className="space-y-4">
        <SubmitButton idle={tc.submit} busy={tc.submitting} />
      </div>
    </form>
  );
}
