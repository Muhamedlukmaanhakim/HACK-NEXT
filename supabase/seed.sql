-- ==============================================================================
-- COLLABMATRIX — SUPABASE DEMO & SEED DATA
-- Run after applying migrations 001 and 002 in Supabase SQL Editor
-- ==============================================================================

-- Note: The demo accounts (Lukmaan Hakim and Dr. Aris Thorne) will be automatically
-- provisioned in profiles and student/faculty profiles upon signing up via Supabase Auth
-- with the email addresses below, or you can insert baseline seeds once Auth users exist.

-- Placeholder demonstration opportunity
-- (Creator ID will link to the authenticated user ID created in auth.users)
COMMENT ON TABLE public.profiles IS 'CollabMatrix campus identity profiles with role enforcement';
COMMENT ON TABLE public.trial_sprints IS '48-72h trial sprint collaboration testbeds';
COMMENT ON TABLE public.contributions IS 'Verifiable individual project contribution ledger';
COMMENT ON TABLE public.team_health_alerts IS 'Forensic project delivery risk alerts and corrective actions';
