"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitSitterApplication } from "@/app/become-sitter/actions";
import { initialFormState } from "@/lib/form-state";
import {
  DOG_SIZES,
  NEIGHBORHOODS,
  SERVICE_OPTIONS,
  SITTER_TAGS,
} from "@/lib/constants";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Field } from "@/components/ui/Field";
import { Input, Textarea, Select } from "@/components/ui/Input";
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

export default function SitterForm({
  defaults,
}: {
  defaults?: { fullName?: string; email?: string };
}) {
  const { t } = useI18n();
  const ts = t.sitter;
  const [state, formAction] = useActionState(
    submitSitterApplication,
    initialFormState,
  );

  const err = (field: string) => {
    const key = state.errors?.[field]?.[0];
    if (!key) return undefined;
    return (t.errors as Record<string, string>)[key] ?? key;
  };

  if (state.ok) {
    return (
      <Card className="text-center">
        <div className="text-5xl">🙌</div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          {ts.confirmTitle}
        </h2>
        <p className="mt-3 text-gray-600">{state.message}</p>
        <p className="mt-2 text-sm text-gray-500">{ts.confirmFollowup}</p>
      </Card>
    );
  }

  const opt = t.field.optional;
  const tags = t.options.tags as Record<string, string>;

  return (
    <form action={formAction} className="space-y-8">
      {state.message && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.message}
        </div>
      )}

      {/* About you */}
      <Card>
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          {ts.sectionAboutYou}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={ts.fullName} htmlFor="full_name" required error={err("full_name")} optionalLabel={opt}>
            <Input
              id="full_name"
              name="full_name"
              autoComplete="name"
              defaultValue={defaults?.fullName}
            />
          </Field>
          <Field label={ts.email} htmlFor="email" required error={err("email")} optionalLabel={opt}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={defaults?.email}
            />
          </Field>
          <Field label={ts.phone} htmlFor="phone" required error={err("phone")} optionalLabel={opt}>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" />
          </Field>
          <Field label={ts.neighborhood} htmlFor="neighborhood" required error={err("neighborhood")} optionalLabel={opt}>
            <Select id="neighborhood" name="neighborhood" defaultValue="">
              <option value="" disabled>
                {ts.selectArea}
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
              label={ts.profilePhoto}
              htmlFor="profile_photo"
              hint={ts.profilePhotoHint}
              error={err("profile_photo")}
              optionalLabel={opt}
            >
              <Input
                id="profile_photo"
                name="profile_photo"
                type="file"
                accept="image/*"
                className="file:mr-3 file:rounded-full file:border-0 file:bg-brand-100 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-brand-700"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              label={ts.bio}
              htmlFor="bio"
              required
              hint={ts.bioHint}
              error={err("bio")}
              optionalLabel={opt}
            >
              <Textarea id="bio" name="bio" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              label={ts.petExperience}
              htmlFor="pet_experience"
              required
              hint={ts.petExperienceHint}
              error={err("pet_experience")}
              optionalLabel={opt}
            >
              <Textarea id="pet_experience" name="pet_experience" />
            </Field>
          </div>
        </div>
      </Card>

      {/* Services */}
      <Card>
        <h3 className="mb-1 text-lg font-bold text-gray-900">
          {ts.sectionServices}
        </h3>
        <p className="mb-4 text-sm text-gray-500">{ts.servicesSubtitle}</p>
        {err("services_offered") && (
          <p className="mb-3 text-xs font-medium text-red-600">
            {err("services_offered")}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVICE_OPTIONS.map((s) => (
            <Checkbox
              key={s.value}
              name="services_offered"
              value={s.value}
              label={t.options.services[s.value]}
            />
          ))}
        </div>

        <div className="mt-6">
          <h4 className="mb-2 text-sm font-semibold text-gray-800">
            {ts.dogSizesTitle}
          </h4>
          <div className="flex flex-wrap gap-4">
            {DOG_SIZES.map((s) => (
              <Checkbox
                key={s.value}
                name="dog_sizes_accepted"
                value={s.value}
                label={t.options.dogSizes[s.value]}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Availability & tags */}
      <Card>
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          {ts.sectionAvailability}
        </h3>
        <Field
          label={ts.availabilityNotes}
          htmlFor="availability_notes"
          hint={ts.availabilityNotesHint}
          error={err("availability_notes")}
          optionalLabel={opt}
        >
          <Textarea id="availability_notes" name="availability_notes" />
        </Field>

        <div className="mt-6">
          <h4 className="mb-2 text-sm font-semibold text-gray-800">
            {ts.tagsTitle}{" "}
            <span className="font-normal text-gray-400">{ts.tagsHint}</span>
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {SITTER_TAGS.map((tag) => (
              <Checkbox
                key={tag}
                name="tags"
                value={tag}
                label={tags[tag] ?? tag}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Field
            label={ts.references}
            htmlFor="references"
            hint={ts.referencesHint}
            error={err("references")}
            optionalLabel={opt}
          >
            <Textarea id="references" name="references" />
          </Field>
        </div>
      </Card>

      <div className="space-y-4">
        <div>
          <Checkbox name="consent" label={ts.consent} />
          {err("consent") && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {err("consent")}
            </p>
          )}
        </div>
        <SubmitButton idle={ts.submit} busy={ts.submitting} />
        <p className="text-center text-xs text-gray-500">{ts.footnote}</p>
      </div>
    </form>
  );
}
