import { FUTURE_FEATURES } from "@/lib/future-features";

// Placeholder panel listing features that are architected but not yet built.
// Keeps the roadmap visible in the dashboard without shipping half-features.
export default function RoadmapCard() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-6">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-gray-900">Coming soon</h2>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
          Roadmap
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Built into the architecture, not yet enabled for the MVP.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {FUTURE_FEATURES.map((f) => (
          <li
            key={f.key}
            className="rounded-xl border border-gray-100 bg-white p-3"
          >
            <p className="text-sm font-medium text-gray-700">{f.title}</p>
            <p className="mt-0.5 text-xs text-gray-500">{f.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
