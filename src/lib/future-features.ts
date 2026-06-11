// =============================================================================
// Future features — STUBS / placeholders.
//
// These are intentionally NOT implemented yet. They exist to document the seams
// where each feature will plug in. Each `notImplemented()` call throws so we
// never accidentally ship a half-feature.
//
// Implemented since the MVP (no longer listed here): photo updates, in-app
// messaging, sitter availability calendar, buyer accounts, sitter dashboard.
//
// See README "Roadmap" for the founder-facing list.
// =============================================================================

export type FutureFeatureKey = "payments" | "gps_tracking";

export const FUTURE_FEATURES: {
  key: FutureFeatureKey;
  title: string;
  description: string;
}[] = [
  {
    key: "payments",
    title: "Online payments",
    description:
      "Stripe / Vipps checkout. Today the admin marks bookings paid manually.",
  },
  {
    key: "gps_tracking",
    title: "Live GPS walk tracking",
    description: "Show the walk route on a map in near real-time.",
  },
];

function notImplemented(feature: FutureFeatureKey): never {
  throw new Error(
    `Feature "${feature}" is not implemented in the MVP. See src/lib/future-features.ts`,
  );
}

// ---- Payments --------------------------------------------------------------
export async function createCheckout(): Promise<never> {
  return notImplemented("payments");
}

// ---- GPS tracking ----------------------------------------------------------
export async function startWalkTracking(): Promise<never> {
  return notImplemented("gps_tracking");
}
