'use client';
import React, { useState } from 'react';

const Step3Property = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [propertyType, setPropertyType] = useState('residential');
  
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
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: '#D1EB0C' }}>
        Property Details
      </h2>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Property Type</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['residential', 'commercial'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPropertyType(type)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  background: propertyType === type ? 'rgba(209, 235, 12, 0.1)' : 'rgba(0, 36, 46, 0.6)',
                  border: propertyType === type ? '1px solid #D1EB0C' : '1px solid rgba(255,255,255,0.2)',
                  color: propertyType === type ? '#D1EB0C' : 'white',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Street Address</label>
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
            placeholder="123 Solar Street"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>City</label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(0, 36, 46, 0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white'
              }}
              placeholder="Pasig"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ZIP Code</label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(0, 36, 46, 0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white'
              }}
              placeholder="1605"
            />
          </div>
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
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3Property;
