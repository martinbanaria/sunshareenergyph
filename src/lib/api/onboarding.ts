import { createClient } from '@/lib/supabase/client';
import { OnboardingFormData } from '@/types/onboarding';
import { getFullLegalName } from '@/lib/validation/name-validation';

export interface SubmissionResult {
  success: boolean;
  error?: string;
  data?: {
    userId: string;
    onboardingId: string;
  };
}

// Development helper to avoid rate limits
function getDevEmail(originalEmail: string): string {
  // Only modify email in development mode
  if (process.env.NODE_ENV !== 'development') {
    return originalEmail;
  }
  
  // Add timestamp to make email unique for testing
  const timestamp = Date.now().toString().slice(-4);
  const [localPart, domain] = originalEmail.split('@');
  return `${localPart}+dev${timestamp}@${domain}`;
}

export async function submitOnboardingData(
  formData: OnboardingFormData
): Promise<SubmissionResult> {
  try {
    const supabase = createClient();

    // Use development email variation to avoid rate limits during testing
    const emailToUse = getDevEmail(formData.step1.email);
    
    // Log email modification in development
    if (process.env.NODE_ENV === 'development' && emailToUse !== formData.step1.email) {
      console.log('🧪 Development Mode: Using email variation to avoid rate limits');
      console.log('Original:', formData.step1.email);
      console.log('Modified:', emailToUse);
    }

    // Step 1: Register user with Supabase Auth
    const fullName = getFullLegalName({
      firstName: formData.step1.firstName,
      middleName: formData.step1.middleName,
      lastName: formData.step1.lastName,
      nickname: formData.step1.nickname,
    });

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailToUse, // Use potentially modified email
      password: formData.step1.password,
      options: {
        data: {
          full_name: fullName,
          phone: formData.step1.phone,
          original_email: formData.step1.email, // Store original email in metadata
        },
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      
      // Handle specific auth errors with user-friendly messages
      let userMessage = authError.message;
      
      if (authError.message.includes('email rate limit exceeded')) {
        userMessage = 'Too many signup attempts. Please try again in a few minutes, or use a different email address.';
      } else if (authError.message.includes('User already registered')) {
        userMessage = 'An account with this email already exists. Please use a different email or try logging in.';
      } else if (authError.message.includes('Invalid email')) {
        userMessage = 'Please enter a valid email address.';
      } else if (authError.message.includes('Password')) {
        userMessage = 'Password does not meet requirements. Please check the password criteria.';
      }
      
      return {
        success: false,
        error: userMessage,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'User registration failed',
      };
    }

    // Step 2: Upload ID document if provided
    let documentPath = '';
    let documentId = '';

    if (formData.step2.idImage && formData.step2.idFileName) {
      const uploadResult = await uploadIdDocument(
        authData.user.id,
        formData.step2.idImage,
        formData.step2.idFileName
      );

      if (!uploadResult.success) {
        console.error('Document upload failed:', uploadResult.error);
        // Continue without document - can be uploaded later
      } else {
        documentPath = uploadResult.path || '';
        documentId = uploadResult.documentId || '';
      }
    }

    // Step 3: Save onboarding data
    const { data: onboardingData, error: onboardingError } = await supabase
      .from('user_onboarding')
      .insert({
        user_id: authData.user.id,
        
        // Step 2 data
        id_type: formData.step2.idType,
        id_file_name: formData.step2.idFileName,
        extracted_name: formData.step2.extractedName,
        extracted_address: formData.step2.extractedAddress,
        extracted_id_number: formData.step2.extractedIdNumber, // Fixed: Added missing field
        
        // Step 3 data
        property_type: formData.step3.propertyType,
        ownership_status: formData.step3.propertyOwnership,
        street_address: formData.step3.streetAddress, // Fixed: Updated to match schema
        barangay: formData.step3.barangay, // Fixed: Updated to match schema
        city: formData.step3.city, // Fixed: Updated to match schema
        province: formData.step3.province, // Fixed: Updated to match schema
        zip_code: formData.step3.zipCode, // Fixed: Updated to match schema
        
        // Step 4 data
        interested_services: formData.step4.interestedServices, // Correct column name from schema
        monthly_bill_range: formData.step4.monthlyBillRange,
        referral_source: formData.step4.referralSource,
        installation_timeline: '', // Not collected in current form
        
        // Step 5 data
        terms_accepted: formData.step5.acceptTerms,
        privacy_accepted: formData.step5.acceptPrivacy,
        newsletter_subscribed: formData.step5.subscribeNewsletter,
        
        // Status
        application_status: 'pending',
      })
      .select()
      .single();

    if (onboardingError) {
      console.error('Onboarding data error:', onboardingError);
      console.error('Error details:', {
        message: onboardingError.message,
        details: onboardingError.details,
        hint: onboardingError.hint,
        code: onboardingError.code
      });
      console.error('Data being inserted:', {
        user_id: authData.user.id,
        id_type: formData.step2.idType,
        id_file_name: formData.step2.idFileName,
        extracted_name: formData.step2.extractedName,
        extracted_address: formData.step2.extractedAddress,
        extracted_id_number: formData.step2.extractedIdNumber,
      });
      return {
        success: false,
        error: onboardingError.message,
      };
    }

    // Step 4: Log activity
    await logActivity(onboardingData.id, authData.user.id, 'application_submitted', 'User completed onboarding wizard');

    // Step 5: Send welcome email (if newsletter subscribed)
    if (formData.step5.subscribeNewsletter) {
      try {
        // Use original email for welcome email, not the dev variation
        await sendWelcomeEmail(formData.step1.email, fullName);
      } catch (emailError) {
        console.error('Welcome email failed:', emailError);
        // Don't fail the entire process for email errors
      }
    }

    return {
      success: true,
      data: {
        userId: authData.user.id,
        onboardingId: onboardingData.id,
      },
    };
  } catch (error) {
    console.error('Submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

async function uploadIdDocument(
  userId: string,
  imageData: string,
  fileName: string
): Promise<{ success: boolean; error?: string; path?: string; documentId?: string }> {
  try {
    const supabase = createClient();

    // Convert base64 to blob
    const base64Response = await fetch(imageData);
    const blob = await base64Response.blob();

    // Create unique file path
    const fileExt = fileName.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('id-documents')
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: false,
      });

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message,
      };
    }

    // Save document metadata
    const { data: docData, error: docError } = await supabase
      .from('id_documents')
      .insert({
        user_id: userId,
        file_name: fileName,
        file_size: blob.size,
        mime_type: blob.type,
        storage_path: filePath,
      })
      .select()
      .single();

    if (docError) {
      // Clean up uploaded file if metadata insert fails
      await supabase.storage.from('id-documents').remove([filePath]);
      return {
        success: false,
        error: docError.message,
      };
    }

    return {
      success: true,
      path: filePath,
      documentId: docData.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

async function logActivity(
  onboardingId: string,
  userId: string,
  actionType: string,
  description: string
): Promise<void> {
  try {
    const supabase = createClient();

    await supabase.from('application_activity').insert({
      onboarding_id: onboardingId,
      actor_id: userId,
      action_type: actionType,
      action_description: description,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw - activity logging is non-critical
  }
}

async function sendWelcomeEmail(email: string, fullName: string): Promise<void> {
  try {
    const response = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        fullName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Welcome email error:', error);
    throw error;
  }
}