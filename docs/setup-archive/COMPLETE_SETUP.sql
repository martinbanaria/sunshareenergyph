-- ============================================================================
-- SUNSHARE ONBOARDING DATABASE SETUP - COPY AND PASTE THIS ENTIRE SCRIPT
-- ============================================================================
-- 
-- Instructions:
-- 1. Go to: https://supabase.com/dashboard/project/eiewhroiqnppkexgppxf
-- 2. Navigate to SQL Editor (left sidebar)
-- 3. Click "New Query"
-- 4. Copy and paste this ENTIRE file 
-- 5. Click "Run" to execute all setup steps
--
-- This script will create:
-- ✅ Tables: user_onboarding, application_activity, analytics_events
-- ✅ Row Level Security policies
-- ✅ Triggers and functions for audit logging
-- ✅ Indexes for performance
--
-- Note: Storage bucket must be created separately via Storage UI
-- ============================================================================

BEGIN;

-- Step 1: Create tables and indexes
-- ============================================================================

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
    
    -- Step 3: Property Information
    property_type TEXT CHECK (property_type IN ('residential', 'commercial', 'industrial')),
    property_ownership TEXT CHECK (property_ownership IN ('owner', 'renter', 'manager')),
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

-- Step 2: Enable Row Level Security and create policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- user_onboarding table policies
-- Users can only see and modify their own onboarding data
DROP POLICY IF EXISTS "Users can view own onboarding data" ON user_onboarding;
CREATE POLICY "Users can view own onboarding data" ON user_onboarding
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own onboarding data" ON user_onboarding;
CREATE POLICY "Users can insert own onboarding data" ON user_onboarding
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own onboarding data" ON user_onboarding;
CREATE POLICY "Users can update own onboarding data" ON user_onboarding
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin users can view all onboarding data (modify role condition as needed)
DROP POLICY IF EXISTS "Admins can view all onboarding data" ON user_onboarding;
CREATE POLICY "Admins can view all onboarding data" ON user_onboarding
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- application_activity table policies
-- Users can view activity related to their onboarding
DROP POLICY IF EXISTS "Users can view own activity" ON application_activity;
CREATE POLICY "Users can view own activity" ON application_activity
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_onboarding 
            WHERE id = application_activity.onboarding_id 
            AND user_id = auth.uid()
        )
    );

-- System can insert activity logs
DROP POLICY IF EXISTS "System can insert activity" ON application_activity;
CREATE POLICY "System can insert activity" ON application_activity
    FOR INSERT WITH CHECK (true);

-- analytics_events table policies
-- Users can insert their own analytics events
DROP POLICY IF EXISTS "Users can insert own analytics" ON analytics_events;
CREATE POLICY "Users can insert own analytics" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- System can view analytics for reporting
DROP POLICY IF EXISTS "System can view analytics" ON analytics_events;
CREATE POLICY "System can view analytics" ON analytics_events
    FOR SELECT USING (true);

-- Step 3: Create triggers and functions
-- ============================================================================

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

COMMIT;

-- ============================================================================
-- SETUP VERIFICATION
-- ============================================================================

-- Verify tables were created
SELECT 'Tables created successfully!' as status 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_onboarding')
  AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'application_activity')
  AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_events');

-- Show table counts
SELECT 
    'user_onboarding' as table_name, 
    COUNT(*) as record_count 
FROM user_onboarding
UNION ALL
SELECT 
    'application_activity' as table_name, 
    COUNT(*) as record_count 
FROM application_activity
UNION ALL
SELECT 
    'analytics_events' as table_name, 
    COUNT(*) as record_count 
FROM analytics_events;

-- ============================================================================
-- ✅ DATABASE SETUP COMPLETE!
--
-- Next steps:
-- 1. Create storage bucket 'id-documents' via Storage UI (Private, 10MB limit)
-- 2. Run the storage policies script (supabase/storage-policies.sql)
-- 3. Test your app at: http://localhost:3000/onboarding
-- ============================================================================