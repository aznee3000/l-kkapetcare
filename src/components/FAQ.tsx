import { getTranslations } from "@/lib/i18n";

export default async function FAQ() {
  const { t } = await getTranslations();

  return (
    <div className="mx-auto max-w-3xl divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white">
      {t.faq.map((item) => (
        <details key={item.q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900">
            {item.q}
            <span className="text-brand-500 transition group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="mt-3 text-sm text-gray-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
