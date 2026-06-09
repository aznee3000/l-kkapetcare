// Wraps a form control with a label, optional hint and error message.
import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  // Localized "(optional)" suffix. Defaults to English for admin pages that
  // don't pass a translation.
  optionalLabel?: string;
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  optionalLabel = "(optional)",
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-800"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {!required && (
          <span className="ml-1 text-xs font-normal text-gray-400">
            {optionalLabel}
          </span>
        )}
      </label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {children}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
