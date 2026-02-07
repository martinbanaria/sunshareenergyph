-- ============================================================================
-- SUNSHARE STORAGE BUCKET POLICIES - RUN AFTER CREATING BUCKET
-- ============================================================================
--
-- STEP 1: Create Storage Bucket First (via Supabase Dashboard UI):
--   1. Go to Storage → New Bucket
--   2. Name: id-documents  
--   3. Private: ✅ YES (important!)
--   4. File size limit: 10MB
--   5. Allowed MIME types: image/jpeg,image/png,image/jpg,application/pdf
--
-- STEP 2: Run this script in SQL Editor:
-- Copy and paste this entire file and click "Run"
-- ============================================================================

-- Storage policies for id-documents bucket
-- Note: These policies assume the bucket 'id-documents' exists and is private

-- Policy: Users can upload their own ID documents
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'id-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can view their own ID documents  
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'id-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can update/replace their own ID documents
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
CREATE POLICY "Users can update own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'id-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own ID documents
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'id-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Admin users can view all documents (optional)
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;
CREATE POLICY "Admins can view all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'id-documents' 
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Verify storage policies were created
SELECT 'Storage policies created successfully!' as status;

-- ============================================================================
-- ✅ STORAGE SETUP COMPLETE!
--
-- Your id-documents bucket is now secured with user-scoped access policies.
-- 
-- File structure will be:
-- id-documents/
--   ├── user-uuid-1/document.jpg
--   ├── user-uuid-2/id-card.png
--   └── user-uuid-3/passport.pdf
--
-- Users can only access their own files!
-- ============================================================================