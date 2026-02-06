'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step4Schema, Step4FormData } from '@/lib/validations/onboarding';
import { Step4Data, SERVICE_OPTIONS, BILL_RANGES, REFERRAL_SOURCES } from '@/types/onboarding';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface Step4PreferencesProps {
  data: Step4Data;
  onUpdate: (data: Partial<Step4Data>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4Preferences({ data, onUpdate, onNext, onBack }: Step4PreferencesProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      interestedServices: data.interestedServices || [],
      monthlyBillRange: data.monthlyBillRange || '',
      referralSource: data.referralSource || '',
    },
  });

  const selectedServices = watch('interestedServices') || [];

  const toggleService = (service: 'solar' | 'bess' | 'monitoring') => {
    const current = selectedServices;
    const updated = current.includes(service)
      ? current.filter((s) => s !== service)
      : [...current, service];
    setValue('interestedServices', updated);
    onUpdate({ interestedServices: updated });
  };

  const onSubmit = (formData: Step4FormData) => {
    onUpdate(formData);
    onNext();
  };

  const selectClass = `
    w-full px-4 py-3 bg-white border border-sunshare-deep/20 rounded-xl 
    text-sunshare-deep appearance-none pr-10
    focus:outline-none focus:border-sunshare-navy focus:ring-1 focus:ring-sunshare-navy/20 
    transition-colors
  `;

  const labelClass = 'block text-sm font-medium text-sunshare-deep mb-2';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sunshare-deep/5">
        <p className="text-sm text-sunshare-gray mb-6">
          All fields on this page are optional. You can skip and update later.
        </p>

        {/* Interested Services */}
        <div className="mb-6">
          <label className={labelClass}>
            What services interest you?
          </label>
          <div className="grid grid-cols-1 gap-3">
            {SERVICE_OPTIONS.map((service) => {
              const isSelected = selectedServices.includes(service.value);
              return (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => toggleService(service.value)}
                  className={`
                    flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
                    ${isSelected
                      ? 'border-sunshare-lime bg-sunshare-lime/10'
                      : 'border-sunshare-deep/10 hover:border-sunshare-deep/30'
                    }
                  `}
                >
                  <div
                    className={`
                      w-6 h-6 rounded-md flex items-center justify-center transition-colors
                      ${isSelected ? 'bg-sunshare-lime' : 'bg-sunshare-deep/10'}
                    `}
                  >
                    {isSelected && <Check className="w-4 h-4 text-sunshare-deep" />}
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-sunshare-deep' : 'text-sunshare-gray'}`}>
                    {service.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Monthly Bill Range */}
        <div className="mb-6">
          <label htmlFor="monthlyBillRange" className={labelClass}>
            Average Monthly Electric Bill
          </label>
          <div className="relative">
            <select
              {...register('monthlyBillRange')}
              id="monthlyBillRange"
              className={selectClass}
              onChange={(e) => {
                register('monthlyBillRange').onChange(e);
                onUpdate({ monthlyBillRange: e.target.value as Step4Data['monthlyBillRange'] });
              }}
            >
              <option value="">Select range (optional)</option>
              {BILL_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-sunshare-deep/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Referral Source */}
        <div className="mb-6">
          <label htmlFor="referralSource" className={labelClass}>
            How did you hear about SunShare?
          </label>
          <div className="relative">
            <select
              {...register('referralSource')}
              id="referralSource"
              className={selectClass}
              onChange={(e) => {
                register('referralSource').onChange(e);
                onUpdate({ referralSource: e.target.value as Step4Data['referralSource'] });
              }}
            >
              <option value="">Select source (optional)</option>
              {REFERRAL_SOURCES.map((source) => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-sunshare-deep/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline-dark" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button type="submit">
          Next Step
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
