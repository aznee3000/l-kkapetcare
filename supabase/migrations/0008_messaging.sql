-- =============================================================================
-- 0008_messaging.sql — Per-booking in-app messaging (Supabase Realtime)
--
-- A booking's participants (its buyer, its assigned sitter) and any admin can
-- read and post messages. The chat UI subscribes to INSERTs via Realtime.
-- Run after 0007_availability.sql.
-- =============================================================================

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references booking_requests (id) on delete cascade,
  sender_id uuid references auth.users (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists idx_messages_booking on messages (booking_id, created_at);

alter table messages enable row level security;

-- Helper predicate (inlined): the caller participates in the booking.
--   * buyer: booking.user_id = auth.uid()
--   * sitter: booking assigned to a sitter profile the caller owns
-- Admins are allowed via a profiles.role check.

drop policy if exists "messages_select_participants" on messages;
create policy "messages_select_participants" on messages
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    or booking_id in (
      select id from booking_requests
      where user_id = auth.uid()
         or assigned_sitter_id in (
           select id from sitter_profiles where user_id = auth.uid()
         )
    )
  );

drop policy if exists "messages_insert_participants" on messages;
create policy "messages_insert_participants" on messages
  for insert with check (
    sender_id = auth.uid()
    and (
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
      or booking_id in (
        select id from booking_requests
        where user_id = auth.uid()
           or assigned_sitter_id in (
             select id from sitter_profiles where user_id = auth.uid()
           )
      )
    )
  );

-- Stream new messages to subscribed clients.
do $$ begin
  alter publication supabase_realtime add table messages;
exception when duplicate_object then null; end $$;
