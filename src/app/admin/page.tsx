import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import StatCard from "@/components/admin/StatCard";
import RoadmapCard from "@/components/admin/RoadmapCard";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import { SERVICE_LABELS } from "@/lib/constants";
import type { BookingRequest, SitterProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getOverview() {
  const supabase = createAdminClient();
  const head = () => ({ count: "exact" as const, head: true });

  const [
    pendingBookings,
    pendingSitters,
    activeBookings,
    completedBookings,
    totalSitters,
    totalBookings,
    recentBookings,
    recentApplications,
  ] = await Promise.all([
    supabase
      .from("booking_requests")
      .select("*", head())
      .eq("status", "new"),
    supabase
      .from("sitter_profiles")
      .select("*", head())
      .eq("status", "pending_review"),
    supabase
      .from("booking_requests")
      .select("*", head())
      .in("status", ["contacted", "matched", "scheduled"]),
    supabase
      .from("booking_requests")
      .select("*", head())
      .eq("status", "completed"),
    supabase
      .from("sitter_profiles")
      .select("*", head())
      .eq("status", "approved"),
    supabase.from("booking_requests").select("*", head()),
    supabase
      .from("booking_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("sitter_profiles")
      .select("*")
      .eq("status", "pending_review")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    pendingBookings: pendingBookings.count ?? 0,
    pendingSitters: pendingSitters.count ?? 0,
    activeBookings: activeBookings.count ?? 0,
    completedBookings: completedBookings.count ?? 0,
    totalSitters: totalSitters.count ?? 0,
    totalBookings: totalBookings.count ?? 0,
    recentBookings: (recentBookings.data as BookingRequest[] | null) ?? [],
    recentApplications:
      (recentApplications.data as SitterProfile[] | null) ?? [],
  };
}

export default async function AdminOverviewPage() {
  const data = await getOverview();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your queue at a glance. New requests and applications need your review.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Pending booking requests"
          value={data.pendingBookings}
          href="/admin/bookings?status=new"
          accent={data.pendingBookings > 0}
        />
        <StatCard
          label="Pending sitter applications"
          value={data.pendingSitters}
          href="/admin/sitters?status=pending_review"
          accent={data.pendingSitters > 0}
        />
        <StatCard
          label="Active bookings"
          value={data.activeBookings}
          href="/admin/bookings"
        />
        <StatCard
          label="Completed bookings"
          value={data.completedBookings}
          href="/admin/bookings?status=completed"
        />
        <StatCard
          label="Approved sitters"
          value={data.totalSitters}
          href="/admin/sitters?status=approved"
        />
        <StatCard label="Total bookings" value={data.totalBookings} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent bookings */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Recent requests</h2>
            <Link
              href="/admin/bookings"
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {data.recentBookings.length === 0 && (
              <li className="px-5 py-6 text-sm text-gray-500">
                No booking requests yet.
              </li>
            )}
            {data.recentBookings.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/admin/bookings/${b.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {b.buyer_name} · {b.pet_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {SERVICE_LABELS[b.service_type]} · {b.neighborhood}
                    </p>
                  </div>
                  <BookingStatusBadge status={b.status} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Pending applications */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Sitter applications to review
            </h2>
            <Link
              href="/admin/sitters?status=pending_review"
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {data.recentApplications.length === 0 && (
              <li className="px-5 py-6 text-sm text-gray-500">
                No applications waiting. 🎉
              </li>
            )}
            {data.recentApplications.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/admin/sitters/${s.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {s.full_name}
                    </p>
                    <p className="text-xs text-gray-500">{s.neighborhood}</p>
                  </div>
                  <span className="text-xs font-medium text-brand-700">
                    Review →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <RoadmapCard />
    </div>
  );
}
