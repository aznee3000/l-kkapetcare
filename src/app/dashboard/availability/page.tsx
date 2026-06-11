import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOwnSitterProfile } from "@/lib/auth";
import { getTranslations } from "@/lib/i18n";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addSlot, removeSlot } from "./actions";
import type { SitterAvailability } from "@/lib/types";

export const dynamic = "force-dynamic";

// Order Monday→Sunday for display, but keep the 0..6 (Sun..Sat) values.
const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

function hhmm(time: string) {
  return time.slice(0, 5);
}

export default async function AvailabilityPage() {
  const { t } = await getTranslations();
  const sitter = await getOwnSitterProfile();

  if (!sitter) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-soft">
        <h1 className="text-xl font-bold text-gray-900">
          {t.dashboard.availabilityTitle}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          {t.dashboard.becomeSitterPrompt}
        </p>
        <Link
          href="/dashboard/become-sitter"
          className="mt-4 inline-flex rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {t.dashboard.becomeSitterCta}
        </Link>
      </div>
    );
  }

  if (sitter.status !== "approved") {
    const pending = sitter.status === "pending_review";
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-soft">
        <h1 className="text-xl font-bold text-gray-900">
          {pending ? t.dashboard.pendingTitle : t.dashboard.inactiveTitle}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          {pending ? t.dashboard.pendingBody : t.dashboard.inactiveBody}
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("sitter_availability")
    .select("*")
    .eq("sitter_id", sitter.id)
    .order("weekday")
    .order("start_time");
  const slots = (data as SitterAvailability[] | null) ?? [];

  const weekdayLabel = (w: number) =>
    t.weekdays[String(w) as keyof typeof t.weekdays];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t.dashboard.availabilityTitle}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {t.dashboard.availabilityIntro}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        {slots.length === 0 ? (
          <p className="text-sm text-gray-500">{t.dashboard.noSlots}</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {WEEKDAY_ORDER.flatMap((w) =>
              slots
                .filter((s) => s.weekday === w)
                .map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span className="font-medium text-gray-900">
                      {weekdayLabel(s.weekday)}
                    </span>
                    <span className="text-gray-600">
                      {hhmm(s.start_time)}–{hhmm(s.end_time)}
                    </span>
                    <form action={removeSlot}>
                      <input type="hidden" name="slot_id" value={s.id} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-gray-500 hover:text-red-600"
                      >
                        {t.dashboard.removeSlot}
                      </button>
                    </form>
                  </li>
                )),
            )}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <h2 className="mb-3 font-semibold text-gray-900">
          {t.dashboard.addSlot}
        </h2>
        <form
          action={addSlot}
          className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end"
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">
              {t.dashboard.day}
            </span>
            <Select name="weekday" defaultValue="1">
              {WEEKDAY_ORDER.map((w) => (
                <option key={w} value={w}>
                  {weekdayLabel(w)}
                </option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">
              {t.dashboard.fromTime}
            </span>
            <Input name="start_time" type="time" defaultValue="09:00" required />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">
              {t.dashboard.toTime}
            </span>
            <Input name="end_time" type="time" defaultValue="17:00" required />
          </label>
          <Button type="submit">{t.dashboard.saveSlot}</Button>
        </form>
      </div>
    </div>
  );
}
