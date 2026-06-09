-- =============================================================================
-- 0004_add_vacation_service.sql — Add "vacation_care" to the service_type enum
-- Run this in the Supabase SQL editor (or `supabase db push`) after 0001-0003.
-- Adds a third launch service: looking after dogs/cats while the owner is away.
-- =============================================================================

-- Note: ALTER TYPE ... ADD VALUE must run outside an explicit transaction block.
-- Supabase's SQL editor runs this fine as a standalone statement.
alter type service_type add value if not exists 'vacation_care';
