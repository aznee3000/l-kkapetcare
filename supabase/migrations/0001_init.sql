-- =============================================================================
-- 0001_init.sql — Core schema for Løkka Pet Care MVP
-- Run this first (Supabase dashboard > SQL Editor, or `supabase db push`).
-- =============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('buyer', 'sitter', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type sitter_status as enum ('pending_review', 'approved', 'rejected', 'unpublished');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_type as enum ('dog_walk', 'cat_checkin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum ('new', 'contacted', 'matched', 'scheduled', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type recurrence_type as enum ('one_time', 'recurring');
exception when duplicate_object then null; end $$;

do $$ begin
  create type update_type as enum ('photo_update', 'walk_completed', 'checkin_completed', 'admin_note', 'status_change');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- profiles — mirrors auth.users; holds role (buyer/sitter/admin)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role user_role not null default 'buyer',
  created_at timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user signs up.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- sitter_profiles
-- ---------------------------------------------------------------------------
create table if not exists sitter_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  neighborhood text,
  bio text,
  pet_experience text,
  profile_photo_url text,
  services_offered text[] not null default '{}',
  dog_sizes_accepted text[] not null default '{}',
  availability_notes text,
  tags text[] not null default '{}',
  status sitter_status not null default 'pending_review',
  id_verified boolean not null default false,
  reference_checked boolean not null default false,
  local_neighbor boolean not null default false,
  pet_experience_verified boolean not null default false,
  completed_bookings_count int not null default 0,
  average_rating numeric,
  starting_price_nok int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_sitter_profiles_updated on sitter_profiles;
create trigger trg_sitter_profiles_updated
  before update on sitter_profiles
  for each row execute function set_updated_at();

create index if not exists idx_sitter_profiles_status on sitter_profiles (status);

-- ---------------------------------------------------------------------------
-- pets
-- ---------------------------------------------------------------------------
create table if not exists pets (
  id uuid primary key default gen_random_uuid(),
  owner_name text,
  owner_email text,
  owner_phone text,
  pet_name text,
  pet_type text,
  pet_size text,
  behavior_notes text,
  vet_info text,
  emergency_contact_name text,
  emergency_contact_phone text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- booking_requests
-- ---------------------------------------------------------------------------
create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  neighborhood text,
  address_optional text,
  pet_id uuid references pets (id) on delete set null,
  pet_type text,
  pet_name text,
  service_type service_type not null,
  preferred_date date,
  preferred_time_window text,
  recurrence recurrence_type not null default 'one_time',
  behavior_notes text,
  access_instructions text,
  emergency_contact_name text,
  emergency_contact_phone text,
  vet_info text,
  requested_sitter_id uuid references sitter_profiles (id) on delete set null,
  assigned_sitter_id uuid references sitter_profiles (id) on delete set null,
  status booking_status not null default 'new',
  admin_notes text,
  paid_manually boolean not null default false,
  price_nok int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_booking_requests_updated on booking_requests;
create trigger trg_booking_requests_updated
  before update on booking_requests
  for each row execute function set_updated_at();

create index if not exists idx_booking_requests_status on booking_requests (status);
create index if not exists idx_booking_requests_assigned on booking_requests (assigned_sitter_id);

-- ---------------------------------------------------------------------------
-- booking_updates — timeline of activity on a booking
-- (FUTURE: photo_update + GPS rows are written here by sitters/automation)
-- ---------------------------------------------------------------------------
create table if not exists booking_updates (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references booking_requests (id) on delete cascade,
  sitter_id uuid references sitter_profiles (id) on delete set null,
  update_type update_type not null,
  message text,
  photo_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_booking_updates_booking on booking_updates (booking_id);

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  sitter_id uuid not null references sitter_profiles (id) on delete cascade,
  booking_id uuid references booking_requests (id) on delete set null,
  reviewer_name text not null,
  rating int not null check (rating between 1 and 5),
  text text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_reviews_sitter on reviews (sitter_id);
