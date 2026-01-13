'use client';

import Image from 'next/image';

type OverlayType = 'gradient' | 'dark' | 'none';
type AspectRatio = '16/9' | '4/3' | '1/1' | '3/2' | 'auto';

interface OptimizedImageProps {
  src: string;
  alt: string;
  overlay?: OverlayType;
  aspectRatio?: AspectRatio;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

const overlayStyles: Record<OverlayType, string> = {
  gradient: 'after:absolute after:inset-0 after:bg-gradient-to-t after:from-sunshare-deep/80 after:via-sunshare-deep/40 after:to-transparent',
  dark: 'after:absolute after:inset-0 after:bg-sunshare-deep/50',
  none: '',
};

const aspectRatioStyles: Record<AspectRatio, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/2': 'aspect-[3/2]',
  'auto': '',
};

export function OptimizedImage({
  src,
  alt,
  overlay = 'none',
  aspectRatio = '4/3',
  className = '',
  priority = false,
  fill = false,
}: OptimizedImageProps) {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl
        ${aspectRatioStyles[aspectRatio]}
        ${overlayStyles[overlay]}
        ${className}
      `}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

export default OptimizedImage;
