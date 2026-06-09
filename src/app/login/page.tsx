"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "./actions";
import { initialFormState } from "@/lib/form-state";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(signIn, initialFormState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50/50 px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 font-bold text-brand-700"
        >
          <span className="text-2xl" aria-hidden>
            🐾
          </span>
          <span className="text-lg">Løkka Pet Care</span>
        </Link>

        <div className="rounded-2xl border border-brand-100 bg-white p-8 shadow-soft">
          <h1 className="text-2xl font-bold text-gray-900">Admin sign in</h1>
          <p className="mt-1 text-sm text-gray-500">
            For Løkka Pet Care administrators only.
          </p>

          {state.message && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.message}
            </div>
          )}

          <form action={formAction} className="mt-6 space-y-4">
            <Field label="Email" htmlFor="email" required>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </Field>
            <Field label="Password" htmlFor="password" required>
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
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Create your admin user with the <code>create-admin</code> script — see
          the README.
        </p>
      </div>
    </main>
  );
}
