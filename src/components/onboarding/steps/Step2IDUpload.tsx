'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema, Step2FormData } from '@/lib/validations/onboarding';
import { Step2Data, Step1Data, ID_TYPES } from '@/types/onboarding';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ArrowLeft, Upload, Camera, X, Loader2, AlertTriangle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { validateIDTypeMatch } from '@/lib/ocr/ai-ocr';
import { validateNameMatch } from '@/lib/validation/name-validation';

interface Step2IDUploadProps {
  data: Step2Data;
  step1Data: Step1Data; // Added for name validation
  onUpdate: (data: Partial<Step2Data>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2IDUpload({ data, step1Data, onUpdate, onNext, onBack }: Step2IDUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [idTypeValidation, setIdTypeValidation] = useState<{
    matches: boolean;
    confidence: 'high' | 'medium' | 'low';
    detectedType?: string;
    suggestion?: string;
    suggestedValue?: string; // Added for the actual ID type value
  } | null>(null);
  const [nameValidation, setNameValidation] = useState<{
    matches: boolean;
    confidence: 'high' | 'medium' | 'low';
    score: number;
    suggestions: string[];
    warnings: string[];
    showDetails: boolean;
  } | null>(null);
  const [lastProcessedImage, setLastProcessedImage] = useState<string>(''); // Track last processed image
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

  // Helper function to get appropriate address placeholder based on ID type
  const getAddressPlaceholder = (selectedIdType: string): string => {
    const idTypeLower = selectedIdType.toLowerCase();
    
    // IDs that typically don't contain addresses
    if (idTypeLower.includes('passport') || 
        idTypeLower.includes('driver') || 
        idTypeLower.includes('license') ||
        idTypeLower.includes('sss') ||
        idTypeLower.includes('prc') ||
        idTypeLower.includes('umid')) {
      return 'Not applicable - this ID type typically does not show address';
    }
    
    // IDs that might contain addresses
    if (idTypeLower.includes('philid') || 
        idTypeLower.includes('national') ||
        idTypeLower.includes('postal') ||
        idTypeLower.includes('voter')) {
      return 'Address as shown on ID (if visible)';
    }
    
    // Default for unknown ID types
    return 'Address if shown on ID';
  };

  // Helper function to determine if address field should be disabled
  const isAddressNotApplicable = (selectedIdType: string): boolean => {
    const idTypeLower = selectedIdType.toLowerCase();
    return idTypeLower.includes('passport') || 
           idTypeLower.includes('driver') || 
           idTypeLower.includes('license') ||
           idTypeLower.includes('sss') ||
           idTypeLower.includes('prc') ||
           idTypeLower.includes('umid');
  };

  // Run OCR when a new image is uploaded
  useEffect(() => {
    const extractedName = watch('extractedName');
    const extractedAddress = watch('extractedAddress');
    const extractedIdNumber = watch('extractedIdNumber');
    
    // Only run OCR if:
    // 1. There's an image
    // 2. OCR status is idle (not already processing)
    // 3. This is a new image (different from last processed)
    // 4. Fields are empty (no previous OCR data or user has cleared them)
    const shouldRunOCR = idImage && 
                        ocrStatus === 'idle' && 
                        idImage !== lastProcessedImage &&
                        (!extractedName && !extractedAddress && !extractedIdNumber);
    
    if (shouldRunOCR) {
      console.log('🔄 Running OCR for new image...');
      runOCR(idImage);
    } else if (idImage && idImage !== lastProcessedImage && (extractedName || extractedAddress || extractedIdNumber)) {
      console.log('⏭️ Skipping OCR - fields already populated');
      // Update the last processed image to prevent future runs
      setLastProcessedImage(idImage);
      setOcrStatus('done'); // Set status to done since we're skipping
    }
  }, [idImage, ocrStatus]);

  const runOCR = async (imageData: string) => {
    setOcrStatus('processing');
    setIdTypeValidation(null); // Reset validation state
    setNameValidation(null); // Reset name validation state
    
    try {
      console.log('🚀 Starting OCR process...');
      console.log('Image data length:', imageData.length);
      console.log('Image type:', imageData.substring(0, 50));
      
      // Mark this image as being processed
      setLastProcessedImage(imageData);
      
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

      console.log('📡 OCR API response status:', response.status);
      console.log('📡 OCR API response headers:', Object.fromEntries(response.headers.entries()));

      // Check if the response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please try again.');
      }

      const result = await response.json();
      console.log('📊 OCR API full response:', result);

      if (result.success && result.data) {
        const { name, address, idNumber, idType } = result.data;
        console.log('✅ OCR Success! Extracted data:', { 
          name: name || 'EMPTY', 
          address: address || 'EMPTY', 
          idNumber: idNumber || 'EMPTY',
          idType: idType || 'EMPTY'
        });
        
        // Validate ID type match
        const selectedIdType = watch('idType');
        if (selectedIdType && idType) {
          const validation = validateIDTypeMatch(selectedIdType, idType);
          setIdTypeValidation({
            matches: validation.matches,
            confidence: validation.confidence,
            detectedType: idType,
            suggestion: validation.suggestion,
            suggestedValue: validation.suggestedValue
          });
          
          console.log('🔍 ID Type Validation:', {
            selected: selectedIdType,
            detected: idType,
            matches: validation.matches,
            confidence: validation.confidence,
            suggestion: validation.suggestion,
            suggestedValue: validation.suggestedValue
          });
        }
        
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
        
        // Perform name validation between Step 1 user input and extracted name
        if (name && step1Data) {
          const nameValidationResult = validateNameMatch({
            firstName: step1Data.firstName,
            middleName: step1Data.middleName,
            lastName: step1Data.lastName,
            nickname: step1Data.nickname,
          }, name);
          
          setNameValidation({
            matches: nameValidationResult.matches,
            confidence: nameValidationResult.confidence,
            score: nameValidationResult.score,
            suggestions: nameValidationResult.details.suggestions || [],
            warnings: nameValidationResult.details.warnings || [],
            showDetails: false,
          });
          
          console.log('👤 Name Validation:', {
            userFormat: nameValidationResult.details.userFormat,
            extractedFormat: nameValidationResult.details.extractedFormat,
            matches: nameValidationResult.matches,
            confidence: nameValidationResult.confidence,
            score: nameValidationResult.score,
            suggestions: nameValidationResult.details.suggestions,
            warnings: nameValidationResult.details.warnings,
          });
        }
        
        setOcrStatus('done');
      } else {
        // If AI OCR fails, show error but allow manual entry
        console.warn('❌ OCR failed:', result.error);
        console.warn('📄 OCR method:', result.method);
        console.warn('📄 OCR fallback available:', result.fallbackAvailable);
        setOcrStatus('error');
      }

    } catch (error) {
      console.error('💥 OCR Error:', error);
      setOcrStatus('error');
      
      // If it's a JSON parsing error, show a more helpful message
      if (error instanceof Error && error.message.includes('JSON')) {
        console.error('🚨 Server returned non-JSON response - possible authentication or server error');
      }
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
    setValue('extractedIdNumber', '');
    onUpdate({ 
      idImage: '', 
      idFileName: '', 
      extractedName: '', 
      extractedAddress: '', 
      extractedIdNumber: '' 
    });
    setOcrStatus('idle');
    setIdTypeValidation(null); // Reset ID type validation
    setNameValidation(null); // Reset name validation
    setLastProcessedImage(''); // Reset processed image tracker
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
                
                // Re-validate ID type if we have OCR data
                const currentOcrData = watch(['extractedName', 'extractedAddress', 'extractedIdNumber']);
                if (ocrStatus === 'done' && currentOcrData.some(Boolean)) {
                  // Re-run validation with new ID type selection
                  setIdTypeValidation(null); // Will be recalculated on next OCR or can be triggered here
                }
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
          
          {/* ID Type Specific Guidance */}
          {idType && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">What to expect with {ID_TYPES.find(type => type.value === idType)?.label}:</h4>
              <div className="text-xs text-blue-700 space-y-1">
                {idType === 'philid' && (
                  <>
                    <p>• Should contain your full legal name and address</p>
                    <p>• Look for the 16-digit PSN/PCN number (XXXX-XXXX-XXXX-XXXX)</p>
                  </>
                )}
                {idType === 'drivers_license' && (
                  <>
                    <p>• Contains full name and license number (A12-34-567890 format)</p>
                    <p>• Address shown may be different from current home address</p>
                  </>
                )}
                {idType === 'passport' && (
                  <>
                    <p>• Contains full name and passport number (AB1234567 format)</p>
                    <p>• Does not show home address</p>
                  </>
                )}
                {idType === 'sss' && (
                  <>
                    <p>• Contains full name and SSS number (XX-XXXXXXX-X format)</p>
                    <p>• Does not typically show address</p>
                  </>
                )}
                {idType === 'umid' && (
                  <>
                    <p>• Unified ID containing name and UMID number</p>
                    <p>• Address information varies by version</p>
                  </>
                )}
                {idType === 'postal' && (
                  <>
                    <p>• May contain name and address information</p>
                    <p>• Look for postal ID number</p>
                  </>
                )}
                {idType === 'prc' && (
                  <>
                    <p>• Professional license with name and PRC number</p>
                    <p>• Does not show home address</p>
                  </>
                )}
              </div>
            </div>
          )}
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
                  <p className="text-sm text-yellow-700 mb-2">
                    Could not read ID automatically. Please enter your details manually below.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOcrStatus('idle');
                      runOCR(idImage);
                    }}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Retry OCR
                  </button>
                </div>
              )}

              {/* Re-run OCR button when fields are populated but user wants to re-extract */}
              {idImage && ocrStatus === 'done' && (watch('extractedName') || watch('extractedAddress') || watch('extractedIdNumber')) && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700 font-medium mb-1">OCR Data Available</p>
                      <p className="text-xs text-gray-600">Information has been extracted from your ID. You can edit the fields below or re-run OCR.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // Clear existing data and re-run OCR
                        setValue('extractedName', '');
                        setValue('extractedAddress', '');
                        setValue('extractedIdNumber', '');
                        onUpdate({ extractedName: '', extractedAddress: '', extractedIdNumber: '' });
                        setIdTypeValidation(null);
                        setNameValidation(null);
                        setOcrStatus('idle');
                        setLastProcessedImage(''); // Reset to allow re-processing
                        runOCR(idImage);
                      }}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Re-run OCR
                    </button>
                  </div>
                </div>
              )}

              {/* ID Type Validation Warning */}
              {idTypeValidation && !idTypeValidation.matches && idTypeValidation.detectedType && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-orange-800 mb-1">
                        ID Type Mismatch Detected
                      </p>
                      <p className="text-orange-700 mb-2">
                        You selected "{ID_TYPES.find(type => type.value === watch('idType'))?.label}" 
                        but the uploaded document appears to be a "{idTypeValidation.detectedType}".
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (idTypeValidation.suggestedValue) {
                              setValue('idType', idTypeValidation.suggestedValue);
                              onUpdate({ idType: idTypeValidation.suggestedValue });
                              setIdTypeValidation(null);
                            }
                          }}
                          className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                        >
                          {idTypeValidation.suggestedValue ? 'Correct ID Type' : 'Update Selection'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIdTypeValidation(null)}
                          className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                        >
                          Keep Current Selection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ID Type Match Confirmation */}
              {idTypeValidation && idTypeValidation.matches && idTypeValidation.confidence === 'high' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-sm text-green-700">
                      ID type matches selection - {idTypeValidation.detectedType} confirmed
                    </p>
                  </div>
                </div>
              )}

              {/* Name Validation Warning */}
              {nameValidation && !nameValidation.matches && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm flex-1">
                      <p className="font-medium text-red-800 mb-1">
                        Name Mismatch Detected
                      </p>
                      <p className="text-red-700 mb-2">
                        The name on your ID doesn't closely match the name you entered in Step 1. 
                        Please ensure you're using your legal name as it appears on your government ID.
                      </p>
                      
                      {nameValidation.warnings.length > 0 && (
                        <div className="mb-2">
                          <p className="font-medium text-red-800 mb-1">Issues found:</p>
                          <ul className="list-disc list-inside text-red-700 space-y-1">
                            {nameValidation.warnings.map((warning, index) => (
                              <li key={index} className="text-xs">{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {nameValidation.suggestions.length > 0 && (
                        <div className="mb-3">
                          <p className="font-medium text-red-800 mb-1">Suggestions:</p>
                          <ul className="list-disc list-inside text-red-700 space-y-1">
                            {nameValidation.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-xs">{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setNameValidation({ ...nameValidation, showDetails: !nameValidation.showDetails })}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          {nameValidation.showDetails ? 'Hide Details' : 'Show Details'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Go back to Step 1 to correct name
                            onBack();
                          }}
                          className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                        >
                          Edit Name in Step 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setNameValidation(null)}
                          className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                        >
                          Continue Anyway
                        </button>
                      </div>
                      
                      {nameValidation.showDetails && (
                        <div className="mt-3 p-2 bg-gray-50 rounded border text-xs">
                          <p><strong>Confidence:</strong> {nameValidation.confidence} ({nameValidation.score}%)</p>
                          <p><strong>Your Input:</strong> {step1Data.firstName} {step1Data.middleName} {step1Data.lastName}</p>
                          <p><strong>ID Extract:</strong> {watch('extractedName')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Name Match Confirmation */}
              {nameValidation && nameValidation.matches && nameValidation.confidence === 'high' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Name verification successful - matches Step 1 information ({nameValidation.score}% confidence)
                    </p>
                  </div>
                </div>
              )}

              {/* Name Match Warning for Medium Confidence */}
              {nameValidation && nameValidation.matches && nameValidation.confidence === 'medium' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">
                        Name Match - Please Verify
                      </p>
                      <p className="text-yellow-700 mb-2">
                        Names appear to match but please double-check for accuracy ({nameValidation.score}% confidence).
                      </p>
                      <button
                        type="button"
                        onClick={() => setNameValidation({ ...nameValidation, showDetails: !nameValidation.showDetails })}
                        className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
                      >
                        {nameValidation.showDetails ? 'Hide Details' : 'Show Details'}
                      </button>
                      {nameValidation.showDetails && (
                        <div className="mt-3 p-2 bg-yellow-100 rounded border text-xs">
                          <p><strong>Your Input:</strong> {step1Data.firstName} {step1Data.middleName} {step1Data.lastName}</p>
                          <p><strong>ID Extract:</strong> {watch('extractedName')}</p>
                        </div>
                      )}
                    </div>
                  </div>
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
                  
                  // Re-validate name when manually edited
                  if (e.target.value && step1Data) {
                    const nameValidationResult = validateNameMatch({
                      firstName: step1Data.firstName,
                      middleName: step1Data.middleName,
                      lastName: step1Data.lastName,
                      nickname: step1Data.nickname,
                    }, e.target.value);
                    
                    setNameValidation({
                      matches: nameValidationResult.matches,
                      confidence: nameValidationResult.confidence,
                      score: nameValidationResult.score,
                      suggestions: nameValidationResult.details.suggestions || [],
                      warnings: nameValidationResult.details.warnings || [],
                      showDetails: false,
                    });
                  }
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
                placeholder={getAddressPlaceholder(idType)}
                className={`${inputClass} ${isAddressNotApplicable(idType) ? 'bg-gray-50 text-gray-500' : ''}`}
                disabled={isAddressNotApplicable(idType)}
                onChange={(e) => {
                  register('extractedAddress').onChange(e);
                  onUpdate({ extractedAddress: e.target.value });
                }}
              />
              {isAddressNotApplicable(idType) ? (
                <p className="text-xs text-sunshare-gray mt-1">
                  {idType.toLowerCase().includes('passport') && 'Passports do not contain home addresses'}
                  {idType.toLowerCase().includes('driver') && "Driver's licenses typically show license address, not home address"}
                  {(idType.toLowerCase().includes('sss') || idType.toLowerCase().includes('prc') || idType.toLowerCase().includes('umid')) && 'This ID type does not display addresses'}
                  {!idType.toLowerCase().includes('passport') && !idType.toLowerCase().includes('driver') && !idType.toLowerCase().includes('sss') && !idType.toLowerCase().includes('prc') && !idType.toLowerCase().includes('umid') && 'This ID type typically does not show addresses'}
                </p>
              ) : (
                <p className="text-xs text-sunshare-gray mt-1">
                  Leave blank if no address is visible on your ID
                </p>
              )}
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
