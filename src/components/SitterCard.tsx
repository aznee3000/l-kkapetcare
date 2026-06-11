import Image from "next/image";
import { Badge, VerifiedBadge } from "./ui/Badge";
import { LinkButton } from "./ui/Button";
import { SITTER_BADGES } from "@/lib/constants";
import type {
  ServiceType,
  SitterAvailability,
  SitterProfile,
} from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";

function firstName(fullName: string) {
  return fullName.split(" ")[0];
}

// Mon→Sun ordering for the availability summary, keeping 0..6 (Sun..Sat) values.
const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function SitterCard({
  sitter,
  t,
  availability = [],
}: {
  sitter: SitterProfile;
  t: Dictionary;
  availability?: SitterAvailability[];
}) {
  const earnedBadges = SITTER_BADGES.filter((b) => sitter[b.key]);
  const tags = t.options.tags as Record<string, string>;

  const availableDays = WEEKDAY_ORDER.filter((w) =>
    availability.some((a) => a.weekday === w),
  ).map((w) => t.weekdays[String(w) as keyof typeof t.weekdays].slice(0, 3));

  // Self-described tags that map to friendly "type of sitter" badges.
  const lifestyleBadges = sitter.tags.filter((tag) =>
    ["Retired", "Works from home", "Student"].includes(tag),
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-soft">
      <div className="relative h-48 w-full bg-brand-50">
        {sitter.profile_photo_url ? (
          <Image
            src={sitter.profile_photo_url}
            alt={`${firstName(sitter.full_name)}, ${sitter.neighborhood ?? "Oslo"}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">
            🐾
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {firstName(sitter.full_name)}
            </h3>
            <p className="text-sm text-gray-500">{sitter.neighborhood}</p>
          </div>
          {sitter.average_rating != null && (
            <div className="shrink-0 text-right">
              <span className="text-sm font-semibold text-amber-500">
                ★ {sitter.average_rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {sitter.bio && (
          <p className="mt-3 line-clamp-3 text-sm text-gray-600">
            {sitter.bio}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {sitter.services_offered.map((s) => (
            <Badge key={s} tone="brand">
              {t.options.services[s as ServiceType] ?? s}
            </Badge>
          ))}
        </div>

        {(earnedBadges.length > 0 || lifestyleBadges.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {earnedBadges.map((b) => (
              <VerifiedBadge key={b.key} label={t.badges[b.key]} />
            ))}
            {lifestyleBadges.map((tag) => (
              <Badge key={tag} tone="neutral">
                {tags[tag] ?? tag}
              </Badge>
            ))}
          </div>
        )}

        {availableDays.length > 0 && (
          <p className="mt-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">
              {t.sitterCard.availableLabel}:
            </span>{" "}
            {availableDays.join(", ")}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            {sitter.starting_price_nok != null ? (
              <>
                {t.sitterCard.from}{" "}
                <span className="font-semibold text-gray-900">
                  {sitter.starting_price_nok} kr
                </span>
              </>
            ) : (
              <span className="text-gray-400">
                {t.sitterCard.priceOnRequest}
              </span>
            )}
          </span>
          <span className="text-gray-500">
            {sitter.completed_bookings_count} {t.sitterCard.completed}
          </span>
        </div>

        <div className="mt-5 pt-2">
          <LinkButton
            href={`/book?sitter_id=${sitter.id}`}
            variant="primary"
            size="md"
            className="w-full"
          >
            {t.sitterCard.requestThis}
          </LinkButton>
        </div>
      </div>
    </article>
  );
}
