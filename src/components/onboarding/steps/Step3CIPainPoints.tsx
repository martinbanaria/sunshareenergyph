'use client';
import React, { useState } from 'react';

const cardStyle: React.CSSProperties = {
  padding: '2rem',
  borderRadius: '15px',
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  color: '#F3F6E4',
};

const painPoints = [
  {
    id: 'high_cost',
    title: 'High electricity costs',
    desc: 'Our bill is too high relative to our output',
    solution: 'Retail Supply (PSA)',
  },
  {
    id: 'power_quality',
    title: 'Power quality issues',
    desc: 'Voltage fluctuations, equipment damage, or reactive power penalties',
    solution: 'PF Correction',
  },
  {
    id: 'no_visibility',
    title: 'No visibility into consumption',
    desc: "We don't know where our electricity is being wasted",
    solution: 'Smappee Monitoring',
  },
  {
    id: 'want_solar',
    title: 'Want to generate own power',
    desc: 'We have rooftop space and want solar',
    solution: 'Embedded Solar',
  },
  {
    id: 'unreliable_metering',
    title: 'Unreliable metering / billing',
    desc: 'We suspect metering errors or want interval data',
    solution: 'SparkMeter AMI',
  },
  {
    id: 'esg_goals',
    title: 'ESG / sustainability goals',
    desc: 'We need verified clean energy for compliance or reporting',
    solution: 'RECs + Solar',
  },
];

const Step3CIPainPoints = ({ onNext, onBack }: { onNext: (selected: string[]) => void; onBack: () => void }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const canProceed = selected.length > 0;

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#D1EB0C' }}>
        What challenges do you face?
      </h2>
      <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
        Select all that apply. This helps us tailor your savings estimate.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); if (canProceed) onNext(selected); }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {painPoints.map((point) => {
            const isSelected = selected.includes(point.id);
            return (
              <div
                key={point.id}
                onClick={() => toggle(point.id)}
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: isSelected ? '1px solid #D1EB0C' : '1px solid rgba(255,255,255,0.2)',
                  background: isSelected ? 'rgba(209, 235, 12, 0.1)' : 'rgba(0, 36, 46, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  minWidth: '22px',
                  borderRadius: '4px',
                  border: isSelected ? '2px solid #D1EB0C' : '2px solid rgba(255,255,255,0.3)',
                  background: isSelected ? '#D1EB0C' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  transition: 'all 0.2s',
                }}>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#00242E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.25rem',
                  }}>
                    <span style={{ fontWeight: 600, color: isSelected ? '#D1EB0C' : 'white' }}>
                      {point.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                    {point.desc}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: isSelected ? '#D1EB0C' : 'rgba(209, 235, 12, 0.5)',
                    fontWeight: 500,
                  }}>
                    &rarr; {point.solution}
                  </div>
                </div>
              </div>
            );
          })}
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
              cursor: 'pointer',
            }}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!canProceed}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: canProceed ? '#D1EB0C' : 'rgba(209, 235, 12, 0.3)',
              border: 'none',
              color: '#00242E',
              fontWeight: 600,
              cursor: canProceed ? 'pointer' : 'not-allowed',
              opacity: canProceed ? 1 : 0.6,
            }}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3CIPainPoints;
