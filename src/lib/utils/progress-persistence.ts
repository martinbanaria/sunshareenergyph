/**
 * Robust Progress Persistence for Onboarding Process
 * 
 * This utility provides comprehensive progress saving across browser sessions,
 * handling form state, validation results, and recovery mechanisms.
 */

import { OnboardingFormData } from '@/types/onboarding';

// Progress persistence configuration
const PROGRESS_CONFIG = {
  storageKey: 'sunshare_onboarding_progress',
  metadataKey: 'sunshare_onboarding_metadata',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  compressionThreshold: 50 * 1024, // 50KB - compress larger data
  autoSaveInterval: 30 * 1000, // 30 seconds
};

export interface OnboardingProgress {
  formData: Partial<OnboardingFormData>;
  currentStep: number;
  completedSteps: number[];
  validationResults: Record<string, any>;
  metadata: {
    startTime: number;
    lastSaved: number;
    sessionId: string;
    version: string;
    userAgent: string;
    isComplete: boolean;
  };
}

export interface ProgressMetadata {
  id: string;
  startTime: number;
  lastAccess: number;
  stepProgress: Record<number, boolean>;
  estimatedCompletion: number;
  deviceFingerprint: string;
}

/**
 * Save progress to persistent storage
 */
export function saveOnboardingProgress(
  formData: Partial<OnboardingFormData>,
  currentStep: number,
  completedSteps: number[] = [],
  validationResults: Record<string, any> = {}
): void {
  try {
    const sessionId = getOrCreateSessionId();
    
    const progress: OnboardingProgress = {
      formData: sanitizeFormData(formData),
      currentStep,
      completedSteps: [...new Set(completedSteps)], // Remove duplicates
      validationResults,
      metadata: {
        startTime: getStartTime(),
        lastSaved: Date.now(),
        sessionId,
        version: getVersion(),
        userAgent: navigator.userAgent,
        isComplete: currentStep >= 5
      }
    };

    // Store progress data
    const progressData = JSON.stringify(progress);
    
    // Check if compression is needed
    if (progressData.length > PROGRESS_CONFIG.compressionThreshold) {
      // Simple compression by removing whitespace and shortening keys
      const compressedData = compressProgressData(progress);
      localStorage.setItem(PROGRESS_CONFIG.storageKey, JSON.stringify(compressedData));
    } else {
      localStorage.setItem(PROGRESS_CONFIG.storageKey, progressData);
    }

    // Update metadata separately
    updateProgressMetadata(currentStep, completedSteps);

    console.log('📝 Progress saved:', {
      step: currentStep,
      completed: completedSteps.length,
      dataSize: formatBytes(progressData.length),
      sessionId: sessionId.substring(0, 8)
    });

  } catch (error) {
    console.error('Failed to save progress:', error);
    // Try to save minimal essential data
    saveEssentialProgress(currentStep, completedSteps);
  }
}

/**
 * Load saved progress from storage
 */
export function loadOnboardingProgress(): OnboardingProgress | null {
  try {
    const savedData = localStorage.getItem(PROGRESS_CONFIG.storageKey);
    if (!savedData) {
      return null;
    }

    const progress = JSON.parse(savedData) as OnboardingProgress;
    
    // Validate progress data
    if (!validateProgressData(progress)) {
      console.warn('Invalid progress data found, clearing...');
      clearProgress();
      return null;
    }

    // Check if progress is expired
    if (isProgressExpired(progress)) {
      console.log('Progress data expired, clearing...');
      clearProgress();
      return null;
    }

    // Decompress if necessary
    const decompressedProgress = isCompressed(progress) 
      ? decompressProgressData(progress)
      : progress;

    console.log('📚 Progress loaded:', {
      step: decompressedProgress.currentStep,
      age: formatDuration(Date.now() - decompressedProgress.metadata.lastSaved),
      sessionId: decompressedProgress.metadata.sessionId.substring(0, 8)
    });

    return decompressedProgress;

  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
}

/**
 * Get progress statistics and insights
 */
export function getProgressStats(): {
  hasProgress: boolean;
  currentStep: number;
  completionRate: number;
  timeSpent: number;
  estimatedTimeRemaining: number;
  lastAccess: number;
  canResume: boolean;
} {
  const progress = loadOnboardingProgress();
  
  if (!progress) {
    return {
      hasProgress: false,
      currentStep: 0,
      completionRate: 0,
      timeSpent: 0,
      estimatedTimeRemaining: 0,
      lastAccess: 0,
      canResume: false
    };
  }

  const totalSteps = 5;
  const completionRate = (progress.completedSteps.length / totalSteps) * 100;
  const timeSpent = Date.now() - progress.metadata.startTime;
  const avgTimePerStep = timeSpent / Math.max(progress.completedSteps.length, 1);
  const remainingSteps = totalSteps - progress.completedSteps.length;
  const estimatedTimeRemaining = remainingSteps * avgTimePerStep;

  return {
    hasProgress: true,
    currentStep: progress.currentStep,
    completionRate: Math.round(completionRate),
    timeSpent,
    estimatedTimeRemaining,
    lastAccess: progress.metadata.lastSaved,
    canResume: !progress.metadata.isComplete && !isProgressExpired(progress)
  };
}

/**
 * Clear all saved progress
 */
export function clearProgress(): void {
  localStorage.removeItem(PROGRESS_CONFIG.storageKey);
  localStorage.removeItem(PROGRESS_CONFIG.metadataKey);
  localStorage.removeItem('sunshare_session_id');
  console.log('🗑️ Progress cleared');
}

/**
 * Auto-save progress with debouncing
 */
export function enableAutoSave(
  getCurrentFormData: () => Partial<OnboardingFormData>,
  getCurrentStep: () => number,
  getCompletedSteps: () => number[]
): () => void {
  let saveTimeout: NodeJS.Timeout;
  let lastSaveData: string = '';

  const autoSave = () => {
    try {
      const formData = getCurrentFormData();
      const currentStep = getCurrentStep();
      const completedSteps = getCompletedSteps();
      
      // Create a hash of current data to avoid unnecessary saves
      const currentDataHash = hashObject({ formData, currentStep, completedSteps });
      
      if (currentDataHash !== lastSaveData) {
        saveOnboardingProgress(formData, currentStep, completedSteps);
        lastSaveData = currentDataHash;
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const debouncedSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(autoSave, 2000); // 2 second debounce
  };

  // Listen to form changes
  const handleChange = () => debouncedSave();
  const handleBeforeUnload = () => autoSave(); // Save immediately when leaving

  // Set up event listeners
  document.addEventListener('input', handleChange);
  document.addEventListener('change', handleChange);
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Set up periodic save
  const intervalId = setInterval(autoSave, PROGRESS_CONFIG.autoSaveInterval);

  // Return cleanup function
  return () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    clearInterval(intervalId);
    document.removeEventListener('input', handleChange);
    document.removeEventListener('change', handleChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}

/**
 * Recover from unexpected session termination
 */
export function attemptProgressRecovery(): {
  canRecover: boolean;
  progress: OnboardingProgress | null;
  suggestions: string[];
} {
  const progress = loadOnboardingProgress();
  const suggestions: string[] = [];

  if (!progress) {
    return {
      canRecover: false,
      progress: null,
      suggestions: ['Start the onboarding process from the beginning']
    };
  }

  let canRecover = true;

  // Check if progress is too old
  const ageInDays = (Date.now() - progress.metadata.lastSaved) / (24 * 60 * 60 * 1000);
  if (ageInDays > 7) {
    canRecover = false;
    suggestions.push('Progress is more than 7 days old. Please start fresh for security.');
  }

  // Check if device/browser has changed significantly
  const currentFingerprint = getDeviceFingerprint();
  const savedFingerprint = getStoredDeviceFingerprint();
  
  if (savedFingerprint && currentFingerprint !== savedFingerprint) {
    suggestions.push('Different device or browser detected. Please verify it\'s still you.');
  }

  // Check data integrity
  if (!validateProgressData(progress)) {
    canRecover = false;
    suggestions.push('Progress data appears corrupted. Please start again.');
  }

  // Provide recovery suggestions based on current step
  if (canRecover) {
    if (progress.currentStep === 1) {
      suggestions.push('You were filling out your account information');
    } else if (progress.currentStep === 2) {
      suggestions.push('You were uploading your ID document');
    } else if (progress.currentStep === 3) {
      suggestions.push('You were entering property details');
    } else if (progress.currentStep === 4) {
      suggestions.push('You were setting energy preferences');
    } else if (progress.currentStep === 5) {
      suggestions.push('You were reviewing your application');
    }
  }

  return {
    canRecover,
    progress: canRecover ? progress : null,
    suggestions
  };
}

// Helper functions

function sanitizeFormData(formData: Partial<OnboardingFormData>): Partial<OnboardingFormData> {
  // Remove sensitive data like passwords from persistent storage
  const sanitized = { ...formData };
  
  if (sanitized.step1) {
    const step1 = sanitized.step1 as any; // Type assertion for deletion
    delete step1.password;
    delete step1.confirmPassword;
    delete step1.captchaToken;
  }
  
  return sanitized;
}

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem('sunshare_session_id');
  if (!sessionId) {
    sessionId = 'ss_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sunshare_session_id', sessionId);
  }
  return sessionId;
}

function getStartTime(): number {
  const existing = loadOnboardingProgress();
  return existing?.metadata.startTime || Date.now();
}

function getVersion(): string {
  return '2.0.0'; // Current onboarding version
}

function validateProgressData(progress: any): boolean {
  return (
    progress &&
    typeof progress === 'object' &&
    typeof progress.currentStep === 'number' &&
    Array.isArray(progress.completedSteps) &&
    progress.metadata &&
    typeof progress.metadata.lastSaved === 'number' &&
    typeof progress.metadata.sessionId === 'string'
  );
}

function isProgressExpired(progress: OnboardingProgress): boolean {
  const age = Date.now() - progress.metadata.lastSaved;
  return age > PROGRESS_CONFIG.maxAge;
}

function compressProgressData(progress: OnboardingProgress): any {
  // Simple compression by shortening property names and removing unnecessary data
  return {
    fd: progress.formData,
    cs: progress.currentStep,
    cps: progress.completedSteps,
    vr: progress.validationResults,
    m: {
      st: progress.metadata.startTime,
      ls: progress.metadata.lastSaved,
      si: progress.metadata.sessionId,
      v: progress.metadata.version,
      ic: progress.metadata.isComplete
    }
  };
}

function decompressProgressData(compressed: any): OnboardingProgress {
  return {
    formData: compressed.fd || {},
    currentStep: compressed.cs || 0,
    completedSteps: compressed.cps || [],
    validationResults: compressed.vr || {},
    metadata: {
      startTime: compressed.m.st || Date.now(),
      lastSaved: compressed.m.ls || Date.now(),
      sessionId: compressed.m.si || getOrCreateSessionId(),
      version: compressed.m.v || getVersion(),
      userAgent: navigator.userAgent,
      isComplete: compressed.m.ic || false
    }
  };
}

function isCompressed(progress: any): boolean {
  return 'fd' in progress && 'cs' in progress && 'm' in progress;
}

function updateProgressMetadata(currentStep: number, completedSteps: number[]): void {
  try {
    const existing = localStorage.getItem(PROGRESS_CONFIG.metadataKey);
    let metadata: ProgressMetadata;

    if (existing) {
      metadata = JSON.parse(existing);
    } else {
      metadata = {
        id: getOrCreateSessionId(),
        startTime: Date.now(),
        lastAccess: Date.now(),
        stepProgress: {},
        estimatedCompletion: 0,
        deviceFingerprint: getDeviceFingerprint()
      };
    }

    metadata.lastAccess = Date.now();
    metadata.stepProgress[currentStep] = true;
    completedSteps.forEach(step => {
      metadata.stepProgress[step] = true;
    });

    localStorage.setItem(PROGRESS_CONFIG.metadataKey, JSON.stringify(metadata));
  } catch (error) {
    console.error('Failed to update metadata:', error);
  }
}

function saveEssentialProgress(currentStep: number, completedSteps: number[]): void {
  try {
    const essential = {
      step: currentStep,
      completed: completedSteps,
      time: Date.now()
    };
    localStorage.setItem('sunshare_essential_progress', JSON.stringify(essential));
  } catch (error) {
    console.error('Failed to save essential progress:', error);
  }
}

function getDeviceFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 10, 10);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas.toDataURL()
  ].join('|');
  
  return hashString(fingerprint);
}

function getStoredDeviceFingerprint(): string | null {
  try {
    const metadata = localStorage.getItem(PROGRESS_CONFIG.metadataKey);
    return metadata ? JSON.parse(metadata).deviceFingerprint : null;
  } catch {
    return null;
  }
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

function hashObject(obj: any): string {
  return hashString(JSON.stringify(obj));
}

function formatBytes(bytes: number): string {
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${Math.floor(ms / 1000)}s`;
}