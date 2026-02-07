'use client';
import React, { useState } from 'react';

const Step2ID = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [idType, setIdType] = useState('philid');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

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
        color: '#F3F6E4', // sunshare-cream
      }}
    >
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        marginBottom: '1.5rem',
        color: '#D1EB0C' // sunshare-lime
      }}>
        Verify Your Identity
      </h2>
      
      <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
        To ensure a secure community, we need one valid government ID.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Select ID Type
          </label>
          <select 
            value={idType} 
            onChange={(e) => setIdType(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: 'rgba(0, 36, 46, 0.6)', // sunshare-deep
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1rem'
            }}
          >
            <option value="philid">PhilID (National ID)</option>
            <option value="license">Driver's License</option>
            <option value="passport">Passport</option>
            <option value="umid">SSS / UMID</option>
          </select>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Upload or Capture ID
          </label>
          <div style={{ 
            border: '2px dashed rgba(255,255,255,0.2)', 
            borderRadius: '0.75rem',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.2s'
          }}>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              onChange={handleFileChange}
              style={{ display: 'none' }} 
              id="id-upload"
            />
            <label htmlFor="id-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
              {file ? (
                <div style={{ color: '#D1EB0C' }}>
                  ✓ {file.name}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📷</div>
                  <span style={{ textDecoration: 'underline' }}>Tap to take photo</span> or upload
                </>
              )}
            </label>
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
              background: '#D1EB0C', // sunshare-lime
              border: 'none',
              color: '#00242E', // sunshare-deep text
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

export default Step2ID;
