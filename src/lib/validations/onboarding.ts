import { z } from 'zod';

// Step 1: Account Creation
export const step1Schema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^(\+63|0)?[0-9]{10,11}$/, 'Please enter a valid Philippine phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  captchaToken: z.string().min(1, 'Please complete the CAPTCHA'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Step 2: ID Upload
export const step2Schema = z.object({
  idType: z.string().min(1, 'Please select an ID type'),
  idImage: z.string().min(1, 'Please upload your ID'),
  idFileName: z.string(),
  extractedName: z.string().optional(),
  extractedAddress: z.string().optional(),
  extractedIdNumber: z.string().optional(),
});

// Step 3: Property Details
export const step3Schema = z.object({
  propertyType: z.enum(['residential', 'commercial', 'industrial']),
  propertyOwnership: z.enum(['owner', 'renter', 'manager']),
  streetAddress: z.string().min(5, 'Please enter your street address'),
  barangay: z.string().optional(),
  city: z.string().min(2, 'Please enter your city'),
  province: z.string().min(2, 'Please enter your province'),
  zipCode: z.string().optional(),
});

// Step 4: Energy Preferences (all optional)
export const step4Schema = z.object({
  interestedServices: z.array(z.enum(['solar', 'bess', 'monitoring'])).optional(),
  monthlyBillRange: z.enum(['below_2k', '2k_5k', '5k_10k', 'above_10k', '']).optional(),
  referralSource: z.enum(['google', 'facebook', 'referral', 'advertisement', 'other', '']).optional(),
});

// Step 5: Review & Submit
export const step5Schema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Terms & Conditions',
  }),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Privacy Policy',
  }),
  subscribeNewsletter: z.boolean().optional(),
});

// Full form schema
export const onboardingSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type Step5FormData = z.infer<typeof step5Schema>;
export type OnboardingSchemaType = z.infer<typeof onboardingSchema>;
