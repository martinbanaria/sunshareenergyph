'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useOnboardingTheme } from './useOnboardingTheme';

type InfoTooltipProps = {
  text: string;
};

const InfoTooltip = ({ text }: InfoTooltipProps) => {
  const { isLight } = useOnboardingTheme();
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <span
      ref={tooltipRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '0.35rem' }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="More info"
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          border: isLight ? '1.5px solid #004F64' : '1.5px solid rgba(255,255,255,0.4)',
          background: isLight ? 'rgba(0, 79, 100, 0.1)' : 'rgba(255,255,255,0.08)',
          color: isLight ? '#004F64' : 'rgba(255,255,255,0.7)',
          fontSize: '0.6rem',
          fontWeight: 700,
          fontStyle: 'italic',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          padding: 0,
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
      >
        i
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '220px',
          padding: '0.6rem 0.75rem',
          borderRadius: '0.5rem',
          background: '#004F64',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#F3F6E4',
          fontSize: '0.78rem',
          lineHeight: 1.45,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          zIndex: 50,
          pointerEvents: 'none',
        }}>
          {text}
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '8px',
            height: '8px',
            background: '#004F64',
            border: '1px solid rgba(255,255,255,0.15)',
            borderTop: 'none',
            borderLeft: 'none',
          }} />
        </div>
      )}
    </span>
  );
};

export default InfoTooltip;
