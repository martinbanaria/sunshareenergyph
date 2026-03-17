'use client';
import React from 'react';

const Step2Welcome = ({ onNext }: { onNext: (intention: 'home' | 'business' | 'ci') => void }) => {
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
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#127968;</div>
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
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#127970;</div>
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
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#127981;</div>
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
