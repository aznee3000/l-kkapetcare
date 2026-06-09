import { createAdminClient } from "@/lib/supabase/admin";
import AddReviewForm from "@/components/admin/AddReviewForm";
import { Button } from "@/components/ui/Button";
import { SERVICE_LABELS } from "@/lib/constants";
import type { BookingRequest, Review, SitterProfile } from "@/lib/types";
import { toggleReviewPublished } from "./actions";

export const dynamic = "force-dynamic";

type ReviewWithSitter = Review & { sitter_profiles: { full_name: string } | null };

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ sitter?: string }>;
}) {
  const { sitter: defaultSitterId } = await searchParams;
  const supabase = createAdminClient();

  const [{ data: sittersData }, { data: bookingsData }, { data: reviewsData }] =
    await Promise.all([
      supabase
        .from("sitter_profiles")
        .select("id, full_name, neighborhood")
        .order("full_name"),
      supabase
        .from("booking_requests")
        .select("id, buyer_name, pet_name, service_type")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("reviews")
        .select("*, sitter_profiles ( full_name )")
        .order("created_at", { ascending: false }),
    ]);

  const sitters = (sittersData as SitterProfile[] | null) ?? [];
  const bookings = (bookingsData as BookingRequest[] | null) ?? [];
  const reviews = (reviewsData as ReviewWithSitter[] | null) ?? [];

  const sitterOptions = sitters.map((s) => ({
    id: s.id,
    label: `${s.full_name} (${s.neighborhood ?? ""})`,
  }));
  const bookingOptions = bookings.map((b) => ({
    id: b.id,
    label: `${b.buyer_name} · ${b.pet_name} · ${SERVICE_LABELS[b.service_type]}`,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add reviews manually after a booking. Published reviews update the
          sitter&apos;s average rating.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-semibold text-gray-900">Add a review</h2>
        <AddReviewForm
          sitters={sitterOptions}
          bookings={bookingOptions}
          defaultSitterId={defaultSitterId}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-soft">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">All reviews</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {reviews.length === 0 && (
            <li className="px-5 py-6 text-sm text-gray-500">No reviews yet.</li>
          )}
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-start justify-between gap-3 px-5 py-4"
            >
              <div className="max-w-xl">
                <p className="text-sm font-medium text-gray-900">
                  {r.sitter_profiles?.full_name ?? "Unknown sitter"} ·{" "}
                  <span className="text-amber-500">
                    {"★".repeat(r.rating)}
                  </span>
                </p>
                {r.text && <p className="mt-1 text-sm text-gray-600">{r.text}</p>}
                <p className="mt-1 text-xs text-gray-400">
                  by {r.reviewer_name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    r.published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500",
                  ].join(" ")}
                >
                  {r.published ? "Published" : "Hidden"}
                </span>
                <form action={toggleReviewPublished}>
                  <input type="hidden" name="review_id" value={r.id} />
                  <input type="hidden" name="sitter_id" value={r.sitter_id} />
                  <input
                    type="hidden"
                    name="published"
                    value={(!r.published).toString()}
                  />
                  <Button type="submit" variant="ghost" size="sm">
                    {r.published ? "Hide" : "Publish"}
                  </Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
