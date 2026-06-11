-- =============================================================================
-- 0009_contact_requests.sql — Contact / help form submissions
--
-- Stores messages sent through the public /contact page. Visitors must leave
-- an email and/or phone so the admin can reply. The public (anon) may INSERT
-- (always as 'new'); there is no public read. The admin dashboard reads/updates
-- with the SERVICE ROLE key, which bypasses RLS.
-- Run after 0008_messaging.sql.
-- =============================================================================

do $$ begin
  create type contact_status as enum ('new', 'resolved');
exception when duplicate_object then null; end $$;

create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  message text not null,
  status contact_status not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_requests_status on contact_requests (status);

alter table contact_requests enable row level security;

-- Public may submit (always as 'new'); no public read.
drop policy if exists "contact_public_insert" on contact_requests;
create policy "contact_public_insert" on contact_requests
  for insert with check (status = 'new');
