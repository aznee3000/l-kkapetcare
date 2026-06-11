-- =============================================================================
-- 0005_accounts.sql — Buyer/sitter accounts
--
-- Activates the account seam the MVP was designed around:
--   * booking_requests can be linked to a buyer's auth user (nullable, so the
--     anonymous public booking flow keeps working).
--   * Owner RLS policies let a logged-in buyer read their own bookings and a
--     logged-in sitter read bookings assigned to their profile + their own
--     sitter profile. The admin keeps using the service role (bypasses RLS).
-- Run after 0004_add_vacation_service.sql.
-- =============================================================================

-- Link bookings to a buyer account. Anonymous bookings stay NULL.
alter table booking_requests
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists idx_booking_requests_user on booking_requests (user_id);

-- ---------------------------------------------------------------------------
-- booking_requests: buyer reads own; assigned sitter reads assigned.
-- ---------------------------------------------------------------------------
drop policy if exists "bookings_select_own_buyer" on booking_requests;
create policy "bookings_select_own_buyer" on booking_requests
  for select using (auth.uid() = user_id);

drop policy if exists "bookings_select_assigned_sitter" on booking_requests;
create policy "bookings_select_assigned_sitter" on booking_requests
  for select using (
    assigned_sitter_id in (
      select id from sitter_profiles where user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- booking_updates: visible to the booking's buyer or its assigned sitter.
-- A sitter may also post updates to bookings assigned to them.
-- ---------------------------------------------------------------------------
drop policy if exists "updates_select_participants" on booking_updates;
create policy "updates_select_participants" on booking_updates
  for select using (
    booking_id in (
      select id from booking_requests
      where user_id = auth.uid()
         or assigned_sitter_id in (
           select id from sitter_profiles where user_id = auth.uid()
         )
    )
  );

drop policy if exists "updates_insert_assigned_sitter" on booking_updates;
create policy "updates_insert_assigned_sitter" on booking_updates
  for insert with check (
    booking_id in (
      select id from booking_requests
      where assigned_sitter_id in (
        select id from sitter_profiles where user_id = auth.uid()
      )
    )
  );

-- ---------------------------------------------------------------------------
-- sitter_profiles: owner can read/update own profile (alongside the existing
-- public read of approved profiles).
-- ---------------------------------------------------------------------------
drop policy if exists "sitters_select_own" on sitter_profiles;
create policy "sitters_select_own" on sitter_profiles
  for select using (auth.uid() = user_id);

drop policy if exists "sitters_update_own" on sitter_profiles;
create policy "sitters_update_own" on sitter_profiles
  for update using (auth.uid() = user_id);
