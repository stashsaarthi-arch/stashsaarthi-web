-- 1. Ensure private KYC bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. Allow authenticated users to upload their own KYC docs
CREATE POLICY "Users can upload own KYC" ON storage.objects
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[2] = auth.uid()::text);

-- 3. Allow Admin (Advik) to view all KYC docs
CREATE POLICY "Admin full KYC access" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'kyc-documents' AND (auth.jwt() ->> 'email') = 'advik@stashsaarthi.com');
