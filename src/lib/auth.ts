// Server-only auth helpers for the admin area and the buyer/sitter dashboard.
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";
import type { Profile, SitterProfile } from "./types";

// Returns the logged-in user's profile, or null if not logged in.
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (profile as Profile) ?? null;
}

// Guards an admin page/action. Redirects to /login if the caller is not an
// authenticated admin. Returns the admin profile on success.
export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/login?error=not_admin");
  }
  return profile;
}

// Guards any authenticated dashboard page/action. Redirects to /login if the
// caller is not signed in. Returns the auth user.
export async function requireUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }
  return user;
}

// Returns the sitter profile owned by the current user, or null. Used to decide
// whether to show the sitter dashboard.
export async function getOwnSitterProfile(): Promise<SitterProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("sitter_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data as SitterProfile) ?? null;
}

// Links any anonymous rows that match the user's email to their account, so a
// buyer/sitter who signs up after using the public forms sees their history.
// Uses the service-role client (RLS bypass) but is strictly scoped to the
// verified session email — never trusts client input.
export async function claimByEmail(user: User): Promise<void> {
  const email = user.email;
  if (!email) return;

  const admin = createAdminClient();

  // Keep admin accounts entirely separate from buyer/sitter data: never link
  // bookings/sitter profiles to them, and never touch their role.
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role === "admin") return;

  // Link unclaimed bookings made with this email.
  await admin
    .from("booking_requests")
    .update({ user_id: user.id })
    .ilike("buyer_email", email)
    .is("user_id", null);

  // Link an unclaimed sitter profile and promote the account to 'sitter'.
  const { data: linkedSitters } = await admin
    .from("sitter_profiles")
    .update({ user_id: user.id })
    .ilike("email", email)
    .is("user_id", null)
    .select("id");

  if (linkedSitters && linkedSitters.length > 0) {
    // Only ever promote a buyer to sitter — never overwrite another role.
    await admin
      .from("profiles")
      .update({ role: "sitter" })
      .eq("id", user.id)
      .eq("role", "buyer");
  }
}
