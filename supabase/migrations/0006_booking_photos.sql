-- =============================================================================
-- 0006_booking_photos.sql — Storage bucket for visit photo updates
--
-- Sitters post photo updates during a visit. Photos go in a public-read bucket
-- (paths are namespaced by booking id + a random uuid, so URLs are unguessable),
-- mirroring the existing sitter-photos approach in 0003_storage.sql.
-- Run after 0005_accounts.sql.
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('booking-photos', 'booking-photos', true)
on conflict (id) do nothing;

-- Anyone may read (URLs are unguessable; shown to the booking's buyer/admin).
drop policy if exists "booking_photos_public_read" on storage.objects;
create policy "booking_photos_public_read" on storage.objects
  for select using (bucket_id = 'booking-photos');

-- Only authenticated users may upload. The server action additionally verifies
-- the uploader is the booking's assigned sitter before writing the row.
drop policy if exists "booking_photos_auth_upload" on storage.objects;
create policy "booking_photos_auth_upload" on storage.objects
  for insert with check (
    bucket_id = 'booking-photos' and auth.role() = 'authenticated'
  );
