-- Storage policies for ID document uploads
-- This file should be run in the Supabase SQL Editor after creating the storage bucket

-- First, create the storage bucket (this is typically done via the Supabase dashboard or CLI)
-- Bucket name: 'id-documents'
-- Public: false (documents should be private)

-- Storage policies for id-documents bucket
-- Note: These policies assume the bucket 'id-documents' exists

-- Policy: Users can upload their own ID documents
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'id-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can view their own ID documents
CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'id-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can update/replace their own ID documents
CREATE POLICY "Users can update own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'id-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own ID documents
CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'id-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Admin users can view all documents (optional - modify based on your admin logic)
CREATE POLICY "Admins can view all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'id-documents' 
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Instructions for setting up the storage bucket:
-- 1. Go to Storage in your Supabase dashboard
-- 2. Create a new bucket named 'id-documents'
-- 3. Set it as Private (not public)
-- 4. File size limit: Set to appropriate size (e.g., 10MB)
-- 5. Allowed MIME types: image/jpeg, image/png, image/jpg, application/pdf
-- 6. Run this SQL file in the SQL Editor after creating the bucket

/*
Example folder structure:
id-documents/
├── user-uuid-1/
│   ├── philid-front.jpg
│   └── philid-back.jpg
├── user-uuid-2/
│   └── drivers-license.jpg
└── user-uuid-3/
    └── passport.jpg
*/