"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { postPhotoUpdate } from "@/app/dashboard/sitter/actions";
import { initialFormState } from "@/lib/form-state";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? t.dashboard.postingUpdate : t.dashboard.postUpdate}
    </Button>
  );
}

export default function PhotoUpdateForm({ bookingId }: { bookingId: string }) {
  const { t } = useI18n();
  const [state, formAction] = useActionState(postPhotoUpdate, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok, state.message]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
      <h2 className="mb-3 font-semibold text-gray-900">
        {t.dashboard.addUpdateTitle}
      </h2>

      {state.message && (
        <div
          className={[
            "mb-3 rounded-xl border p-3 text-sm",
            state.ok
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {state.message}
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="booking_id" value={bookingId} />
        <Field
          label={t.dashboard.updateMessage}
          htmlFor="message"
          optionalLabel={t.field.optional}
        >
          <Textarea
            id="message"
            name="message"
            rows={3}
            placeholder={t.dashboard.updateMessagePlaceholder}
          />
        </Field>
        <Field
          label={t.dashboard.choosePhoto}
          htmlFor="photo"
          optionalLabel={t.field.optional}
        >
          <Input id="photo" name="photo" type="file" accept="image/*" />
        </Field>
        <SubmitButton />
      </form>
    </div>
  );
}
