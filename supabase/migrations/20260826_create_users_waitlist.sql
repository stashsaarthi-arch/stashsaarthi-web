-- Create users_waitlist table for the StashSaarthi waitlist/registration flow
CREATE TABLE public.users_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  user_type TEXT NOT NULL DEFAULT 'student',
  college_or_locality TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  source TEXT DEFAULT 'waitlist_form',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT users_waitlist_email_unique UNIQUE (email)
);

-- Row Level Security
ALTER TABLE public.users_waitlist ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT INSERT ON public.users_waitlist TO anon, authenticated;
GRANT SELECT ON public.users_waitlist TO anon, authenticated;
GRANT ALL ON public.users_waitlist TO service_role;

-- Policies
CREATE POLICY "Anyone can join waitlist"
  ON public.users_waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read waitlist by email"
  ON public.users_waitlist FOR SELECT
  TO anon, authenticated
  USING (true);
