'use client';
import React, { useState } from 'react';

const Step4Preferences = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (val: string) => {
    setSelected(prev => 
      prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
    );
  };

  const options = [
    { id: 'solar', title: 'Rooftop Solar', desc: 'Generate your own clean energy.' },
    { id: 'bess', title: 'Battery Storage', desc: 'Backup power during outages.' },
    { id: 'monitoring', title: 'Energy Monitoring', desc: 'Track usage and savings.' },
  ];

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
        Service Preferences
      </h2>
      <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>What are you interested in?</p>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => toggle(opt.id)}
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                border: selected.includes(opt.id) ? '1px solid #D1EB0C' : '1px solid rgba(255,255,255,0.2)',
                background: selected.includes(opt.id) ? 'rgba(209, 235, 12, 0.1)' : 'rgba(0, 36, 46, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: selected.includes(opt.id) ? '6px solid #D1EB0C' : '2px solid rgba(255,255,255,0.3)',
                background: 'transparent'
              }} />
              <div>
                <div style={{ fontWeight: 600, color: selected.includes(opt.id) ? '#D1EB0C' : 'white' }}>{opt.title}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{opt.desc}</div>
              </div>
            </div>
          ))}
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

export default Step4Preferences;
