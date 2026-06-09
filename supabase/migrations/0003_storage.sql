-- =============================================================================
-- 0003_storage.sql — Storage bucket for sitter profile photos
-- Run after 0002_rls.sql.
-- =============================================================================

-- Public-read bucket so approved sitter photos can be shown in the directory.
insert into storage.buckets (id, name, public)
values ('sitter-photos', 'sitter-photos', true)
on conflict (id) do nothing;

-- Anyone may read objects in this bucket (public profile photos).
drop policy if exists "sitter_photos_public_read" on storage.objects;
create policy "sitter_photos_public_read" on storage.objects
  for select using (bucket_id = 'sitter-photos');

-- Anyone may upload (sitter applicants are not logged in for the MVP).
-- FUTURE: restrict to authenticated users once sitters get accounts.
drop policy if exists "sitter_photos_public_upload" on storage.objects;
create policy "sitter_photos_public_upload" on storage.objects
  for insert with check (bucket_id = 'sitter-photos');
