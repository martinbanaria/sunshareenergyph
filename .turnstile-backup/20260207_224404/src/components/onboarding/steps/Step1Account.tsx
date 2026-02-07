'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, Step1FormData } from '@/lib/validations/onboarding';
import { Step1Data } from '@/types/onboarding';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface Step1AccountProps {
  data: Step1Data;
  onUpdate: (data: Partial<Step1Data>) => void;
  onNext: () => void;
}

export function Step1Account({ data, onUpdate, onNext }: Step1AccountProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      nickname: data.nickname,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirmPassword: data.confirmPassword,
      captchaToken: data.captchaToken,
    },
  });

  const onSubmit = (formData: Step1FormData) => {
    onUpdate(formData);
    onNext();
  };

  const handleCaptchaVerify = (token: string) => {
    setValue('captchaToken', token);
    onUpdate({ captchaToken: token });
  };

  const inputClass = `
    w-full px-4 py-3 bg-white border border-sunshare-deep/20 rounded-xl 
    text-sunshare-deep placeholder-sunshare-gray/50 
    focus:outline-none focus:border-sunshare-navy focus:ring-1 focus:ring-sunshare-navy/20 
    transition-colors
  `;

  const labelClass = 'block text-sm font-medium text-sunshare-deep mb-2';
  const errorClass = 'text-red-500 text-xs mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sunshare-deep/5">
        {/* First Name */}
        <div className="mb-5">
          <label htmlFor="firstName" className={labelClass}>
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('firstName')}
            type="text"
            id="firstName"
            placeholder="Juan"
            className={inputClass}
            onChange={(e) => {
              register('firstName').onChange(e);
              onUpdate({ firstName: e.target.value });
            }}
          />
          {errors.firstName && (
            <p className={errorClass}>{errors.firstName.message}</p>
          )}
          <p className="text-xs text-sunshare-gray mt-1">
            Enter your legal first name as it appears on your ID
          </p>
        </div>

        {/* Middle Name */}
        <div className="mb-5">
          <label htmlFor="middleName" className={labelClass}>
            Middle Name <span className="text-sunshare-gray text-sm">(Optional)</span>
          </label>
          <input
            {...register('middleName')}
            type="text"
            id="middleName"
            placeholder="Dela Cruz"
            className={inputClass}
            onChange={(e) => {
              register('middleName').onChange(e);
              onUpdate({ middleName: e.target.value });
            }}
          />
          {errors.middleName && (
            <p className={errorClass}>{errors.middleName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-5">
          <label htmlFor="lastName" className={labelClass}>
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('lastName')}
            type="text"
            id="lastName"
            placeholder="Santos"
            className={inputClass}
            onChange={(e) => {
              register('lastName').onChange(e);
              onUpdate({ lastName: e.target.value });
            }}
          />
          {errors.lastName && (
            <p className={errorClass}>{errors.lastName.message}</p>
          )}
          <p className="text-xs text-sunshare-gray mt-1">
            Enter your legal last name as it appears on your ID
          </p>
        </div>

        {/* Nickname */}
        <div className="mb-5">
          <label htmlFor="nickname" className={labelClass}>
            Nickname/Preferred Name <span className="text-sunshare-gray text-sm">(Optional)</span>
          </label>
          <input
            {...register('nickname')}
            type="text"
            id="nickname"
            placeholder="How you prefer to be called"
            className={inputClass}
            onChange={(e) => {
              register('nickname').onChange(e);
              onUpdate({ nickname: e.target.value });
            }}
          />
          {errors.nickname && (
            <p className={errorClass}>{errors.nickname.message}</p>
          )}
          <p className="text-xs text-sunshare-gray mt-1">
            This is how we'll address you in communications
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label htmlFor="email" className={labelClass}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder="juan@example.com"
            className={inputClass}
            onChange={(e) => {
              register('email').onChange(e);
              onUpdate({ email: e.target.value });
            }}
          />
          {errors.email && (
            <p className={errorClass}>{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label htmlFor="phone" className={labelClass}>
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            placeholder="+63 917 123 4567"
            className={inputClass}
            onChange={(e) => {
              register('phone').onChange(e);
              onUpdate({ phone: e.target.value });
            }}
          />
          {errors.phone && (
            <p className={errorClass}>{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-5">
          <label htmlFor="password" className={labelClass}>
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              className={`${inputClass} pr-12`}
              onChange={(e) => {
                register('password').onChange(e);
                onUpdate({ password: e.target.value });
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sunshare-gray hover:text-sunshare-deep"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Re-enter your password"
              className={`${inputClass} pr-12`}
              onChange={(e) => {
                register('confirmPassword').onChange(e);
                onUpdate({ confirmPassword: e.target.value });
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sunshare-gray hover:text-sunshare-deep"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className={errorClass}>{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* hCaptcha */}
        <div className="mb-5">
          <label className={labelClass}>
            Verification <span className="text-red-500">*</span>
          </label>
          {process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ? (
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
              onVerify={handleCaptchaVerify}
              onExpire={() => setValue('captchaToken', '')}
            />
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
              CAPTCHA not configured. Add NEXT_PUBLIC_HCAPTCHA_SITEKEY to .env.local
            </div>
          )}
          {errors.captchaToken && (
            <p className={errorClass}>{errors.captchaToken.message}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : 'Next Step'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
