import { forwardRef } from "react";

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-700">
      <input
        ref={ref}
        type="checkbox"
        className={[
          "mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-400",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      <span>{label}</span>
    </label>
  ),
);
Checkbox.displayName = "Checkbox";
