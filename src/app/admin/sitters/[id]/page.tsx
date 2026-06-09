import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { SitterStatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { DOG_SIZES, SERVICE_OPTIONS, SITTER_BADGES } from "@/lib/constants";
import type { SitterProfile } from "@/lib/types";
import { saveSitterProfile, setSitterStatus, toggleBadge } from "../actions";

export const dynamic = "force-dynamic";

export default async function SitterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("sitter_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const sitter = data as SitterProfile;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/sitters"
            className="text-sm text-gray-500 hover:text-brand-700"
          >
            ← Back to sitters
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {sitter.full_name}
          </h1>
          <p className="text-sm text-gray-500">
            {sitter.email} · {sitter.phone}
          </p>
        </div>
        <SitterStatusBadge status={sitter.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: profile + edit */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                {sitter.profile_photo_url ? (
                  <Image
                    src={sitter.profile_photo_url}
                    alt={sitter.full_name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">
                    🐾
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <p>{sitter.bio}</p>
                <p className="mt-2">
                  <span className="font-medium text-gray-800">Experience: </span>
                  {sitter.pet_experience}
                </p>
                {sitter.tags.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    Tags: {sitter.tags.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Edit profile */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 font-semibold text-gray-900">Edit profile</h2>
            <form action={saveSitterProfile} className="space-y-4">
              <input type="hidden" name="sitter_id" value={sitter.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Full name
                  </label>
                  <Input name="full_name" defaultValue={sitter.full_name} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Neighborhood
                  </label>
                  <Input
                    name="neighborhood"
                    defaultValue={sitter.neighborhood ?? ""}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Starting price (NOK)
                  </label>
                  <Input
                    name="starting_price_nok"
                    type="number"
                    min="0"
                    defaultValue={sitter.starting_price_nok ?? ""}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Average rating (0–5)
                  </label>
                  <Input
                    name="average_rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    defaultValue={sitter.average_rating ?? ""}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Bio</label>
                <Textarea name="bio" defaultValue={sitter.bio ?? ""} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Pet experience
                </label>
                <Textarea
                  name="pet_experience"
                  defaultValue={sitter.pet_experience ?? ""}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Availability notes
                </label>
                <Textarea
                  name="availability_notes"
                  defaultValue={sitter.availability_notes ?? ""}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-600">
                    Services offered
                  </p>
                  <div className="space-y-2">
                    {SERVICE_OPTIONS.map((s) => (
                      <Checkbox
                        key={s.value}
                        name="services_offered"
                        value={s.value}
                        label={s.label}
                        defaultChecked={sitter.services_offered.includes(
                          s.value,
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-600">
                    Dog sizes accepted
                  </p>
                  <div className="space-y-2">
                    {DOG_SIZES.map((s) => (
                      <Checkbox
                        key={s.value}
                        name="dog_sizes_accepted"
                        value={s.value}
                        label={s.label}
                        defaultChecked={sitter.dog_sizes_accepted.includes(
                          s.value,
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <Button type="submit" variant="outline">
                Save profile
              </Button>
            </form>
          </div>
        </div>

        {/* Right: status + badges */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-semibold text-gray-900">Approval</h2>
            <div className="space-y-2">
              {sitter.status !== "approved" && (
                <form action={setSitterStatus}>
                  <input type="hidden" name="sitter_id" value={sitter.id} />
                  <input type="hidden" name="status" value="approved" />
                  <Button type="submit" variant="secondary" className="w-full">
                    Approve &amp; publish
                  </Button>
                </form>
              )}
              {sitter.status === "approved" && (
                <form action={setSitterStatus}>
                  <input type="hidden" name="sitter_id" value={sitter.id} />
                  <input type="hidden" name="status" value="unpublished" />
                  <Button type="submit" variant="outline" className="w-full">
                    Unpublish
                  </Button>
                </form>
              )}
              {sitter.status !== "rejected" && (
                <form action={setSitterStatus}>
                  <input type="hidden" name="sitter_id" value={sitter.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <Button type="submit" variant="danger" className="w-full">
                    Reject
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="mb-1 font-semibold text-gray-900">
              Verification badges
            </h2>
            <p className="mb-3 text-xs text-gray-500">
              Toggle after you verify each one manually.
            </p>
            <div className="space-y-2">
              {SITTER_BADGES.map((badge) => {
                const enabled = sitter[badge.key];
                return (
                  <form
                    key={badge.key}
                    action={toggleBadge}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                  >
                    <input type="hidden" name="sitter_id" value={sitter.id} />
                    <input type="hidden" name="field" value={badge.key} />
                    <input
                      type="hidden"
                      name="value"
                      value={(!enabled).toString()}
                    />
                    <span className="text-sm text-gray-700">{badge.label}</span>
                    <button
                      type="submit"
                      className={[
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        enabled
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500",
                      ].join(" ")}
                    >
                      {enabled ? "Verified ✓" : "Not verified"}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-soft">
            <p>
              <span className="font-medium text-gray-700">
                {sitter.completed_bookings_count}
              </span>{" "}
              completed bookings
            </p>
            <Link
              href={`/admin/reviews?sitter=${sitter.id}`}
              className="mt-2 inline-block font-medium text-brand-700 hover:underline"
            >
              Manage reviews →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
