import Link from "next/link";

export default function StatCard({
  label,
  value,
  href,
  accent = false,
}: {
  label: string;
  value: number | string;
  href?: string;
  accent?: boolean;
}) {
  const inner = (
    <div
      className={[
        "rounded-2xl border p-5 shadow-soft transition",
        accent
          ? "border-brand-200 bg-brand-50"
          : "border-gray-200 bg-white",
        href ? "hover:border-brand-300 hover:shadow-md" : "",
      ].join(" ")}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
