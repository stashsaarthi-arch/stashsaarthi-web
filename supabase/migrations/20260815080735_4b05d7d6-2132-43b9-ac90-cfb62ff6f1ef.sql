CREATE TABLE public.waitlist_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  user_type TEXT,
  city TEXT,
  source TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.waitlist_leads TO anon;
GRANT INSERT ON public.waitlist_leads TO authenticated;
GRANT ALL ON public.waitlist_leads TO service_role;

ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
ON public.waitlist_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);