import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/Button";
import type { ContactRequest } from "@/lib/types";
import { toggleContactResolved } from "./actions";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminContactPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const requests = (data as ContactRequest[] | null) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Messages sent through the public contact form. Reply by email or
          phone, then mark them resolved.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-soft">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">All messages</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {requests.length === 0 && (
            <li className="px-5 py-6 text-sm text-gray-500">
              No contact requests yet.
            </li>
          )}
          {requests.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-start justify-between gap-3 px-5 py-4"
            >
              <div className="max-w-xl">
                <p className="text-sm font-medium text-gray-900">
                  {r.name || "Anonymous"}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {r.email && (
                    <a
                      href={`mailto:${r.email}`}
                      className="text-brand-700 hover:underline"
                    >
                      {r.email}
                    </a>
                  )}
                  {r.email && r.phone && " · "}
                  {r.phone && (
                    <a
                      href={`tel:${r.phone}`}
                      className="text-brand-700 hover:underline"
                    >
                      {r.phone}
                    </a>
                  )}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                  {r.message}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {formatDate(r.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    r.status === "resolved"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-amber-100 text-amber-700",
                  ].join(" ")}
                >
                  {r.status === "resolved" ? "Resolved" : "New"}
                </span>
                <form action={toggleContactResolved}>
                  <input type="hidden" name="contact_id" value={r.id} />
                  <input
                    type="hidden"
                    name="resolved"
                    value={(r.status !== "resolved").toString()}
                  />
                  <Button type="submit" variant="ghost" size="sm">
                    {r.status === "resolved" ? "Reopen" : "Mark resolved"}
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
