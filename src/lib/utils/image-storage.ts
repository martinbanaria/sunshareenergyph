/**
 * Optimized Image Storage Utility
 * 
 * This utility provides efficient image storage and retrieval for the onboarding process.
 * It addresses the issue of storing large base64 images in localStorage by implementing:
 * 
 * 1. Image compression and optimization
 * 2. Efficient storage mechanisms
 * 3. Memory management
 * 4. Quality preservation for OCR accuracy
 */

// Configuration constants
const IMAGE_STORAGE_CONFIG = {
  // Maximum file size (5MB)
  maxFileSize: 5 * 1024 * 1024,
  // Compression quality (0.8 = 80% quality, good balance for OCR)
  compressionQuality: 0.8,
  // Maximum dimensions for processing
  maxWidth: 2400,
  maxHeight: 3200,
  // Storage key prefixes
  storagePrefix: 'sunshare_onboard_img_',
  metadataPrefix: 'sunshare_onboard_meta_'
};

export interface ImageMetadata {
  id: string;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  mimeType: string;
  timestamp: number;
  compressionRatio: number;
}

export interface StoredImage {
  id: string;
  dataUrl: string;
  metadata: ImageMetadata;
}

/**
 * Compresses an image file while maintaining quality suitable for OCR
 */
export async function compressImage(file: File): Promise<{ dataUrl: string; metadata: ImageMetadata }> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate optimal dimensions
      let { width, height } = calculateOptimalDimensions(img.width, img.height);
      
      canvas.width = width;
      canvas.height = height;
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw the image with optimal dimensions
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to compressed data URL
      const compressedDataUrl = canvas.toDataURL(file.type || 'image/jpeg', IMAGE_STORAGE_CONFIG.compressionQuality);
      
      // Calculate metadata
      const originalSize = file.size;
      const compressedSize = Math.round(compressedDataUrl.length * 0.75); // Approximate size
      const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);
      
      const metadata: ImageMetadata = {
        id: generateImageId(),
        fileName: file.name,
        originalSize,
        compressedSize,
        width,
        height,
        mimeType: file.type || 'image/jpeg',
        timestamp: Date.now(),
        compressionRatio
      };
      
      resolve({ dataUrl: compressedDataUrl, metadata });
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate optimal dimensions for image processing
 * Maintains aspect ratio while staying within limits
 */
function calculateOptimalDimensions(originalWidth: number, originalHeight: number): { width: number; height: number } {
  const { maxWidth, maxHeight } = IMAGE_STORAGE_CONFIG;
  
  // If image is already within limits, keep original dimensions
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return { width: originalWidth, height: originalHeight };
  }
  
  // Calculate scale factor
  const widthScale = maxWidth / originalWidth;
  const heightScale = maxHeight / originalHeight;
  const scale = Math.min(widthScale, heightScale);
  
  return {
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale)
  };
}

/**
 * Generate unique image ID
 */
function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Store image in optimized storage
 */
export async function storeImage(file: File): Promise<StoredImage> {
  try {
    // Validate file size
    if (file.size > IMAGE_STORAGE_CONFIG.maxFileSize) {
      throw new Error(`File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds maximum allowed (${IMAGE_STORAGE_CONFIG.maxFileSize / 1024 / 1024}MB)`);
    }
    
    // Compress the image
    const { dataUrl, metadata } = await compressImage(file);
    
    // Store in localStorage (for now, can be upgraded to IndexedDB later)
    const imageKey = IMAGE_STORAGE_CONFIG.storagePrefix + metadata.id;
    const metaKey = IMAGE_STORAGE_CONFIG.metadataPrefix + metadata.id;
    
    try {
      localStorage.setItem(imageKey, dataUrl);
      localStorage.setItem(metaKey, JSON.stringify(metadata));
    } catch (error) {
      // Handle storage quota exceeded
      if (error instanceof DOMException && error.code === DOMException.QUOTA_EXCEEDED_ERR) {
        // Clear old images and try again
        clearOldImages();
        localStorage.setItem(imageKey, dataUrl);
        localStorage.setItem(metaKey, JSON.stringify(metadata));
      } else {
        throw error;
      }
    }
    
    return {
      id: metadata.id,
      dataUrl,
      metadata
    };
  } catch (error) {
    console.error('Error storing image:', error);
    throw new Error(`Failed to store image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Retrieve stored image
 */
export function getStoredImage(imageId: string): StoredImage | null {
  try {
    const imageKey = IMAGE_STORAGE_CONFIG.storagePrefix + imageId;
    const metaKey = IMAGE_STORAGE_CONFIG.metadataPrefix + imageId;
    
    const dataUrl = localStorage.getItem(imageKey);
    const metadataStr = localStorage.getItem(metaKey);
    
    if (!dataUrl || !metadataStr) {
      return null;
    }
    
    const metadata: ImageMetadata = JSON.parse(metadataStr);
    
    return {
      id: imageId,
      dataUrl,
      metadata
    };
  } catch (error) {
    console.error('Error retrieving stored image:', error);
    return null;
  }
}

/**
 * Remove stored image
 */
export function removeStoredImage(imageId: string): void {
  const imageKey = IMAGE_STORAGE_CONFIG.storagePrefix + imageId;
  const metaKey = IMAGE_STORAGE_CONFIG.metadataPrefix + imageId;
  
  localStorage.removeItem(imageKey);
  localStorage.removeItem(metaKey);
}

/**
 * Clear old images to free up storage space
 * Removes images older than 7 days
 */
export function clearOldImages(): number {
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  let clearedCount = 0;
  
  // Get all stored image IDs
  const imageIds = getAllStoredImageIds();
  
  imageIds.forEach(imageId => {
    const metaKey = IMAGE_STORAGE_CONFIG.metadataPrefix + imageId;
    const metadataStr = localStorage.getItem(metaKey);
    
    if (metadataStr) {
      try {
        const metadata: ImageMetadata = JSON.parse(metadataStr);
        if (metadata.timestamp < sevenDaysAgo) {
          removeStoredImage(imageId);
          clearedCount++;
        }
      } catch (error) {
        // Remove corrupted metadata
        removeStoredImage(imageId);
        clearedCount++;
      }
    }
  });
  
  return clearedCount;
}

/**
 * Get all stored image IDs
 */
function getAllStoredImageIds(): string[] {
  const imageIds: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(IMAGE_STORAGE_CONFIG.metadataPrefix)) {
      const imageId = key.replace(IMAGE_STORAGE_CONFIG.metadataPrefix, '');
      imageIds.push(imageId);
    }
  }
  
  return imageIds;
}

/**
 * Get storage usage statistics
 */
export function getStorageStats(): {
  totalImages: number;
  totalSize: number;
  averageSize: number;
  averageCompression: number;
} {
  const imageIds = getAllStoredImageIds();
  let totalSize = 0;
  let totalOriginalSize = 0;
  
  imageIds.forEach(imageId => {
    const metaKey = IMAGE_STORAGE_CONFIG.metadataPrefix + imageId;
    const metadataStr = localStorage.getItem(metaKey);
    
    if (metadataStr) {
      try {
        const metadata: ImageMetadata = JSON.parse(metadataStr);
        totalSize += metadata.compressedSize;
        totalOriginalSize += metadata.originalSize;
      } catch (error) {
        // Ignore corrupted metadata
      }
    }
  });
  
  const averageCompression = totalOriginalSize > 0 
    ? Math.round((1 - totalSize / totalOriginalSize) * 100)
    : 0;
  
  return {
    totalImages: imageIds.length,
    totalSize,
    averageSize: imageIds.length > 0 ? Math.round(totalSize / imageIds.length) : 0,
    averageCompression
  };
}

/**
 * Utility to convert File to optimized data URL for OCR
 * This is the main function to use in components
 */
export async function processImageForOCR(file: File): Promise<{
  dataUrl: string;
  imageId: string;
  metadata: ImageMetadata;
}> {
  const storedImage = await storeImage(file);
  
  return {
    dataUrl: storedImage.dataUrl,
    imageId: storedImage.id,
    metadata: storedImage.metadata
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}