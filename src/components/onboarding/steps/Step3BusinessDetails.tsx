'use client';
import React from 'react';

const Step3BusinessDetails = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
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
        Business Profile
      </h2>
      <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Tell us about your organization.</p>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Company Name</label>
          <input
            type="text"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: 'rgba(0, 36, 46, 0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1rem'
            }}
            placeholder="SunShare Corp."
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Business Type</label>
          <select
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: 'rgba(0, 36, 46, 0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1rem'
            }}
          >
            <option>Sole Proprietorship</option>
            <option>Corporation</option>
            <option>Partnership</option>
            <option>Cooperative</option>
          </select>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Estimated Monthly Bill</label>
          <select
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: 'rgba(0, 36, 46, 0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1rem'
            }}
          >
            <option>₱50,000 - ₱100,000</option>
            <option>₱100,000 - ₱500,000</option>
            <option>₱500,000+</option>
          </select>
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
          <button 
            type="submit"
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: '#D1EB0C',
              border: 'none',
              color: '#00242E',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3BusinessDetails;
