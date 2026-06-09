-- =============================================================================
-- 0002_rls.sql — Row Level Security policies
-- Run after 0001_init.sql.
--
-- Trust model for the MVP:
--   * The PUBLIC (anon) may INSERT booking requests, pets and sitter
--     applications, and may READ only approved sitters + published reviews.
--   * The ADMIN dashboard talks to Supabase with the SERVICE ROLE key, which
--     bypasses RLS entirely. So we do NOT need admin-specific policies here;
--     keeping RLS strict protects data if the anon key ever leaks.
-- =============================================================================

alter table profiles          enable row level security;
alter table sitter_profiles   enable row level security;
alter table pets              enable row level security;
alter table booking_requests  enable row level security;
alter table booking_updates   enable row level security;
alter table reviews           enable row level security;

-- ---------------------------------------------------------------------------
-- profiles: a logged-in user can read/update only their own profile.
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- sitter_profiles
--   * anyone may read APPROVED sitters (public directory)
--   * anyone may submit an application, but only as 'pending_review'
-- ---------------------------------------------------------------------------
drop policy if exists "sitters_public_read_approved" on sitter_profiles;
create policy "sitters_public_read_approved" on sitter_profiles
  for select using (status = 'approved');

drop policy if exists "sitters_public_apply" on sitter_profiles;
create policy "sitters_public_apply" on sitter_profiles
  for insert with check (status = 'pending_review');

-- ---------------------------------------------------------------------------
-- pets: public may insert (created alongside a booking request).
-- No public read — pet data is sensitive and only admin (service role) needs it.
-- ---------------------------------------------------------------------------
drop policy if exists "pets_public_insert" on pets;
create policy "pets_public_insert" on pets
  for insert with check (true);

-- ---------------------------------------------------------------------------
-- booking_requests: public may insert; no public read.
-- ---------------------------------------------------------------------------
drop policy if exists "bookings_public_insert" on booking_requests;
create policy "bookings_public_insert" on booking_requests
  for insert with check (true);

-- ---------------------------------------------------------------------------
-- reviews: public may read only published reviews. No public write.
-- ---------------------------------------------------------------------------
drop policy if exists "reviews_public_read_published" on reviews;
create policy "reviews_public_read_published" on reviews
  for select using (published = true);

-- booking_updates: no public policies (admin/service-role only for now).
