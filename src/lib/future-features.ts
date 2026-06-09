// =============================================================================
// Future features — STUBS / placeholders.
//
// These are intentionally NOT implemented in the MVP. They exist to document
// the seams where each feature will plug in, so the architecture is ready
// without building the feature yet. Each `notImplemented()` call throws so we
// never accidentally ship a half-feature.
//
// See README "Roadmap" for the founder-facing list.
// =============================================================================

export type FutureFeatureKey =
  | "payments"
  | "gps_tracking"
  | "photo_updates"
  | "messaging"
  | "sitter_calendar"
  | "buyer_accounts"
  | "sitter_dashboard";

export const FUTURE_FEATURES: {
  key: FutureFeatureKey;
  title: string;
  description: string;
}[] = [
  {
    key: "payments",
    title: "Online payments",
    description: "Stripe / Vipps checkout. Today the admin marks bookings paid manually.",
  },
  {
    key: "gps_tracking",
    title: "Live GPS walk tracking",
    description: "Show the walk route on a map in near real-time.",
  },
  {
    key: "photo_updates",
    title: "Photo updates",
    description:
      "Sitters upload photos during a visit (stored in booking_updates with type 'photo_update').",
  },
  {
    key: "messaging",
    title: "In-app messaging",
    description: "Direct chat between buyer, sitter and admin.",
  },
  {
    key: "sitter_calendar",
    title: "Sitter availability calendar",
    description: "Structured availability instead of free-text notes.",
  },
  {
    key: "buyer_accounts",
    title: "Buyer accounts",
    description: "Logged-in buyers can track their bookings and rebook.",
  },
  {
    key: "sitter_dashboard",
    title: "Sitter dashboard",
    description: "Sitters log in to see assignments and post updates.",
  },
];

function notImplemented(feature: FutureFeatureKey): never {
  throw new Error(
    `Feature "${feature}" is not implemented in the MVP. See src/lib/future-features.ts`,
  );
}

// ---- Photo updates ---------------------------------------------------------
// FUTURE: a logged-in sitter posts a photo to a booking.
// Storage + the booking_updates table (update_type = 'photo_update') already
// exist — this just needs an authenticated sitter flow + upload UI.
export async function postPhotoUpdate(): Promise<never> {
  return notImplemented("photo_updates");
}

// ---- GPS tracking ----------------------------------------------------------
export async function startWalkTracking(): Promise<never> {
  return notImplemented("gps_tracking");
}

// ---- Messaging -------------------------------------------------------------
export async function sendMessage(): Promise<never> {
  return notImplemented("messaging");
}

// ---- Sitter availability calendar -----------------------------------------
export async function setAvailability(): Promise<never> {
  return notImplemented("sitter_calendar");
}
