import type { ReactNode } from "react";

type Tone = "brand" | "sage" | "neutral" | "custom";

const tones: Record<Exclude<Tone, "custom">, string> = {
  brand: "bg-brand-100 text-brand-800",
  sage: "bg-sage-100 text-sage-800",
  neutral: "bg-gray-100 text-gray-700",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const toneClass = tone === "custom" ? "" : tones[tone];
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

// A verification badge with a small check mark, used on sitter cards.
export function VerifiedBadge({ label }: { label: string }) {
  return (
    <Badge tone="sage">
      <span aria-hidden>✓</span>
      {label}
    </Badge>
  );
}
