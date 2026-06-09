// Zod schemas shared by forms and server actions.
import { z } from "zod";

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

// For public forms, validation messages are dictionary KEYS (not human text).
// The forms translate them via t.errors[key]. See src/lib/i18n/dictionaries.
const requiredKey = (key: string) => z.string().trim().min(1, key);

const consentField = z
  .union([z.literal("on"), z.literal("true"), z.boolean()])
  .refine((v) => v === "on" || v === "true" || v === true, {
    message: "consent_required",
  });

// ---------------------------------------------------------------------------
// Buyer booking request (/book)
// ---------------------------------------------------------------------------
export const bookingSchema = z.object({
  buyer_name: requiredKey("fullName_required"),
  buyer_email: z.string().trim().email("email_invalid"),
  buyer_phone: requiredKey("phone_required"),
  neighborhood: requiredKey("neighborhood_required"),
  address_optional: z.string().trim().optional().or(z.literal("")),
  pet_type: z.enum(["dog", "cat", "other"], {
    errorMap: () => ({ message: "petType_required" }),
  }),
  pet_name: requiredKey("petName_required"),
  service_type: z.enum(["dog_walk", "cat_checkin", "vacation_care"], {
    errorMap: () => ({ message: "service_required" }),
  }),
  preferred_date: z.string().trim().optional().or(z.literal("")),
  preferred_time_window: z.string().trim().optional().or(z.literal("")),
  recurrence: z.enum(["one_time", "recurring"]),
  pet_size: z.string().trim().optional().or(z.literal("")),
  behavior_notes: z.string().trim().optional().or(z.literal("")),
  access_instructions: z.string().trim().optional().or(z.literal("")),
  emergency_contact_name: z.string().trim().optional().or(z.literal("")),
  emergency_contact_phone: z.string().trim().optional().or(z.literal("")),
  vet_info: z.string().trim().optional().or(z.literal("")),
  requested_sitter_id: z.string().uuid().optional().or(z.literal("")),
  consent: consentField,
});

export type BookingInput = z.infer<typeof bookingSchema>;

// ---------------------------------------------------------------------------
// Sitter application (/become-sitter)
// ---------------------------------------------------------------------------
export const sitterApplicationSchema = z.object({
  full_name: requiredKey("fullName_required"),
  email: z.string().trim().email("email_invalid"),
  phone: requiredKey("phone_required"),
  neighborhood: requiredKey("neighborhood_required"),
  bio: requiredKey("bio_required"),
  pet_experience: requiredKey("petExperience_required"),
  profile_photo_url: z.string().trim().optional().or(z.literal("")),
  services_offered: z
    .array(z.enum(["dog_walk", "cat_checkin", "vacation_care"]))
    .min(1, "services_min"),
  dog_sizes_accepted: z.array(z.enum(["small", "medium", "large"])).optional(),
  availability_notes: z.string().trim().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  references: z.string().trim().optional().or(z.literal("")),
  consent: consentField,
});

export type SitterApplicationInput = z.infer<typeof sitterApplicationSchema>;

// ---------------------------------------------------------------------------
// Admin: add review (/admin/reviews)
// ---------------------------------------------------------------------------
export const reviewSchema = z.object({
  sitter_id: z.string().uuid("Select a sitter"),
  booking_id: z.string().uuid().optional().or(z.literal("")),
  reviewer_name: requiredString("Reviewer name"),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().optional().or(z.literal("")),
  published: z.coerce.boolean().optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
