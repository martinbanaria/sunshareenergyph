-- Add missing extracted_id_number field to user_onboarding table
-- This field stores the ID number extracted from OCR processing

ALTER TABLE user_onboarding 
ADD COLUMN IF NOT EXISTS extracted_id_number TEXT;

-- Add index for better performance on ID number lookups
CREATE INDEX IF NOT EXISTS idx_user_onboarding_extracted_id_number 
ON user_onboarding(extracted_id_number);

-- Update trigger function to log when ID number is updated
DROP TRIGGER IF EXISTS log_onboarding_activity_trigger ON user_onboarding;

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
        
        -- Log ID number updates
        IF (OLD.extracted_id_number IS NULL OR OLD.extracted_id_number = '') AND 
           (NEW.extracted_id_number IS NOT NULL AND NEW.extracted_id_number != '') THEN
            INSERT INTO application_activity (onboarding_id, actor_id, action_type, action_description)
            VALUES (NEW.id, auth.uid(), 'updated', 'ID number extracted from document');
        END IF;
        
        -- Log general updates
        INSERT INTO application_activity (onboarding_id, actor_id, action_type, action_description)
        VALUES (NEW.id, auth.uid(), 'updated', 'Onboarding data updated');
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE 'plpgsql';

-- Re-create trigger
CREATE TRIGGER log_onboarding_activity_trigger
    AFTER INSERT OR UPDATE ON user_onboarding
    FOR EACH ROW
    EXECUTE FUNCTION log_onboarding_activity();