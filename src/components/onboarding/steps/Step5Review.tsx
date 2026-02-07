'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step5Schema, Step5FormData } from '@/lib/validations/onboarding';
import { OnboardingFormData, ID_TYPES, BILL_RANGES, REFERRAL_SOURCES, SERVICE_OPTIONS } from '@/types/onboarding';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Edit2, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { getFullLegalName, getDisplayName } from '@/lib/validation/name-validation';

interface Step5ReviewProps {
  formData: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData['step5']>) => void;
  onSubmit: () => void;
  onBack: () => void;
  onEditStep: (step: number) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function Step5Review({ formData, onUpdate, onSubmit, onBack, onEditStep, isSubmitting = false, submitError }: Step5ReviewProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step5FormData>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      acceptTerms: formData.step5.acceptTerms,
      acceptPrivacy: formData.step5.acceptPrivacy,
      subscribeNewsletter: formData.step5.subscribeNewsletter,
    },
  });

  const handleFormSubmit = async (data: Step5FormData) => {
    onUpdate(data);
    await onSubmit();
  };

  const getIdTypeLabel = (value: string) => {
    return ID_TYPES.find((t) => t.value === value)?.label || value;
  };

  const getBillRangeLabel = (value: string) => {
    return BILL_RANGES.find((r) => r.value === value)?.label || 'Not specified';
  };

  const getReferralLabel = (value: string) => {
    return REFERRAL_SOURCES.find((s) => s.value === value)?.label || 'Not specified';
  };

  const getServicesLabels = (services: string[]) => {
    if (!services || services.length === 0) return 'None selected';
    return services
      .map((s) => SERVICE_OPTIONS.find((opt) => opt.value === s)?.label || s)
      .join(', ');
  };

  const SectionCard = ({
    title,
    step,
    children,
  }: {
    title: string;
    step: number;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl p-5 border border-sunshare-deep/5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sunshare-deep">{title}</h3>
        <button
          type="button"
          onClick={() => onEditStep(step)}
          className="flex items-center gap-1 text-sm text-sunshare-navy hover:underline"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
      </div>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between">
      <span className="text-sunshare-gray">{label}</span>
      <span className="text-sunshare-deep font-medium text-right">{value || '-'}</span>
    </div>
  );

  const checkboxClass = `
    w-5 h-5 rounded border-2 border-sunshare-deep/30 
    checked:bg-sunshare-lime checked:border-sunshare-lime
    focus:ring-2 focus:ring-sunshare-lime/50
  `;

  const errorClass = 'text-red-500 text-xs mt-1';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Review Sections */}
      <div className="space-y-4">
        {/* Account Info */}
        <SectionCard title="Account Information" step={1}>
          <InfoRow label="Full Name" value={getFullLegalName({
            firstName: formData.step1.firstName,
            middleName: formData.step1.middleName,
            lastName: formData.step1.lastName,
            nickname: formData.step1.nickname,
          })} />
          <InfoRow label="Preferred Name" value={getDisplayName({
            firstName: formData.step1.firstName,
            middleName: formData.step1.middleName,
            lastName: formData.step1.lastName,
            nickname: formData.step1.nickname,
          })} />
          <InfoRow label="Email" value={formData.step1.email} />
          <InfoRow label="Phone" value={formData.step1.phone} />
        </SectionCard>

        {/* ID Info */}
        <SectionCard title="ID Verification" step={2}>
          <InfoRow label="ID Type" value={getIdTypeLabel(formData.step2.idType)} />
          {formData.step2.idImage && (
            <div className="mt-2">
              <img
                src={formData.step2.idImage}
                alt="Uploaded ID"
                className="w-full max-w-xs rounded-lg border border-sunshare-deep/10"
              />
            </div>
          )}
          {formData.step2.extractedName && (
            <InfoRow label="Name on ID" value={formData.step2.extractedName} />
          )}
        </SectionCard>

        {/* Property Info */}
        <SectionCard title="Property Details" step={3}>
          <InfoRow
            label="Property Type"
            value={formData.step3.propertyType.charAt(0).toUpperCase() + formData.step3.propertyType.slice(1)}
          />
          <InfoRow
            label="Ownership"
            value={formData.step3.propertyOwnership.charAt(0).toUpperCase() + formData.step3.propertyOwnership.slice(1)}
          />
          <InfoRow
            label="Address"
            value={`${formData.step3.streetAddress}${formData.step3.barangay ? ', ' + formData.step3.barangay : ''}, ${formData.step3.city}, ${formData.step3.province}${formData.step3.zipCode ? ' ' + formData.step3.zipCode : ''}`}
          />
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="Preferences" step={4}>
          <InfoRow label="Interested In" value={getServicesLabels(formData.step4.interestedServices || [])} />
          <InfoRow label="Monthly Bill" value={getBillRangeLabel(formData.step4.monthlyBillRange || '')} />
          <InfoRow label="Referral Source" value={getReferralLabel(formData.step4.referralSource || '')} />
        </SectionCard>
      </div>

      {/* Terms & Privacy */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sunshare-deep/5">
        <h3 className="font-semibold text-sunshare-deep mb-4">Agreements</h3>

        <div className="space-y-4">
          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              className={checkboxClass}
              onChange={(e) => {
                register('acceptTerms').onChange(e);
                onUpdate({ acceptTerms: e.target.checked });
              }}
            />
            <span className="text-sm text-sunshare-deep">
              I agree to the{' '}
              <a href="/terms" target="_blank" className="text-sunshare-navy underline">
                Terms & Conditions
              </a>{' '}
              <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.acceptTerms && <p className={errorClass}>{errors.acceptTerms.message}</p>}

          {/* Privacy */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('acceptPrivacy')}
              type="checkbox"
              className={checkboxClass}
              onChange={(e) => {
                register('acceptPrivacy').onChange(e);
                onUpdate({ acceptPrivacy: e.target.checked });
              }}
            />
            <span className="text-sm text-sunshare-deep">
              I agree to the{' '}
              <a href="/privacy" target="_blank" className="text-sunshare-navy underline">
                Privacy Policy
              </a>{' '}
              <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.acceptPrivacy && <p className={errorClass}>{errors.acceptPrivacy.message}</p>}

          {/* Newsletter */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('subscribeNewsletter')}
              type="checkbox"
              className={checkboxClass}
              onChange={(e) => {
                register('subscribeNewsletter').onChange(e);
                onUpdate({ subscribeNewsletter: e.target.checked });
              }}
            />
            <span className="text-sm text-sunshare-gray">
              Subscribe to SunShare newsletter for updates and tips (optional)
            </span>
          </label>
        </div>
      </div>

      {/* Error Display */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">
            ⚠️ Registration Error
          </p>
          <p className="text-red-600 text-sm mt-1">
            {submitError}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline-dark" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 w-4 h-4" />
              Complete Registration
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
