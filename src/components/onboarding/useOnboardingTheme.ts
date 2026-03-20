'use client';
import { useTheme } from '@/contexts/ThemeContext';
import type React from 'react';

export function useOnboardingTheme() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const cardStyle: React.CSSProperties = isLight
    ? {
        padding: '2rem',
        borderRadius: '15px',
        background: 'rgba(255, 255, 255, 0.92)',
        border: '1px solid rgba(0, 36, 46, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
        color: '#00242E',
      }
    : {
        padding: '2rem',
        borderRadius: '15px',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#F3F6E4',
      };

  const inputStyle: React.CSSProperties = isLight
    ? {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        background: '#F3F6E4',
        border: '1px solid rgba(0, 36, 46, 0.2)',
        color: '#00242E',
        fontSize: '1rem',
      }
    : {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        background: 'rgba(0, 36, 46, 0.6)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: 'white',
        fontSize: '1rem',
      };

  const labelStyle: React.CSSProperties = isLight
    ? {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
        color: '#004F64',
        fontWeight: 500,
      }
    : {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
      };

  const pillStyle = (active: boolean): React.CSSProperties => isLight
    ? {
        padding: '0.6rem 1rem',
        borderRadius: '2rem',
        border: active ? '1px solid #004F64' : '1px solid rgba(0, 36, 46, 0.2)',
        background: active ? 'rgba(0, 79, 100, 0.1)' : 'rgba(0, 36, 46, 0.04)',
        color: active ? '#004F64' : '#00242E',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: active ? 600 : 400,
        transition: 'all 0.2s',
      }
    : {
        padding: '0.6rem 1rem',
        borderRadius: '2rem',
        border: active ? '1px solid #D1EB0C' : '1px solid rgba(255,255,255,0.2)',
        background: active ? 'rgba(209, 235, 12, 0.15)' : 'rgba(0, 36, 46, 0.4)',
        color: active ? '#D1EB0C' : 'white',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: active ? 600 : 400,
        transition: 'all 0.2s',
      };

  const headingColor = isLight ? '#004F64' : '#D1EB0C';
  const textColor = isLight ? '#00242E' : '#F3F6E4';
  const mutedColor = isLight ? '#657376' : 'rgba(255,255,255,0.8)';
  const accentColor = isLight ? '#004F64' : '#D1EB0C';
  const tealAccent = '#20B2AA';

  const backButtonStyle: React.CSSProperties = isLight
    ? {
        flex: 1,
        padding: '0.75rem',
        borderRadius: '0.5rem',
        background: 'transparent',
        border: '1px solid rgba(0, 36, 46, 0.3)',
        color: '#00242E',
        cursor: 'pointer',
      }
    : {
        flex: 1,
        padding: '0.75rem',
        borderRadius: '0.5rem',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.3)',
        color: 'white',
        cursor: 'pointer',
      };

  const nextButtonStyle = (enabled: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '0.75rem',
    borderRadius: '0.5rem',
    background: enabled ? '#D1EB0C' : 'rgba(209, 235, 12, 0.3)',
    border: 'none',
    color: '#00242E',
    fontWeight: 600,
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.6,
  });

  const pageBackground = isLight ? '#F3F6E4' : '#00242E';

  return {
    theme,
    isLight,
    cardStyle,
    inputStyle,
    labelStyle,
    pillStyle,
    headingColor,
    textColor,
    mutedColor,
    accentColor,
    tealAccent,
    backButtonStyle,
    nextButtonStyle,
    pageBackground,
  };
}
