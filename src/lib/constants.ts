// Central place for option lists, labels and display helpers.
// Keeping labels separate from values makes a future Norwegian translation easy:
// only these maps need to change (or be wrapped in an i18n lookup).

import type {
  BookingStatus,
  Recurrence,
  ServiceType,
  SitterStatus,
} from "./types";

export const NEIGHBORHOODS = [
  "Grünerløkka",
  "Sofienberg",
  "Tøyen",
  "Grønland",
  "Gamle Oslo",
  "Sentrum",
  "St. Hanshaugen",
  "Sagene",
  "Frogner",
  "Majorstuen",
  "Nordre Aker",
  "Ullern",
  "Vestre Aker",
  "Bjerke",
  "Østensjø",
  "Nordstrand",
  "Søndre Nordstrand",
  "Alna",
  "Grorud",
  "Stovner",
  "Other",
] as const;

export const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: "dog_walk", label: "Dog walking" },
  { value: "cat_checkin", label: "Cat check-in" },
  { value: "vacation_care", label: "Vacation care" },
];

export const SERVICE_LABELS: Record<ServiceType, string> = {
  dog_walk: "Dog walk",
  cat_checkin: "Cat check-in",
  vacation_care: "Vacation care",
};

export const DOG_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
] as const;

export const PET_TYPES = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "other", label: "Other" },
] as const;

export const RECURRENCE_OPTIONS: { value: Recurrence; label: string }[] = [
  { value: "one_time", label: "One-time" },
  { value: "recurring", label: "Recurring" },
];

// Sitter self-described tags (selected on the application form).
export const SITTER_TAGS = [
  "Retired",
  "Works from home",
  "Student",
  "Part-time worker",
  "Former pet owner",
  "Experienced pet owner",
] as const;

export const BOOKING_STATUSES: BookingStatus[] = [
  "new",
  "contacted",
  "matched",
  "scheduled",
  "completed",
  "cancelled",
];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  new: "New",
  contacted: "Contacted",
  matched: "Matched",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Tailwind classes per status for consistent colored badges.
export const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  matched: "bg-purple-100 text-purple-800",
  scheduled: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-600",
};

export const SITTER_STATUS_LABELS: Record<SitterStatus, string> = {
  pending_review: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  unpublished: "Unpublished",
};

export const SITTER_STATUS_STYLES: Record<SitterStatus, string> = {
  pending_review: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  unpublished: "bg-gray-200 text-gray-600",
};

// Verification badges shown on sitter cards. `key` maps to a boolean column.
export const SITTER_BADGES: {
  key:
    | "id_verified"
    | "reference_checked"
    | "local_neighbor"
    | "pet_experience_verified";
  label: string;
}[] = [
  { key: "id_verified", label: "ID verified" },
  { key: "local_neighbor", label: "Local neighbor" },
  { key: "pet_experience_verified", label: "Pet experience" },
  { key: "reference_checked", label: "Reference checked" },
];
