-- Row Level Security policies for SunShare onboarding
-- Run this AFTER running 001_initial_schema.sql

-- Enable RLS on all tables
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- user_onboarding table policies
-- Users can only see and modify their own onboarding data
CREATE POLICY "Users can view own onboarding data" ON user_onboarding
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding data" ON user_onboarding
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding data" ON user_onboarding
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin users can view all onboarding data (modify role condition as needed)
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
-- Users can insert their own analytics events
CREATE POLICY "Users can insert own analytics" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- System can view analytics for reporting
CREATE POLICY "System can view analytics" ON analytics_events
    FOR SELECT USING (true);