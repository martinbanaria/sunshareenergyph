-- SunShare Energy PH - Database Schema
-- This schema supports the multi-step onboarding process

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- User onboarding data table
CREATE TABLE IF NOT EXISTS user_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Step 2: ID Information
    id_type TEXT,
    id_file_name TEXT,
    id_file_path TEXT,
    extracted_name TEXT,
    extracted_address TEXT,
    extracted_id_number TEXT, -- Added: Store extracted ID number from OCR
    
    -- Step 3: Property Information
    property_type TEXT CHECK (property_type IN ('residential', 'commercial', 'industrial')),
    ownership_status TEXT CHECK (ownership_status IN ('owner', 'renter', 'manager')),
    street_address TEXT,
    barangay TEXT,
    city TEXT,
    province TEXT,
    zip_code TEXT,
    
    -- Step 4: Preferences
    interested_services JSONB DEFAULT '[]'::JSONB,
    monthly_bill_range TEXT CHECK (monthly_bill_range IN ('below_2k', '2k_5k', '5k_10k', 'above_10k', '')),
    referral_source TEXT CHECK (referral_source IN ('google', 'facebook', 'referral', 'advertisement', 'other', '')),
    
    -- Step 5: Agreements
    terms_accepted BOOLEAN DEFAULT FALSE,
    privacy_accepted BOOLEAN DEFAULT FALSE,
    newsletter_subscribed BOOLEAN DEFAULT FALSE,
    
    -- Meta information
    application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'in_review', 'approved', 'rejected', 'incomplete')),
    installation_timeline TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ID documents table for storing uploaded documents
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

-- Application activity log for audit trail
CREATE TABLE IF NOT EXISTS application_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    onboarding_id UUID REFERENCES user_onboarding(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('created', 'updated', 'status_changed', 'document_uploaded', 'reviewed', 'approved', 'rejected')),
    action_description TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table (optional)
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    action TEXT NOT NULL,
    step INTEGER,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_data JSONB DEFAULT '{}'::JSONB,
    user_agent TEXT,
    viewport TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_status ON user_onboarding(application_status);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_created_at ON user_onboarding(created_at);
CREATE INDEX IF NOT EXISTS idx_application_activity_onboarding_id ON application_activity(onboarding_id);
CREATE INDEX IF NOT EXISTS idx_application_activity_created_at ON application_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_id_documents_user_id ON id_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_id_documents_created_at ON id_documents(created_at);

-- Row Level Security Policies

-- user_onboarding table policies
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own onboarding data
CREATE POLICY "Users can view own onboarding data" ON user_onboarding
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding data" ON user_onboarding
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding data" ON user_onboarding
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin users can view all onboarding data (you can modify this based on your admin logic)
CREATE POLICY "Admins can view all onboarding data" ON user_onboarding
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- application_activity table policies
ALTER TABLE application_activity ENABLE ROW LEVEL SECURITY;

-- Users can view activity related to their onboarding
CREATE POLICY "Users can view own activity" ON application_activity
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_onboarding 
            WHERE id = application_activity.onboarding_id 
            AND user_id = auth.uid()
        )
    );

-- System can insert activity logs
CREATE POLICY "System can insert activity" ON application_activity
    FOR INSERT WITH CHECK (true);

-- analytics_events table policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own analytics events
CREATE POLICY "Users can insert own analytics" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- System can view analytics for reporting
CREATE POLICY "System can view analytics" ON analytics_events
    FOR SELECT USING (true);

-- id_documents table policies
ALTER TABLE id_documents ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own documents
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

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_onboarding_updated_at ON user_onboarding;
CREATE TRIGGER update_user_onboarding_updated_at
    BEFORE UPDATE ON user_onboarding
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to log activity when onboarding data changes
CREATE OR REPLACE FUNCTION log_onboarding_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO application_activity (onboarding_id, actor_id, action_type, action_description)
        VALUES (NEW.id, NEW.user_id, 'created', 'Onboarding application created');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log status changes
        IF OLD.application_status != NEW.application_status THEN
            INSERT INTO application_activity (onboarding_id, actor_id, action_type, action_description, metadata)
            VALUES (NEW.id, auth.uid(), 'status_changed', 
                   'Status changed from ' || OLD.application_status || ' to ' || NEW.application_status,
                   jsonb_build_object('old_status', OLD.application_status, 'new_status', NEW.application_status));
        END IF;
        
        -- Log general updates
        INSERT INTO application_activity (onboarding_id, actor_id, action_type, action_description)
        VALUES (NEW.id, auth.uid(), 'updated', 'Onboarding data updated');
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for activity logging
DROP TRIGGER IF EXISTS log_onboarding_activity_trigger ON user_onboarding;
CREATE TRIGGER log_onboarding_activity_trigger
    AFTER INSERT OR UPDATE ON user_onboarding
    FOR EACH ROW
    EXECUTE FUNCTION log_onboarding_activity();