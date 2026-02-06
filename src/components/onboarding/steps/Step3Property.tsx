'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema, Step3FormData } from '@/lib/validations/onboarding';
import { Step3Data } from '@/types/onboarding';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

interface Step3PropertyProps {
  data: Step3Data;
  extractedAddress?: string;
  onUpdate: (data: Partial<Step3Data>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PROPERTY_TYPES = [
  { value: 'residential', label: 'Residential (House/Condo)' },
  { value: 'commercial', label: 'Commercial (Office/Building)' },
  { value: 'industrial', label: 'Industrial' },
];

const OWNERSHIP_TYPES = [
  { value: 'owner', label: 'Owner' },
  { value: 'renter', label: 'Renter / Tenant' },
  { value: 'manager', label: 'Property Manager' },
];

export function Step3Property({ data, extractedAddress, onUpdate, onNext, onBack }: Step3PropertyProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      propertyType: data.propertyType,
      propertyOwnership: data.propertyOwnership,
      streetAddress: data.streetAddress,
      barangay: data.barangay,
      city: data.city,
      province: data.province,
      zipCode: data.zipCode,
    },
  });

  // Pre-fill address from OCR if available and fields are empty
  useEffect(() => {
    if (extractedAddress && !data.streetAddress) {
      setValue('streetAddress', extractedAddress);
      onUpdate({ streetAddress: extractedAddress });
    }
  }, [extractedAddress]);

  const onSubmit = (formData: Step3FormData) => {
    onUpdate(formData);
    onNext();
  };

  const inputClass = `
    w-full px-4 py-3 bg-white border border-sunshare-deep/20 rounded-xl 
    text-sunshare-deep placeholder-sunshare-gray/50 
    focus:outline-none focus:border-sunshare-navy focus:ring-1 focus:ring-sunshare-navy/20 
    transition-colors
  `;

  const selectClass = `${inputClass} appearance-none pr-10`;
  const labelClass = 'block text-sm font-medium text-sunshare-deep mb-2';
  const errorClass = 'text-red-500 text-xs mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sunshare-deep/5">
        {/* Property Type */}
        <div className="mb-5">
          <label htmlFor="propertyType" className={labelClass}>
            Property Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register('propertyType')}
              id="propertyType"
              className={selectClass}
              onChange={(e) => {
                register('propertyType').onChange(e);
                onUpdate({ propertyType: e.target.value as Step3Data['propertyType'] });
              }}
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-sunshare-deep/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.propertyType && <p className={errorClass}>{errors.propertyType.message}</p>}
        </div>

        {/* Ownership */}
        <div className="mb-5">
          <label htmlFor="propertyOwnership" className={labelClass}>
            Ownership Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register('propertyOwnership')}
              id="propertyOwnership"
              className={selectClass}
              onChange={(e) => {
                register('propertyOwnership').onChange(e);
                onUpdate({ propertyOwnership: e.target.value as Step3Data['propertyOwnership'] });
              }}
            >
              {OWNERSHIP_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-sunshare-deep/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.propertyOwnership && <p className={errorClass}>{errors.propertyOwnership.message}</p>}
        </div>

        <hr className="my-6 border-sunshare-deep/10" />

        <h3 className="text-sm font-semibold text-sunshare-deep mb-4">Property Address</h3>

        {/* Street Address */}
        <div className="mb-5">
          <label htmlFor="streetAddress" className={labelClass}>
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('streetAddress')}
            type="text"
            id="streetAddress"
            placeholder="123 Main Street, Building Name, Unit"
            className={inputClass}
            onChange={(e) => {
              register('streetAddress').onChange(e);
              onUpdate({ streetAddress: e.target.value });
            }}
          />
          {errors.streetAddress && <p className={errorClass}>{errors.streetAddress.message}</p>}
        </div>

        {/* Barangay */}
        <div className="mb-5">
          <label htmlFor="barangay" className={labelClass}>
            Barangay
          </label>
          <input
            {...register('barangay')}
            type="text"
            id="barangay"
            placeholder="Barangay name"
            className={inputClass}
            onChange={(e) => {
              register('barangay').onChange(e);
              onUpdate({ barangay: e.target.value });
            }}
          />
        </div>

        {/* City and Province - side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label htmlFor="city" className={labelClass}>
              City / Municipality <span className="text-red-500">*</span>
            </label>
            <input
              {...register('city')}
              type="text"
              id="city"
              placeholder="e.g., Pasig City"
              className={inputClass}
              onChange={(e) => {
                register('city').onChange(e);
                onUpdate({ city: e.target.value });
              }}
            />
            {errors.city && <p className={errorClass}>{errors.city.message}</p>}
          </div>

          <div>
            <label htmlFor="province" className={labelClass}>
              Province <span className="text-red-500">*</span>
            </label>
            <input
              {...register('province')}
              type="text"
              id="province"
              placeholder="e.g., Metro Manila"
              className={inputClass}
              onChange={(e) => {
                register('province').onChange(e);
                onUpdate({ province: e.target.value });
              }}
            />
            {errors.province && <p className={errorClass}>{errors.province.message}</p>}
          </div>
        </div>

        {/* ZIP Code */}
        <div className="mb-5">
          <label htmlFor="zipCode" className={labelClass}>
            ZIP Code
          </label>
          <input
            {...register('zipCode')}
            type="text"
            id="zipCode"
            placeholder="e.g., 1605"
            className={`${inputClass} md:w-1/3`}
            onChange={(e) => {
              register('zipCode').onChange(e);
              onUpdate({ zipCode: e.target.value });
            }}
          />
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
