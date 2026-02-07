'use client';
import React from 'react';

const Step1Auth = ({ onNext }: { onNext: () => void }) => {
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
        textAlign: 'center'
      }}
    >
      <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem', color: '#D1EB0C' }}>
        Welcome to SunShare
      </h2>
      <p style={{ marginBottom: '2rem', opacity: 0.8 }}>Powering your future with cleaner energy.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => onNext()}
          style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            background: 'white',
            border: 'none',
            color: '#333',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontWeight: 'bold' }}>G</span> Continue with Google
        </button>
        <button 
          onClick={() => onNext()}
          style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            background: '#1877F2',
            border: 'none',
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontWeight: 'bold' }}>f</span> Continue with Facebook
        </button>
        <button 
          onClick={() => onNext()}
          style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            background: 'black',
            border: 'none',
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontWeight: 'bold' }}></span> Continue with Apple
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', opacity: 0.5 }}>
        <div style={{ flex: 1, height: '1px', background: 'white' }} />
        <div style={{ fontSize: '0.8rem' }}>OR</div>
        <div style={{ flex: 1, height: '1px', background: 'white' }} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.2)',
            color: 'white'
          }}
        />
        <button 
          onClick={() => onNext()}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Step1Auth;
