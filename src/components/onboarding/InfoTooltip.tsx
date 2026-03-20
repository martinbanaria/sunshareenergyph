'use client';
import React, { useState, useRef, useEffect } from 'react';

type InfoTooltipProps = {
  text: string;
};

const InfoTooltip = ({ text }: InfoTooltipProps) => {
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
      style={{ position: 'relative', display: 'inline-block', marginLeft: '0.4rem', verticalAlign: 'middle' }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="More info"
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.65rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          padding: 0,
          verticalAlign: 'middle',
          transition: 'all 0.15s',
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
