import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { SitterStatusBadge } from "@/components/admin/StatusBadge";
import { SITTER_STATUS_LABELS } from "@/lib/constants";
import type { SitterProfile, SitterStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_FILTERS: SitterStatus[] = [
  "pending_review",
  "approved",
  "unpublished",
  "rejected",
];

export default async function AdminSittersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = STATUS_FILTERS.includes(status as SitterStatus)
    ? (status as SitterStatus)
    : undefined;

  const supabase = createAdminClient();
  let query = supabase
    .from("sitter_profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (activeStatus) query = query.eq("status", activeStatus);

  const { data } = await query;
  const sitters = (data as SitterProfile[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sitters</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review applications, verify badges and publish profiles.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/sitters"
          className={[
            "rounded-full px-3 py-1.5 text-sm font-medium",
            !activeStatus
              ? "bg-brand-600 text-white"
              : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50",
          ].join(" ")}
        >
          All
        </Link>
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s}
            href={`/admin/sitters?status=${s}`}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium",
              activeStatus === s
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            {SITTER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Area</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Verified</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sitters.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No sitters found.
                  </td>
                </tr>
              )}
              {sitters.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {s.full_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.neighborhood}</td>
                  <td className="px-4 py-3">
                    <SitterStatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.id_verified ? "🪪 " : ""}
                    {s.reference_checked ? "✅ " : ""}
                    {!s.id_verified && !s.reference_checked && "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/sitters/${s.id}`}
                      className="text-sm font-medium text-brand-700 hover:underline"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
