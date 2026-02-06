-- Storage bucket and policies for ID documents
-- Run this after creating the main schema

-- Create storage bucket for ID documents (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('id-documents', 'id-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for ID documents
CREATE POLICY "Users can upload own documents" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'id-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'id-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own documents" ON storage.objects
FOR DELETE USING (
    bucket_id = 'id-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);