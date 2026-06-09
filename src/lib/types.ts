// Shared application types. These mirror the Supabase schema in
// supabase/migrations/0001_init.sql. Kept hand-written (rather than generated)
// to stay simple for the MVP.

export type UserRole = "buyer" | "sitter" | "admin";

export type SitterStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "unpublished";

export type ServiceType = "dog_walk" | "cat_checkin" | "vacation_care";

export type BookingStatus =
  | "new"
  | "contacted"
  | "matched"
  | "scheduled"
  | "completed"
  | "cancelled";

export type Recurrence = "one_time" | "recurring";

export type UpdateType =
  | "photo_update"
  | "walk_completed"
  | "checkin_completed"
  | "admin_note"
  | "status_change";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface SitterProfile {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  neighborhood: string | null;
  bio: string | null;
  pet_experience: string | null;
  profile_photo_url: string | null;
  services_offered: string[];
  dog_sizes_accepted: string[];
  availability_notes: string | null;
  tags: string[];
  status: SitterStatus;
  id_verified: boolean;
  reference_checked: boolean;
  local_neighbor: boolean;
  pet_experience_verified: boolean;
  completed_bookings_count: number;
  average_rating: number | null;
  starting_price_nok: number | null;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  owner_name: string | null;
  owner_email: string | null;
  owner_phone: string | null;
  pet_name: string | null;
  pet_type: string | null;
  pet_size: string | null;
  behavior_notes: string | null;
  vet_info: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_at: string;
}

export interface BookingRequest {
  id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  neighborhood: string | null;
  address_optional: string | null;
  pet_id: string | null;
  pet_type: string | null;
  pet_name: string | null;
  service_type: ServiceType;
  preferred_date: string | null;
  preferred_time_window: string | null;
  recurrence: Recurrence;
  behavior_notes: string | null;
  access_instructions: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  vet_info: string | null;
  requested_sitter_id: string | null;
  assigned_sitter_id: string | null;
  status: BookingStatus;
  admin_notes: string | null;
  paid_manually: boolean;
  price_nok: number | null;
  created_at: string;
  updated_at: string;
}

export interface BookingUpdate {
  id: string;
  booking_id: string;
  sitter_id: string | null;
  update_type: UpdateType;
  message: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  sitter_id: string;
  booking_id: string | null;
  reviewer_name: string;
  rating: number;
  text: string | null;
  published: boolean;
  created_at: string;
}
