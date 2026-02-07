-- Database triggers and functions for SunShare onboarding
-- Run this AFTER running 002_rls_policies.sql

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