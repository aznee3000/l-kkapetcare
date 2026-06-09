// Shared shape returned by all server actions that back a form.
// `useActionState` on the client reads this to render errors / success.
export type FormState = {
  ok: boolean;
  message?: string;
  // Field-level validation errors keyed by field name.
  errors?: Record<string, string[]>;
};

export const initialFormState: FormState = { ok: false };

// Turns a ZodError.flatten().fieldErrors into our FormState.errors shape.
export function zodErrorsToState(
  fieldErrors: Record<string, string[] | undefined>,
): FormState {
  const errors: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(fieldErrors)) {
    if (value && value.length) errors[key] = value;
  }
  return { ok: false, message: "Please fix the errors below.", errors };
}
