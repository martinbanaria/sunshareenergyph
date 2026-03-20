'use client';
import React from 'react';

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export const HouseIcon = ({ size = 32, color = '#D1EB0C' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M4 14L16 4L28 14V27C28 27.55 27.55 28 27 28H5C4.45 28 4 27.55 4 27V14Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 28V18H20V28" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BuildingIcon = ({ size = 32, color = '#004F64' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="5" y="4" width="22" height="24" rx="2" stroke={color} strokeWidth="2"/>
    <rect x="10" y="9" width="4" height="4" rx="0.5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <rect x="18" y="9" width="4" height="4" rx="0.5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <rect x="10" y="17" width="4" height="4" rx="0.5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <rect x="18" y="17" width="4" height="4" rx="0.5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <rect x="13" y="24" width="6" height="4" rx="0.5" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const FactoryIcon = ({ size = 32, color = '#D1EB0C' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M4 28V16L10 12V16L16 12V16L22 12V16H28V28H4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="7" y="6" width="4" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
    <path d="M9 4V6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="8" y="20" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.3"/>
    <rect x="14" y="20" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.3"/>
    <rect x="20" y="20" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.3"/>
  </svg>
);

export const BoltIcon = ({ size = 20, color = '#D1EB0C' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M11 2L4 11H10L9 18L16 9H10L11 2Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WrenchIcon = ({ size = 20, color = '#20B2AA' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M12.5 3.5C11.12 2.82 9.45 3.05 8.28 4.22C7.11 5.39 6.88 7.06 7.56 8.44L3.5 12.5C3.22 12.78 3.22 13.24 3.5 13.52L4.48 14.5C4.76 14.78 5.22 14.78 5.5 14.5L9.56 10.44C10.94 11.12 12.61 10.89 13.78 9.72C14.95 8.55 15.18 6.88 14.5 5.5L12.28 7.72L10.28 5.72L12.5 3.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChartIcon = ({ size = 20, color = '#D1EB0C' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="3" y="10" width="3" height="7" rx="0.5" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <rect x="8.5" y="6" width="3" height="11" rx="0.5" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <rect x="14" y="3" width="3" height="14" rx="0.5" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const SunIcon = ({ size = 20, color = '#20B2AA' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="3.5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"/>
    <path d="M10 3V5M10 15V17M17 10H15M5 10H3M14.95 5.05L13.54 6.46M6.46 13.54L5.05 14.95M14.95 14.95L13.54 13.54M6.46 6.46L5.05 5.05" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const PlusIcon = ({ size = 20, color = '#F3F6E4' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.5" strokeOpacity="0.5"/>
    <path d="M10 7V13M7 10H13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ChatIcon = ({ size = 20, color = '#F3F6E4' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M3 4C3 3.45 3.45 3 4 3H16C16.55 3 17 3.45 17 4V13C17 13.55 16.55 14 16 14H7L3 17V4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 8H13M7 11H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
  </svg>
);

export const BookIcon = ({ size = 20, color = '#F3F6E4' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M3 4C3 3.45 3.45 3 4 3H8C9.1 3 10 3.9 10 5V17C10 16.17 9.33 15.5 8.5 15.5H4C3.45 15.5 3 15.05 3 14.5V4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 4C17 3.45 16.55 3 16 3H12C10.9 3 10 3.9 10 5V17C10 16.17 10.67 15.5 11.5 15.5H16C16.55 15.5 17 15.05 17 14.5V4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
