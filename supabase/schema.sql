-- SunShare Philippines Onboarding Database Schema
-- This schema supports the 5-step onboarding wizard

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data consistency
CREATE TYPE property_type AS ENUM ('residential', 'commercial', 'industrial');
CREATE TYPE ownership_status AS ENUM ('own', 'rent', 'manage');
CREATE TYPE id_document_type AS ENUM ('philid', 'drivers_license', 'passport', 'sss', 'umid', 'prc', 'postal');
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'additional_info_needed');

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Add constraints
    CONSTRAINT phone_format CHECK (phone ~ '^\+639[0-9]{9}$')
);

-- User onboarding data table
CREATE TABLE user_onboarding (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Step 2: ID Document information
    id_type id_document_type NOT NULL,
    id_file_name TEXT,
    extracted_name TEXT,
    extracted_address TEXT,
    id_verified BOOLEAN DEFAULT FALSE,
    id_verification_notes TEXT,
    
    -- Step 3: Property details
    property_type property_type NOT NULL,
    ownership_status ownership_status NOT NULL,
    property_address_line1 TEXT NOT NULL,
    property_address_line2 TEXT,
    property_city TEXT NOT NULL,
    property_province TEXT NOT NULL,
    property_postal_code TEXT,
    
    -- Step 4: Preferences
    service_interests TEXT[] DEFAULT '{}',
    monthly_bill_range TEXT NOT NULL,
    referral_source TEXT,
    installation_timeline TEXT,
    
    -- Step 5: Agreements
    terms_accepted BOOLEAN DEFAULT FALSE,
    privacy_accepted BOOLEAN DEFAULT FALSE,
    newsletter_subscribed BOOLEAN DEFAULT FALSE,
    
    -- Application tracking
    application_status application_status DEFAULT 'pending',
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admin_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT terms_must_be_accepted CHECK (terms_accepted = TRUE),
    CONSTRAINT privacy_must_be_accepted CHECK (privacy_accepted = TRUE)
);

-- ID documents table (for secure file storage)
CREATE TABLE id_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    onboarding_id UUID REFERENCES user_onboarding(id) ON DELETE CASCADE NOT NULL,
    
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL, -- Path in Supabase Storage
    
    -- OCR extracted data
    ocr_extracted_name TEXT,
    ocr_extracted_address TEXT,
    ocr_confidence FLOAT,
    ocr_processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Security and audit
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    
    -- File validation
    CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 10485760), -- 10MB max
    CONSTRAINT valid_mime_type CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp'))
);

-- Application activity log (for tracking user interactions)
CREATE TABLE application_activity (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    onboarding_id UUID REFERENCES user_onboarding(id) ON DELETE CASCADE NOT NULL,
    actor_id UUID REFERENCES auth.users(id), -- NULL for system actions
    
    action_type TEXT NOT NULL,
    action_description TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX idx_user_onboarding_status ON user_onboarding(application_status);
CREATE INDEX idx_user_onboarding_submission_date ON user_onboarding(submission_date);
CREATE INDEX idx_id_documents_user_id ON id_documents(user_id);
CREATE INDEX idx_activity_onboarding_created ON application_activity(onboarding_id, created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_onboarding_updated_at 
    BEFORE UPDATE ON user_onboarding 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE id_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_activity ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User onboarding policies
CREATE POLICY "Users can view own onboarding" ON user_onboarding
    FOR SELECT USING (
        user_id IN (SELECT id FROM user_profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can update own onboarding" ON user_onboarding
    FOR UPDATE USING (
        user_id IN (SELECT id FROM user_profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can insert own onboarding" ON user_onboarding
    FOR INSERT WITH CHECK (
        user_id IN (SELECT id FROM user_profiles WHERE id = auth.uid())
    );

-- ID documents policies
CREATE POLICY "Users can view own documents" ON id_documents
    FOR SELECT USING (
        user_id IN (SELECT id FROM user_profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can insert own documents" ON id_documents
    FOR INSERT WITH CHECK (
        user_id IN (SELECT id FROM user_profiles WHERE id = auth.uid())
    );

-- Application activity policies (read-only for users)
CREATE POLICY "Users can view own activity" ON application_activity
    FOR SELECT USING (
        onboarding_id IN (
            SELECT id FROM user_onboarding 
            WHERE user_id IN (SELECT id FROM user_profiles WHERE id = auth.uid())
        )
    );

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user_registration()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, full_name, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user_registration();