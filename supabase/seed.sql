-- =============================================================================
-- seed.sql — Optional test data for local development / demos
-- Run after the migrations. Safe to re-run (uses fixed UUIDs + upsert).
-- =============================================================================

-- ---- Approved sitters (shown in the public directory) ----------------------
insert into sitter_profiles (
  id, full_name, email, phone, neighborhood, bio, pet_experience,
  profile_photo_url, services_offered, dog_sizes_accepted, availability_notes,
  tags, status, id_verified, reference_checked, local_neighbor,
  pet_experience_verified, completed_bookings_count, average_rating, starting_price_nok
) values
(
  '11111111-1111-1111-1111-111111111111',
  'Ingrid Solberg', 'ingrid@example.com', '+47 400 00 001', 'Grünerløkka',
  'Retired teacher who has lived by Birkelunden for 20 years. I love long morning walks along Akerselva.',
  'Grew up with three dogs, fostered cats for the local shelter.',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
  array['dog_walk','cat_checkin'], array['small','medium'], 'Weekday mornings and afternoons.',
  array['Retired','Former pet owner','Experienced pet owner'], 'approved',
  true, true, true, true, 42, 4.9, 250
),
(
  '22222222-2222-2222-2222-222222222222',
  'Mathias Berg', 'mathias@example.com', '+47 400 00 002', 'Grünerløkka',
  'Software developer working from home. Happy to break up my day with a good dog walk.',
  'Owned a Labrador for 8 years.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  array['dog_walk'], array['medium','large'], 'Flexible during the day, home office.',
  array['Works from home','Former pet owner'], 'approved',
  true, false, true, true, 17, 4.7, 280
),
(
  '33333333-3333-3333-3333-333333333333',
  'Sofie Hansen', 'sofie@example.com', '+47 400 00 003', 'Sofienberg',
  'Veterinary student at NMBU. Cats are my specialty and I am calm with anxious pets.',
  'Volunteer at a cat shelter, studying veterinary medicine.',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  array['cat_checkin'], array[]::text[], 'Evenings and weekends.',
  array['Student','Experienced pet owner'], 'approved',
  true, true, true, true, 9, 5.0, 220
),
(
  '44444444-4444-4444-4444-444444444444',
  'Anders Lie', 'anders@example.com', '+47 400 00 004', 'Tøyen',
  'Part-time barista and lifelong animal lover. Great with energetic big dogs.',
  'Dog-sat for friends and family for years.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  array['dog_walk','cat_checkin'], array['small','medium','large'], 'Afternoons and weekends.',
  array['Part-time worker','Former pet owner'], 'approved',
  true, false, true, false, 5, 4.5, 240
)
on conflict (id) do nothing;

-- ---- Pending applications (shown in admin > sitters) -----------------------
insert into sitter_profiles (
  id, full_name, email, phone, neighborhood, bio, pet_experience,
  services_offered, dog_sizes_accepted, availability_notes, tags, status
) values
(
  '55555555-5555-5555-5555-555555555555',
  'Nora Pettersen', 'nora@example.com', '+47 400 00 005', 'Grünerløkka',
  'New to dog walking but very enthusiastic and reliable.',
  'Helped neighbors with their dogs.',
  array['dog_walk'], array['small','medium'], 'Weekday evenings.',
  array['Student'], 'pending_review'
),
(
  '66666666-6666-6666-6666-666666666666',
  'Erik Johansen', 'erik@example.com', '+47 400 00 006', 'Sagene',
  'Recently retired, looking for a meaningful way to spend my mornings.',
  'Had dogs my whole life.',
  array['dog_walk','cat_checkin'], array['medium','large'], 'Mornings.',
  array['Retired','Experienced pet owner'], 'pending_review'
)
on conflict (id) do nothing;

-- ---- Booking requests across various statuses ------------------------------
insert into booking_requests (
  id, buyer_name, buyer_email, buyer_phone, neighborhood, pet_type, pet_name,
  service_type, preferred_date, preferred_time_window, recurrence,
  behavior_notes, requested_sitter_id, assigned_sitter_id, status, price_nok, paid_manually
) values
(
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Kari Nordmann', 'kari@example.com', '+47 911 00 001', 'Grünerløkka', 'dog', 'Bella',
  'dog_walk', current_date + 2, 'Morning (08:00-10:00)', 'recurring',
  'Pulls a little on the leash, very friendly.', '11111111-1111-1111-1111-111111111111', null, 'new', null, false
),
(
  'aaaaaaaa-0000-0000-0000-000000000002',
  'Ola Hansen', 'ola@example.com', '+47 911 00 002', 'Sofienberg', 'cat', 'Whiskers',
  'cat_checkin', current_date + 1, 'Evening (17:00-19:00)', 'one_time',
  'Shy with strangers, hides under the bed.', null, '33333333-3333-3333-3333-333333333333', 'matched', 220, false
),
(
  'aaaaaaaa-0000-0000-0000-000000000003',
  'Liv Andersen', 'liv@example.com', '+47 911 00 003', 'Grünerløkka', 'dog', 'Rex',
  'dog_walk', current_date - 1, 'Afternoon (14:00-16:00)', 'one_time',
  'High energy, loves to run.', null, '22222222-2222-2222-2222-222222222222', 'completed', 280, true
)
on conflict (id) do nothing;

-- ---- Published reviews -----------------------------------------------------
insert into reviews (id, sitter_id, booking_id, reviewer_name, rating, text, published)
values
(
  'bbbbbbbb-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111', null, 'Kari N.', 5,
  'Ingrid is wonderful with Bella. Photo updates every time!', true
),
(
  'bbbbbbbb-0000-0000-0000-000000000002',
  '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-0000-0000-0000-000000000002', 'Ola H.', 5,
  'Sofie was so patient with our shy cat. Highly recommend.', true
),
(
  'bbbbbbbb-0000-0000-0000-000000000003',
  '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000003', 'Liv A.', 4,
  'Rex came home happy and tired. Great walk!', true
)
on conflict (id) do nothing;
