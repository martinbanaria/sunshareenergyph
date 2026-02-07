-- Migration: Create storage bucket and apply RLS policies for id-documents
-- Created: 2026-02-07

-- Create storage bucket for ID documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'id-documents', 
  'id-documents', 
  false, 
  10485760, -- 10MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
) ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;

-- Policy: Users can upload their own ID documents
-- Path format: {user_id}/{filename}
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

-- Policy: Admin users can view all documents (optional)
-- Assumes admin users have role='admin' in raw_user_meta_data
CREATE POLICY "Admins can view all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'id-documents' 
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );