'use client';
import React from 'react';
import Link from 'next/link';

const Step5Review = ({ onBack }: { onBack: () => void }) => {
  return (
    <div
      style={{
        padding: '2rem',
        borderRadius: '15px',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#F3F6E4',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#D1EB0C' }}>
        Review & Submit
      </h2>
      <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Please verify your information.</p>

      <div style={{ marginBottom: '2rem', fontSize: '0.9rem', opacity: 0.9 }}>
        <div style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          <strong>Account:</strong> Juan dela Cruz (juan@example.com)
        </div>
        <div style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          <strong>ID:</strong> PhilID (Verified)
        </div>
        <div style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          <strong>Property:</strong> Residential, 123 Solar Street, Pasig
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Interested in:</strong> Rooftop Solar, Energy Monitoring
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
        <input type="checkbox" id="terms" style={{ marginTop: '0.25rem' }} />
        <label htmlFor="terms" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
          I agree to the <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span> and <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          type="button" 
          onClick={onBack}
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '0.5rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        <Link href="/onboarding/success" style={{ flex: 1 }}>
          <button 
            type="button"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: '#D1EB0C',
              border: 'none',
              color: '#00242E',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Step5Review;
