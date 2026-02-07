/**
 * Automatic Retry Logic for OCR Processing
 * 
 * This utility provides intelligent retry mechanisms for failed OCR attempts
 * with exponential backoff, different strategies, and user-friendly feedback.
 */

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffFactor: number;
  strategies: ('retry' | 'enhance' | 'fallback')[];
}

export interface RetryAttempt {
  attempt: number;
  strategy: string;
  timestamp: number;
  error?: string;
  duration?: number;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  attempts: RetryAttempt[];
  totalDuration: number;
  strategy: string;
}

// Default retry configuration
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 8000, // 8 seconds max
  backoffFactor: 2,
  strategies: ['retry', 'enhance', 'fallback']
};

/**
 * Enhanced retry mechanism for OCR processing
 */
export async function retryOCRWithStrategies<T>(
  ocrFunction: () => Promise<T>,
  imageData: string,
  options: Partial<RetryOptions> = {}
): Promise<RetryResult<T>> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  const attempts: RetryAttempt[] = [];
  const startTime = Date.now();

  let lastError: string = '';

  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    const attemptStart = Date.now();
    let strategy = 'retry';
    
    // Determine strategy for this attempt
    if (attempt > 1) {
      if (attempt === 2 && config.strategies.includes('enhance')) {
        strategy = 'enhance';
      } else if (attempt >= 3 && config.strategies.includes('fallback')) {
        strategy = 'fallback';
      }
    }

    try {
      // Apply strategy-specific preprocessing
      const processedData = await applyRetryStrategy(imageData, strategy, attempt);
      
      // Attempt OCR
      const result = await ocrFunction();
      
      // Success!
      attempts.push({
        attempt,
        strategy,
        timestamp: attemptStart,
        duration: Date.now() - attemptStart
      });

      return {
        success: true,
        data: result,
        attempts,
        totalDuration: Date.now() - startTime,
        strategy
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      lastError = errorMessage;
      
      attempts.push({
        attempt,
        strategy,
        timestamp: attemptStart,
        duration: Date.now() - attemptStart,
        error: errorMessage
      });

      console.log(`OCR attempt ${attempt} failed (${strategy}):`, errorMessage);

      // If this was the last attempt, break
      if (attempt > config.maxRetries) {
        break;
      }

      // Calculate delay for next attempt
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
        config.maxDelay
      );

      console.log(`Retrying in ${delay}ms with strategy: ${getNextStrategy(attempt + 1, config.strategies)}`);
      
      // Wait before next attempt
      await sleep(delay);
    }
  }

  // All attempts failed
  return {
    success: false,
    error: lastError || 'All retry attempts failed',
    attempts,
    totalDuration: Date.now() - startTime,
    strategy: 'failed'
  };
}

/**
 * Apply different strategies for retry attempts
 */
async function applyRetryStrategy(imageData: string, strategy: string, attempt: number): Promise<string> {
  switch (strategy) {
    case 'enhance':
      // Strategy 2: Enhance image quality
      return await enhanceImageForRetry(imageData);
      
    case 'fallback':
      // Strategy 3: Fallback preprocessing
      return await fallbackImageProcessing(imageData);
      
    case 'retry':
    default:
      // Strategy 1: Direct retry (no changes)
      return imageData;
  }
}

/**
 * Enhance image quality for retry attempt
 */
async function enhanceImageForRetry(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageData); // Fallback to original
        return;
      }

      // Increase canvas size for enhancement
      const scale = 1.2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Apply image enhancement
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw with slight scaling for enhancement
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Apply contrast enhancement
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageDataObj.data;
      
      // Simple contrast enhancement
      const contrast = 1.2;
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128)); // R
        data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128)); // G
        data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128)); // B
      }
      
      ctx.putImageData(imageDataObj, 0, 0);
      
      const enhancedData = canvas.toDataURL('image/jpeg', 0.9);
      resolve(enhancedData);
    };

    img.onerror = () => resolve(imageData);
    img.src = imageData;
  });
}

/**
 * Fallback image processing for final retry
 */
async function fallbackImageProcessing(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageData);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Convert to grayscale for better OCR in some cases
      ctx.drawImage(img, 0, 0);
      
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageDataObj.data;
      
      // Convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray; // R
        data[i + 1] = gray; // G
        data[i + 2] = gray; // B
      }
      
      ctx.putImageData(imageDataObj, 0, 0);
      
      const fallbackData = canvas.toDataURL('image/jpeg', 0.95);
      resolve(fallbackData);
    };

    img.onerror = () => resolve(imageData);
    img.src = imageData;
  });
}

/**
 * Get next retry strategy based on attempt number
 */
function getNextStrategy(attemptNumber: number, strategies: string[]): string {
  if (attemptNumber === 2 && strategies.includes('enhance')) {
    return 'enhance';
  } else if (attemptNumber >= 3 && strategies.includes('fallback')) {
    return 'fallback';
  } else {
    return 'retry';
  }
}

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Analyze retry results for insights
 */
export function analyzeRetryResults<T>(result: RetryResult<T>): {
  insights: string[];
  recommendations: string[];
  shouldReport: boolean;
} {
  const insights: string[] = [];
  const recommendations: string[] = [];
  let shouldReport = false;

  if (!result.success) {
    insights.push(`All ${result.attempts.length} attempts failed`);
    shouldReport = true;

    // Analyze failure patterns
    const errorTypes = result.attempts.map(a => a.error).filter(Boolean);
    const uniqueErrors = [...new Set(errorTypes)];
    
    if (uniqueErrors.length === 1) {
      insights.push('Consistent error across attempts');
      recommendations.push('This may be a systematic issue with the image or service');
    } else {
      insights.push('Different errors across attempts');
      recommendations.push('Intermittent connectivity or processing issues detected');
    }

    // Check duration patterns
    const avgDuration = result.attempts.reduce((sum, a) => sum + (a.duration || 0), 0) / result.attempts.length;
    if (avgDuration > 10000) { // 10 seconds
      insights.push('Long processing times detected');
      recommendations.push('Consider image compression or quality reduction');
    }

  } else {
    insights.push(`Success on attempt ${result.attempts.length} using ${result.strategy} strategy`);
    
    if (result.attempts.length > 1) {
      insights.push('Required retry attempts');
      recommendations.push('Consider image quality improvements for better first-attempt success');
    }

    // Success after retries might indicate issues worth investigating
    if (result.attempts.length > 2) {
      shouldReport = true;
      insights.push('Required multiple retry attempts - may indicate service instability');
    }
  }

  return {
    insights,
    recommendations,
    shouldReport
  };
}

/**
 * Format retry result for user display
 */
export function formatRetryMessage(result: RetryResult<any>): string {
  if (result.success) {
    if (result.attempts.length === 1) {
      return 'Processing completed successfully';
    } else {
      return `Processing completed after ${result.attempts.length} attempts (${(result.totalDuration / 1000).toFixed(1)}s)`;
    }
  } else {
    return `Processing failed after ${result.attempts.length} attempts. Please try a different image or check your connection.`;
  }
}

/**
 * Main wrapper for OCR functions with automatic retry
 */
export async function withAutoRetry<T>(
  ocrFunction: () => Promise<T>,
  imageData: string,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const result = await retryOCRWithStrategies(ocrFunction, imageData, options);
  
  if (result.success && result.data) {
    // Log success for monitoring
    console.log('OCR completed:', {
      attempts: result.attempts.length,
      duration: result.totalDuration,
      strategy: result.strategy
    });
    
    return result.data;
  } else {
    // Log failure for monitoring
    console.error('OCR failed after retries:', {
      attempts: result.attempts.length,
      duration: result.totalDuration,
      error: result.error
    });
    
    throw new Error(result.error || 'OCR processing failed after all retries');
  }
}