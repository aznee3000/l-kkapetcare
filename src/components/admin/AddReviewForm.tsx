"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addReview } from "@/app/admin/reviews/actions";
import { initialFormState } from "@/lib/form-state";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";

type Option = { id: string; label: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Add review"}
    </Button>
  );
}

export default function AddReviewForm({
  sitters,
  bookings,
  defaultSitterId,
}: {
  sitters: Option[];
  bookings: Option[];
  defaultSitterId?: string;
}) {
  const [state, formAction] = useActionState(addReview, initialFormState);
  const err = (f: string) => state.errors?.[f]?.[0];

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <div
          className={[
            "rounded-xl border p-3 text-sm",
            state.ok
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sitter" htmlFor="sitter_id" required error={err("sitter_id")}>
          <Select
            id="sitter_id"
            name="sitter_id"
            defaultValue={defaultSitterId ?? ""}
          >
            <option value="" disabled>
              Select sitter
            </option>
            {sitters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Booking" htmlFor="booking_id" error={err("booking_id")}>
          <Select id="booking_id" name="booking_id" defaultValue="">
            <option value="">— None —</option>
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Reviewer name"
          htmlFor="reviewer_name"
          required
          error={err("reviewer_name")}
        >
          <Input id="reviewer_name" name="reviewer_name" />
        </Field>

        <Field label="Rating (1–5)" htmlFor="rating" required error={err("rating")}>
          <Select id="rating" name="rating" defaultValue="5">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ★
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Review text" htmlFor="text" error={err("text")}>
        <Textarea id="text" name="text" />
      </Field>

      <Checkbox name="published" label="Publish immediately" defaultChecked />

      <SubmitButton />
    </form>
  );
}
