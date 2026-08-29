REVOKE ALL ON public.waitlist_leads FROM anon, authenticated;
GRANT INSERT ON public.waitlist_leads TO anon, authenticated;
GRANT ALL ON public.waitlist_leads TO service_role;
ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;