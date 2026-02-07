-- Create id_documents table and RLS policies if not exists
-- This table is needed for document upload functionality

-- Create id_documents table
CREATE TABLE IF NOT EXISTS id_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    storage_path TEXT NOT NULL,
    upload_status TEXT DEFAULT 'uploaded' CHECK (upload_status IN ('uploaded', 'processing', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_id_documents_user_id ON id_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_id_documents_created_at ON id_documents(created_at);

-- Enable RLS for id_documents table
ALTER TABLE id_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Users can view own documents" ON id_documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON id_documents;
DROP POLICY IF EXISTS "Users can update own documents" ON id_documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON id_documents;

-- Create RLS policies for id_documents table
CREATE POLICY "Users can view own documents" ON id_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON id_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON id_documents
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin users can view all documents
CREATE POLICY "Admins can view all documents" ON id_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create updated_at trigger for id_documents if function exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP TRIGGER IF EXISTS update_id_documents_updated_at ON id_documents;
        CREATE TRIGGER update_id_documents_updated_at
            BEFORE UPDATE ON id_documents
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;