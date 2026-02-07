/**
 * Image Quality Validation for OCR Processing
 * 
 * This utility validates image quality before OCR processing to ensure
 * optimal extraction results for Philippine government IDs.
 */

export interface QualityCheck {
  name: string;
  passed: boolean;
  score: number; // 0-100
  message: string;
  suggestion?: string;
}

export interface ImageQualityResult {
  overall: 'excellent' | 'good' | 'acceptable' | 'poor' | 'unacceptable';
  score: number; // 0-100 overall score
  checks: QualityCheck[];
  canProceed: boolean;
  warnings: string[];
  suggestions: string[];
}

// Quality thresholds
const QUALITY_THRESHOLDS = {
  excellent: 90,
  good: 75,
  acceptable: 60,
  poor: 40,
  unacceptable: 0
};

// Minimum requirements for OCR processing
const MIN_REQUIREMENTS = {
  width: 800,
  height: 600,
  fileSize: 50 * 1024, // 50KB minimum
  maxFileSize: 10 * 1024 * 1024, // 10MB maximum
  aspectRatio: { min: 0.5, max: 2.0 } // ID cards are typically rectangular
};

/**
 * Analyze image file for quality before OCR processing
 */
export async function validateImageQuality(file: File): Promise<ImageQualityResult> {
  const checks: QualityCheck[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // 1. File size validation
  const fileSizeCheck = validateFileSize(file);
  checks.push(fileSizeCheck);
  if (!fileSizeCheck.passed && fileSizeCheck.suggestion) {
    suggestions.push(fileSizeCheck.suggestion);
  }
  
  // 2. File type validation
  const fileTypeCheck = validateFileType(file);
  checks.push(fileTypeCheck);
  if (!fileTypeCheck.passed && fileTypeCheck.suggestion) {
    suggestions.push(fileTypeCheck.suggestion);
  }
  
  // 3. Load image for dimension analysis
  const imageAnalysis = await analyzeImageDimensions(file);
  checks.push(...imageAnalysis.checks);
  warnings.push(...imageAnalysis.warnings);
  suggestions.push(...imageAnalysis.suggestions);
  
  // 4. Calculate overall score
  const scores = checks.map(check => check.score);
  const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  
  // 5. Determine overall quality level
  let overall: ImageQualityResult['overall'] = 'unacceptable';
  if (overallScore >= QUALITY_THRESHOLDS.excellent) overall = 'excellent';
  else if (overallScore >= QUALITY_THRESHOLDS.good) overall = 'good';
  else if (overallScore >= QUALITY_THRESHOLDS.acceptable) overall = 'acceptable';
  else if (overallScore >= QUALITY_THRESHOLDS.poor) overall = 'poor';
  
  // 6. Determine if processing can proceed
  const criticalChecks = checks.filter(check => 
    check.name === 'File Size' || 
    check.name === 'File Type' || 
    check.name === 'Image Dimensions'
  );
  const canProceed = criticalChecks.every(check => check.passed) && overallScore >= QUALITY_THRESHOLDS.acceptable;
  
  return {
    overall,
    score: overallScore,
    checks,
    canProceed,
    warnings,
    suggestions
  };
}

/**
 * Validate file size
 */
function validateFileSize(file: File): QualityCheck {
  const { fileSize, maxFileSize } = MIN_REQUIREMENTS;
  
  if (file.size < fileSize) {
    return {
      name: 'File Size',
      passed: false,
      score: 20,
      message: `File too small (${formatBytes(file.size)}). May result in poor OCR quality.`,
      suggestion: 'Use a higher resolution camera or scan at higher quality'
    };
  }
  
  if (file.size > maxFileSize) {
    return {
      name: 'File Size',
      passed: false,
      score: 0,
      message: `File too large (${formatBytes(file.size)}). Maximum allowed is ${formatBytes(maxFileSize)}.`,
      suggestion: 'Compress the image or reduce its quality'
    };
  }
  
  // Optimal size range: 500KB - 3MB
  const optimalMin = 500 * 1024;
  const optimalMax = 3 * 1024 * 1024;
  
  let score = 100;
  let message = `Good file size (${formatBytes(file.size)})`;
  
  if (file.size < optimalMin) {
    score = Math.max(60, Math.round((file.size / optimalMin) * 80) + 20);
    message = `Small file size (${formatBytes(file.size)}). OCR may work but quality could be better.`;
  } else if (file.size > optimalMax) {
    score = Math.max(70, 100 - Math.round(((file.size - optimalMax) / (maxFileSize - optimalMax)) * 30));
    message = `Large file size (${formatBytes(file.size)}). Will work but may be slow to process.`;
  }
  
  return {
    name: 'File Size',
    passed: true,
    score,
    message
  };
}

/**
 * Validate file type
 */
function validateFileType(file: File): QualityCheck {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const preferredTypes = ['image/jpeg', 'image/jpg'];
  
  if (!file.type.startsWith('image/')) {
    return {
      name: 'File Type',
      passed: false,
      score: 0,
      message: `Invalid file type: ${file.type}`,
      suggestion: 'Please upload an image file (JPG, PNG, or WebP)'
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      name: 'File Type',
      passed: false,
      score: 30,
      message: `Unsupported image type: ${file.type}`,
      suggestion: 'Please use JPG, PNG, or WebP format'
    };
  }
  
  const score = preferredTypes.includes(file.type) ? 100 : 85;
  const message = preferredTypes.includes(file.type) 
    ? `Perfect file type: ${file.type}`
    : `Good file type: ${file.type}`;
  
  return {
    name: 'File Type',
    passed: true,
    score,
    message
  };
}

/**
 * Analyze image dimensions and visual properties
 */
async function analyzeImageDimensions(file: File): Promise<{
  checks: QualityCheck[];
  warnings: string[];
  suggestions: string[];
}> {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      const checks: QualityCheck[] = [];
      const warnings: string[] = [];
      const suggestions: string[] = [];
      
      // Check dimensions
      const dimensionCheck = validateDimensions(img.width, img.height);
      checks.push(dimensionCheck);
      if (dimensionCheck.suggestion) {
        suggestions.push(dimensionCheck.suggestion);
      }
      
      // Check aspect ratio
      const aspectRatioCheck = validateAspectRatio(img.width, img.height);
      checks.push(aspectRatioCheck);
      if (aspectRatioCheck.suggestion) {
        suggestions.push(aspectRatioCheck.suggestion);
      }
      
      // Analyze image clarity (simplified)
      if (ctx) {
        const clarityCheck = analyzeBrightnessAndContrast(img, canvas, ctx);
        checks.push(clarityCheck);
        if (clarityCheck.suggestion) {
          suggestions.push(clarityCheck.suggestion);
        }
      }
      
      resolve({ checks, warnings, suggestions });
    };
    
    img.onerror = () => {
      resolve({
        checks: [{
          name: 'Image Load',
          passed: false,
          score: 0,
          message: 'Could not load image for analysis',
          suggestion: 'Try a different image file'
        }],
        warnings: ['Failed to load image for quality analysis'],
        suggestions: ['Ensure the image file is not corrupted']
      });
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate image dimensions
 */
function validateDimensions(width: number, height: number): QualityCheck {
  const { width: minWidth, height: minHeight } = MIN_REQUIREMENTS;
  
  if (width < minWidth || height < minHeight) {
    return {
      name: 'Image Dimensions',
      passed: false,
      score: Math.max(20, Math.min(width / minWidth, height / minHeight) * 60),
      message: `Image too small: ${width}x${height}px (minimum: ${minWidth}x${minHeight}px)`,
      suggestion: 'Use a higher resolution camera or scan the ID at higher quality'
    };
  }
  
  // Optimal dimensions: 1200x800 or higher
  const optimalWidth = 1200;
  const optimalHeight = 800;
  
  const widthScore = Math.min(100, (width / optimalWidth) * 100);
  const heightScore = Math.min(100, (height / optimalHeight) * 100);
  const score = Math.round((widthScore + heightScore) / 2);
  
  let message = `Good dimensions: ${width}x${height}px`;
  if (score < 80) {
    message = `Adequate dimensions: ${width}x${height}px. Higher resolution would improve OCR accuracy.`;
  } else if (score >= 95) {
    message = `Excellent dimensions: ${width}x${height}px`;
  }
  
  return {
    name: 'Image Dimensions',
    passed: true,
    score: Math.max(60, score),
    message
  };
}

/**
 * Validate aspect ratio (ID cards should be roughly rectangular)
 */
function validateAspectRatio(width: number, height: number): QualityCheck {
  const aspectRatio = width / height;
  const { min, max } = MIN_REQUIREMENTS.aspectRatio;
  
  if (aspectRatio < min || aspectRatio > max) {
    return {
      name: 'Aspect Ratio',
      passed: false,
      score: 40,
      message: `Unusual aspect ratio: ${aspectRatio.toFixed(2)}. May not be a standard ID card.`,
      suggestion: 'Ensure the entire ID is visible and properly framed'
    };
  }
  
  // Ideal aspect ratios for Philippine IDs
  const idealRatios = [1.6, 1.5, 0.63]; // Landscape and portrait orientations
  const ratioScore = idealRatios.map(ideal => 
    100 - Math.abs((aspectRatio - ideal) / ideal) * 100
  );
  const score = Math.max(...ratioScore);
  
  return {
    name: 'Aspect Ratio',
    passed: true,
    score: Math.max(70, Math.round(score)),
    message: `Good aspect ratio: ${aspectRatio.toFixed(2)}`
  };
}

/**
 * Analyze brightness and contrast (simplified analysis)
 */
function analyzeBrightnessAndContrast(img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): QualityCheck {
  try {
    // Sample a small area for analysis
    const sampleSize = Math.min(200, img.width / 4, img.height / 4);
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    
    // Draw sample area from center
    const sourceX = (img.width - sampleSize) / 2;
    const sourceY = (img.height - sampleSize) / 2;
    
    ctx.drawImage(img, sourceX, sourceY, sampleSize, sampleSize, 0, 0, sampleSize, sampleSize);
    
    const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
    const pixels = imageData.data;
    
    let totalBrightness = 0;
    let brightnessValues: number[] = [];
    
    // Calculate brightness for each pixel
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Calculate relative luminance
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
      brightnessValues.push(brightness);
      totalBrightness += brightness;
    }
    
    const avgBrightness = totalBrightness / brightnessValues.length;
    
    // Calculate contrast (standard deviation of brightness)
    const variance = brightnessValues.reduce((sum, brightness) => 
      sum + Math.pow(brightness - avgBrightness, 2), 0) / brightnessValues.length;
    const contrast = Math.sqrt(variance);
    
    // Score based on brightness and contrast
    let score = 100;
    let message = 'Good image clarity';
    let suggestion: string | undefined;
    
    // Check for over/under exposure
    if (avgBrightness > 230) {
      score = Math.max(40, score - 30);
      message = 'Image appears overexposed (too bright)';
      suggestion = 'Reduce lighting or camera exposure';
    } else if (avgBrightness < 50) {
      score = Math.max(40, score - 30);
      message = 'Image appears underexposed (too dark)';
      suggestion = 'Increase lighting or camera exposure';
    }
    
    // Check for low contrast
    if (contrast < 30) {
      score = Math.max(50, score - 20);
      message = message === 'Good image clarity' ? 'Low contrast detected' : message + ' with low contrast';
      suggestion = suggestion || 'Ensure good lighting and avoid reflections';
    }
    
    return {
      name: 'Image Clarity',
      passed: score >= 50,
      score: Math.round(score),
      message,
      suggestion
    };
    
  } catch (error) {
    return {
      name: 'Image Clarity',
      passed: true,
      score: 80,
      message: 'Could not analyze image clarity (processing will continue)'
    };
  }
}

/**
 * Format bytes for display
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get quality color for UI display
 */
export function getQualityColor(quality: ImageQualityResult['overall']): string {
  switch (quality) {
    case 'excellent': return 'text-green-600';
    case 'good': return 'text-green-500';
    case 'acceptable': return 'text-yellow-600';
    case 'poor': return 'text-orange-600';
    case 'unacceptable': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

/**
 * Get quality icon for UI display
 */
export function getQualityIcon(quality: ImageQualityResult['overall']): string {
  switch (quality) {
    case 'excellent': return '🟢';
    case 'good': return '🔵';
    case 'acceptable': return '🟡';
    case 'poor': return '🟠';
    case 'unacceptable': return '🔴';
    default: return '⚪';
  }
}