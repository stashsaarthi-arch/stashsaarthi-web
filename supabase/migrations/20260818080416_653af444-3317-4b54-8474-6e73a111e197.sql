-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- stash bookings
CREATE TABLE public.stash_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  email TEXT,
  phone TEXT,
  bag_count INTEGER,
  duration_months INTEGER,
  total_amount NUMERIC,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.stash_bookings TO anon;
GRANT INSERT, SELECT ON public.stash_bookings TO authenticated;
GRANT ALL ON public.stash_bookings TO service_role;
ALTER TABLE public.stash_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create a booking" ON public.stash_bookings FOR INSERT TO anon, authenticated WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users read own bookings" ON public.stash_bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- co-living inquiries
CREATE TABLE public.co_living_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT,
  preferred_location TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.co_living_inquiries TO anon;
GRANT INSERT, SELECT ON public.co_living_inquiries TO authenticated;
GRANT ALL ON public.co_living_inquiries TO service_role;
ALTER TABLE public.co_living_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.co_living_inquiries FOR INSERT TO anon, authenticated WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users read own inquiries" ON public.co_living_inquiries FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- waitlist user link
ALTER TABLE public.waitlist_leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- crowdsourced room listings
CREATE TABLE public.crowdsourced_room_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  owner_name TEXT,
  owner_phone TEXT,
  rent_amount NUMERIC,
  address_location TEXT,
  photos_urls TEXT[] NOT NULL DEFAULT '{}',
  student_review TEXT,
  ratings NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending_verification',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.crowdsourced_room_listings TO anon;
GRANT SELECT, INSERT ON public.crowdsourced_room_listings TO authenticated;
GRANT ALL ON public.crowdsourced_room_listings TO service_role;
ALTER TABLE public.crowdsourced_room_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verified listings are public" ON public.crowdsourced_room_listings FOR SELECT TO anon, authenticated USING (status = 'verified');
CREATE POLICY "Students read own listings" ON public.crowdsourced_room_listings FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Anyone can submit a listing" ON public.crowdsourced_room_listings FOR INSERT TO anon, authenticated WITH CHECK (student_id IS NULL OR auth.uid() = student_id);