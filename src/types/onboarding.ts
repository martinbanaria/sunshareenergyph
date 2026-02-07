// Onboarding Types

export type PropertyType = 'residential' | 'commercial' | 'industrial';
export type OwnershipType = 'owner' | 'renter' | 'manager';
export type ServiceInterest = 'solar' | 'bess' | 'monitoring';
export type BillRange = 'below_2k' | '2k_5k' | '5k_10k' | 'above_10k';
export type ReferralSource = 'google' | 'facebook' | 'referral' | 'advertisement' | 'other';

export interface Step1Data {
  // Structured name fields for better validation
  firstName: string;
  middleName: string;
  lastName: string;
  nickname: string; // Optional display name
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  captchaToken: string;
}

export interface Step2Data {
  idType: string;
  idImage: string; // base64 or URL
  idFileName: string;
  // OCR extracted (editable)
  extractedName: string;
  extractedAddress: string;
  extractedIdNumber: string;
}

export interface Step3Data {
  propertyType: PropertyType;
  propertyOwnership: OwnershipType;
  streetAddress: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
}

export interface Step4Data {
  interestedServices: ServiceInterest[];
  monthlyBillRange: BillRange | '';
  referralSource: ReferralSource | '';
}

export interface Step5Data {
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  subscribeNewsletter: boolean;
}

export interface OnboardingFormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  currentStep: number;
  completedSteps: number[];
}

export const INITIAL_ONBOARDING_DATA: OnboardingFormData = {
  step1: {
    firstName: '',
    middleName: '',
    lastName: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    captchaToken: '',
  },
  step2: {
    idType: '',
    idImage: '',
    idFileName: '',
    extractedName: '',
    extractedAddress: '',
    extractedIdNumber: '',
  },
  step3: {
    propertyType: 'residential',
    propertyOwnership: 'owner',
    streetAddress: '',
    barangay: '',
    city: '',
    province: '',
    zipCode: '',
  },
  step4: {
    interestedServices: [],
    monthlyBillRange: '',
    referralSource: '',
  },
  step5: {
    acceptTerms: false,
    acceptPrivacy: false,
    subscribeNewsletter: false,
  },
  currentStep: 1,
  completedSteps: [],
};

export const ID_TYPES = [
  { value: 'philid', label: 'Philippine National ID (PhilID)' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'passport', label: 'Passport' },
  { value: 'sss', label: 'SSS ID' },
  { value: 'umid', label: 'UMID' },
  { value: 'postal', label: 'Postal ID' },
  { value: 'prc', label: 'PRC ID' },
] as const;

export const BILL_RANGES = [
  { value: 'below_2k', label: 'Below P2,000' },
  { value: '2k_5k', label: 'P2,000 - P5,000' },
  { value: '5k_10k', label: 'P5,000 - P10,000' },
  { value: 'above_10k', label: 'Above P10,000' },
] as const;

export const REFERRAL_SOURCES = [
  { value: 'google', label: 'Google Search' },
  { value: 'facebook', label: 'Facebook / Social Media' },
  { value: 'referral', label: 'Friend / Family Referral' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' },
] as const;

export const SERVICE_OPTIONS = [
  { value: 'solar', label: 'Solar Energy Subscription' },
  { value: 'bess', label: 'Solar + Battery Storage (BESS)' },
  { value: 'monitoring', label: 'Energy Monitoring' },
] as const;
