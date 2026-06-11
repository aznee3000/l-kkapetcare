-- =============================================================================
-- 0007_availability.sql — Structured weekly availability for sitters
--
-- Replaces (augments) the free-text availability_notes with weekly recurring
-- time slots. weekday: 0 = Sunday ... 6 = Saturday.
-- Run after 0006_booking_photos.sql.
-- =============================================================================

create table if not exists sitter_availability (
  id uuid primary key default gen_random_uuid(),
  sitter_id uuid not null references sitter_profiles (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_sitter_availability_sitter
  on sitter_availability (sitter_id);

alter table sitter_availability enable row level security;

-- Public may read availability for approved sitters (shown on the directory).
drop policy if exists "availability_public_read" on sitter_availability;
create policy "availability_public_read" on sitter_availability
  for select using (
    sitter_id in (select id from sitter_profiles where status = 'approved')
  );

-- The owning sitter may read/insert/delete their own slots.
drop policy if exists "availability_owner_read" on sitter_availability;
create policy "availability_owner_read" on sitter_availability
  for select using (
    sitter_id in (select id from sitter_profiles where user_id = auth.uid())
  );

drop policy if exists "availability_owner_insert" on sitter_availability;
create policy "availability_owner_insert" on sitter_availability
  for insert with check (
    sitter_id in (select id from sitter_profiles where user_id = auth.uid())
  );

drop policy if exists "availability_owner_delete" on sitter_availability;
create policy "availability_owner_delete" on sitter_availability
  for delete using (
    sitter_id in (select id from sitter_profiles where user_id = auth.uid())
  );
