import type { BookingUpdate } from "@/lib/types";

// Renders a booking's activity feed (messages + photo updates). Pure UI so it
// can be used in the buyer dashboard, sitter dashboard and admin detail page.
export default function ActivityTimeline({
  updates,
  emptyLabel,
  locale = "en-GB",
}: {
  updates: BookingUpdate[];
  emptyLabel: string;
  locale?: string;
}) {
  if (updates.length === 0) {
    return <p className="text-sm text-gray-500">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-4">
      {updates.map((u) => (
        <li key={u.id} className="flex gap-3 text-sm">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
          <div className="min-w-0">
            {u.message && <p className="text-gray-800">{u.message}</p>}
            {u.photo_url && (
              // Plain img: Supabase public URLs avoid next/image domain config.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={u.photo_url}
                alt=""
                className="mt-2 max-h-72 rounded-xl border border-gray-200 object-cover"
              />
            )}
            <p className="mt-1 text-xs text-gray-400">
              {new Date(u.created_at).toLocaleString(locale)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
