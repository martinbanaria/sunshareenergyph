-- Initial schema for SunShare onboarding system
-- Run this in your Supabase SQL Editor

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