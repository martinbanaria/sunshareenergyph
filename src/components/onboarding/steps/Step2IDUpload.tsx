'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema, Step2FormData } from '@/lib/validations/onboarding';
import { Step2Data, ID_TYPES } from '@/types/onboarding';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ArrowLeft, Upload, Camera, X, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Step2IDUploadProps {
  data: Step2Data;
  onUpdate: (data: Partial<Step2Data>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2IDUpload({ data, onUpdate, onNext, onBack }: Step2IDUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      idType: data.idType,
      idImage: data.idImage,
      idFileName: data.idFileName,
      extractedName: data.extractedName,
      extractedAddress: data.extractedAddress,
      extractedIdNumber: data.extractedIdNumber,
    },
  });

  const idImage = watch('idImage');
  const idType = watch('idType');

  // Run OCR when image is uploaded
  useEffect(() => {
    if (idImage && ocrStatus === 'idle') {
      runOCR(idImage);
    }
  }, [idImage]);

  const runOCR = async (imageData: string) => {
    setOcrStatus('processing');
    try {
      // Use our server-side AI OCR API
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          useAI: true // Use AI OCR for best results
        })
      });

      const result = await response.json();

      if (result.success && result.data) {
        const { name, address, idNumber } = result.data;
        
        // Auto-fill extracted data
        if (name) {
          setValue('extractedName', name);
          onUpdate({ extractedName: name });
        }
        if (address) {
          setValue('extractedAddress', address);
          onUpdate({ extractedAddress: address });
        }
        if (idNumber) {
          setValue('extractedIdNumber', idNumber);
          onUpdate({ extractedIdNumber: idNumber });
        }
        
        setOcrStatus('done');
      } else {
        // If AI OCR fails, show error but allow manual entry
        console.warn('OCR failed:', result.error);
        setOcrStatus('error');
      }

    } catch (error) {
      console.error('OCR Error:', error);
      setOcrStatus('error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsProcessing(true);
    setOcrStatus('idle');

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setValue('idImage', base64);
      setValue('idFileName', file.name);
      onUpdate({ idImage: base64, idFileName: file.name });
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setValue('idImage', '');
    setValue('idFileName', '');
    setValue('extractedName', '');
    setValue('extractedAddress', '');
    onUpdate({ idImage: '', idFileName: '', extractedName: '', extractedAddress: '' });
    setOcrStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (formData: Step2FormData) => {
    onUpdate(formData);
    onNext();
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
        {/* ID Type Selection */}
        <div className="mb-5">
          <label htmlFor="idType" className={labelClass}>
            ID Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register('idType')}
              id="idType"
              className={`${inputClass} appearance-none pr-10`}
              onChange={(e) => {
                register('idType').onChange(e);
                onUpdate({ idType: e.target.value });
              }}
            >
              <option value="">Select ID type</option>
              {ID_TYPES.map((type) => (
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
          {errors.idType && <p className={errorClass}>{errors.idType.message}</p>}
        </div>

        {/* ID Upload */}
        <div className="mb-5">
          <label className={labelClass}>
            Upload ID Photo <span className="text-red-500">*</span>
          </label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            id="idUpload"
          />

          {!idImage ? (
            <div className="space-y-3">
              {/* Camera button - mobile friendly */}
              <label
                htmlFor="idUpload"
                className="flex items-center justify-center gap-3 w-full p-6 border-2 border-dashed border-sunshare-deep/20 rounded-xl cursor-pointer hover:border-sunshare-navy hover:bg-sunshare-navy/5 transition-colors"
              >
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 text-sunshare-navy animate-spin" />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-sunshare-navy" />
                    <div className="text-left">
                      <p className="font-medium text-sunshare-deep">Take Photo or Upload</p>
                      <p className="text-sm text-sunshare-gray">Tap to use camera or select file</p>
                    </div>
                  </>
                )}
              </label>
              
              <p className="text-xs text-sunshare-gray text-center">
                Make sure all text on your ID is clearly visible
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image preview */}
              <div className="relative">
                <img
                  src={idImage}
                  alt="Uploaded ID"
                  className="w-full rounded-xl border border-sunshare-deep/10"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* OCR Status */}
              {ocrStatus === 'processing' && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-700">Reading ID information...</span>
                </div>
              )}

              {ocrStatus === 'error' && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    Could not read ID automatically. Please enter your details manually below.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {errors.idImage && <p className={errorClass}>{errors.idImage.message}</p>}
        </div>

        {/* Extracted Data (editable) */}
        {idImage && (
          <>
            <div className="mb-5">
              <label htmlFor="extractedName" className={labelClass}>
                Name on ID <span className="text-sunshare-gray text-xs">(verify/edit)</span>
              </label>
              <input
                {...register('extractedName')}
                type="text"
                id="extractedName"
                placeholder="Name as shown on ID"
                className={inputClass}
                onChange={(e) => {
                  register('extractedName').onChange(e);
                  onUpdate({ extractedName: e.target.value });
                }}
              />
              <p className="text-xs text-sunshare-gray mt-1">
                Please verify this matches your ID exactly
              </p>
            </div>

            <div className="mb-5">
              <label htmlFor="extractedAddress" className={labelClass}>
                Address on ID <span className="text-sunshare-gray text-xs">(optional)</span>
              </label>
              <input
                {...register('extractedAddress')}
                type="text"
                id="extractedAddress"
                placeholder="Address as shown on ID"
                className={inputClass}
                onChange={(e) => {
                  register('extractedAddress').onChange(e);
                  onUpdate({ extractedAddress: e.target.value });
                }}
              />
            </div>

            <div className="mb-5">
              <label htmlFor="extractedIdNumber" className={labelClass}>
                ID Number <span className="text-sunshare-gray text-xs">(verify/edit)</span>
              </label>
              <input
                {...register('extractedIdNumber')}
                type="text"
                id="extractedIdNumber"
                placeholder="ID number as shown on ID"
                className={inputClass}
                onChange={(e) => {
                  register('extractedIdNumber').onChange(e);
                  onUpdate({ extractedIdNumber: e.target.value });
                }}
              />
              <p className="text-xs text-sunshare-gray mt-1">
                Please verify this matches your ID number exactly
              </p>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline-dark" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button type="submit" disabled={!idImage || ocrStatus === 'processing'}>
          Next Step
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {/* Skip for now option */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            // Allow continuing without ID - will need to complete later
            onNext();
          }}
          className="text-sm text-sunshare-gray hover:text-sunshare-navy underline"
        >
          I don&apos;t have my ID right now - continue later
        </button>
      </div>
    </form>
  );
}
