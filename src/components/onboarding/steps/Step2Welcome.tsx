'use client';
import React from 'react';
import { HouseIcon, BuildingIcon, FactoryIcon } from '../CIIcons';
import { useOnboardingTheme } from '../useOnboardingTheme';

const Step2Welcome = ({ onNext }: { onNext: (intention: 'home' | 'business' | 'ci') => void }) => {
  const { cardStyle, headingColor, isLight } = useOnboardingTheme();

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: headingColor }}>
        Let's get you started.
      </h2>
      <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Choose the option that fits you best.</p>

      <p style={{ marginBottom: '1rem', fontWeight: 600 }}>What brings you here?</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => onNext('home')}
          style={{
            padding: '1.5rem 1rem',
            borderRadius: '0.75rem',
            background: 'rgba(0, 36, 46, 0.4)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}><HouseIcon size={32} color={isLight ? '#004F64' : '#D1EB0C'} /></div>
          <div style={{ fontWeight: 600 }}>For My Home</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>Residential</div>
        </button>

        <button
          onClick={() => onNext('business')}
          style={{
            padding: '1.5rem 1rem',
            borderRadius: '0.75rem',
            background: 'rgba(0, 36, 46, 0.4)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}><BuildingIcon size={32} color={isLight ? '#004F64' : '#004F64'} /></div>
          <div style={{ fontWeight: 600 }}>For My Business</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>SME</div>
        </button>
      </div>

      <button
        onClick={() => onNext('ci')}
        style={{
          width: '100%',
          padding: '1.5rem 1rem',
          borderRadius: '0.75rem',
          background: 'rgba(0, 36, 46, 0.4)',
          border: '1px solid rgba(209, 235, 12, 0.3)',
          color: 'white',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}><FactoryIcon size={32} color="#D1EB0C" /></div>
        <div style={{ fontWeight: 600 }}>For My Facility</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>Commercial & Industrial</div>
        <div style={{
          fontSize: '0.7rem',
          color: '#D1EB0C',
          marginTop: '0.5rem',
          opacity: 0.8,
        }}>
          500 kW+ peak demand? Get a free energy audit
        </div>
      </button>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.8rem', opacity: 0.5, cursor: 'pointer', textDecoration: 'underline' }}>
          Not sure which? Take the 30-second quiz
        </span>
      </div>
    </div>
  );
};

export default Step2Welcome;
