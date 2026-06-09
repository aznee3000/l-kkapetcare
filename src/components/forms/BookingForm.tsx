"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitBooking } from "@/app/book/actions";
import { initialFormState } from "@/lib/form-state";
import {
  DOG_SIZES,
  NEIGHBORHOODS,
  PET_TYPES,
  RECURRENCE_OPTIONS,
  SERVICE_OPTIONS,
} from "@/lib/constants";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
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

export default function BookingForm({
  requestedSitterId,
  requestedSitterName,
}: {
  requestedSitterId?: string;
  requestedSitterName?: string;
}) {
  const { t } = useI18n();
  const tb = t.book;
  const [state, formAction] = useActionState(submitBooking, initialFormState);
  const [petType, setPetType] = useState("dog");

  // Field errors come back as dictionary keys; map them to localized text.
  const err = (field: string) => {
    const key = state.errors?.[field]?.[0];
    if (!key) return undefined;
    return (t.errors as Record<string, string>)[key] ?? key;
  };

  if (state.ok) {
    return (
      <Card className="text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          {tb.confirmTitle}
        </h2>
        <p className="mt-3 text-gray-600">{state.message}</p>
        <p className="mt-2 text-sm text-gray-500">{tb.confirmFollowup}</p>
      </Card>
    );
  }

  const opt = t.field.optional;

  return (
    <form action={formAction} className="space-y-8">
      {requestedSitterId && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
          {tb.requestingPrefix}{" "}
          <strong>{requestedSitterName ?? tb.aSpecificSitter}</strong>
          {tb.requestingSuffix}
          <input
            type="hidden"
            name="requested_sitter_id"
            value={requestedSitterId}
          />
        </div>
      )}

      {state.message && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.message}
        </div>
      )}

      {/* Your details */}
      <Card>
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          {tb.sectionYourDetails}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={tb.fullName} htmlFor="buyer_name" required error={err("buyer_name")} optionalLabel={opt}>
            <Input id="buyer_name" name="buyer_name" autoComplete="name" />
          </Field>
          <Field label={tb.email} htmlFor="buyer_email" required error={err("buyer_email")} optionalLabel={opt}>
            <Input id="buyer_email" name="buyer_email" type="email" autoComplete="email" />
          </Field>
          <Field label={tb.phone} htmlFor="buyer_phone" required error={err("buyer_phone")} optionalLabel={opt}>
            <Input id="buyer_phone" name="buyer_phone" type="tel" autoComplete="tel" />
          </Field>
          <Field label={tb.neighborhood} htmlFor="neighborhood" required error={err("neighborhood")} optionalLabel={opt}>
            <Select id="neighborhood" name="neighborhood" defaultValue="">
              <option value="" disabled>
                {tb.selectArea}
              </option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>
                  {t.options.neighborhoods[n] ?? n}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field
              label={tb.fullAddress}
              htmlFor="address_optional"
              hint={tb.fullAddressHint}
              error={err("address_optional")}
              optionalLabel={opt}
            >
              <Input id="address_optional" name="address_optional" autoComplete="street-address" />
            </Field>
          </div>
        </div>
      </Card>

      {/* About your pet */}
      <Card>
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          {tb.sectionAboutPet}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={tb.petType} htmlFor="pet_type" required error={err("pet_type")} optionalLabel={opt}>
            <Select
              id="pet_type"
              name="pet_type"
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
            >
              {PET_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {t.options.petTypes[p.value]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={tb.petName} htmlFor="pet_name" required error={err("pet_name")} optionalLabel={opt}>
            <Input id="pet_name" name="pet_name" />
          </Field>
          {petType === "dog" && (
            <Field label={tb.dogSize} htmlFor="pet_size" error={err("pet_size")} optionalLabel={opt}>
              <Select id="pet_size" name="pet_size" defaultValue="">
                <option value="">{tb.selectSize}</option>
                {DOG_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {t.options.dogSizes[s.value]}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <div className="sm:col-span-2">
            <Field
              label={tb.behaviorNotes}
              htmlFor="behavior_notes"
              hint={tb.behaviorNotesHint}
              error={err("behavior_notes")}
              optionalLabel={opt}
            >
              <Textarea id="behavior_notes" name="behavior_notes" />
            </Field>
          </div>
        </div>
      </Card>

      {/* What you need */}
      <Card>
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          {tb.sectionWhatYouNeed}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={tb.serviceNeeded} htmlFor="service_type" required error={err("service_type")} optionalLabel={opt}>
            <Select id="service_type" name="service_type" defaultValue="">
              <option value="" disabled>
                {tb.selectService}
              </option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {t.options.services[s.value]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={tb.recurrence} htmlFor="recurrence" error={err("recurrence")} optionalLabel={opt}>
            <Select id="recurrence" name="recurrence" defaultValue="one_time">
              {RECURRENCE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {t.options.recurrence[r.value]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={tb.preferredDate} htmlFor="preferred_date" error={err("preferred_date")} optionalLabel={opt}>
            <Input id="preferred_date" name="preferred_date" type="date" />
          </Field>
          <Field
            label={tb.preferredTimeWindow}
            htmlFor="preferred_time_window"
            hint={tb.preferredTimeWindowHint}
            error={err("preferred_time_window")}
            optionalLabel={opt}
          >
            <Input id="preferred_time_window" name="preferred_time_window" />
          </Field>
          <div className="sm:col-span-2">
            <Field
              label={tb.accessInstructions}
              htmlFor="access_instructions"
              hint={tb.accessInstructionsHint}
              error={err("access_instructions")}
              optionalLabel={opt}
            >
              <Textarea
                id="access_instructions"
                name="access_instructions"
                placeholder={tb.accessPlaceholder}
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Safety */}
      <Card>
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          {tb.sectionSafety}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={tb.emergencyName}
            htmlFor="emergency_contact_name"
            error={err("emergency_contact_name")}
            optionalLabel={opt}
          >
            <Input id="emergency_contact_name" name="emergency_contact_name" />
          </Field>
          <Field
            label={tb.emergencyPhone}
            htmlFor="emergency_contact_phone"
            error={err("emergency_contact_phone")}
            optionalLabel={opt}
          >
            <Input
              id="emergency_contact_phone"
              name="emergency_contact_phone"
              type="tel"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field
              label={tb.vetInfo}
              htmlFor="vet_info"
              hint={tb.vetInfoHint}
              error={err("vet_info")}
              optionalLabel={opt}
            >
              <Input id="vet_info" name="vet_info" />
            </Field>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div>
          <Checkbox name="consent" label={tb.consent} />
          {err("consent") && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {err("consent")}
            </p>
          )}
        </div>
        <SubmitButton idle={tb.submit} busy={tb.submitting} />
        <p className="text-center text-xs text-gray-500">{tb.footnote}</p>
      </div>
    </form>
  );
}
