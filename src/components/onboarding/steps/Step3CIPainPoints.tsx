'use client';
import React, { useState } from 'react';
import InfoTooltip from '../InfoTooltip';
import { useOnboardingTheme } from '../useOnboardingTheme';

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
  const { cardStyle, headingColor, accentColor, backButtonStyle, nextButtonStyle, isLight } = useOnboardingTheme();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const canProceed = selected.length > 0;

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: headingColor }}>
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
                  border: isSelected
                    ? `1px solid ${accentColor}`
                    : `1px solid ${isLight ? 'rgba(0,36,46,0.15)' : 'rgba(255,255,255,0.2)'}`,
                  background: isSelected
                    ? (isLight ? 'rgba(0, 79, 100, 0.08)' : 'rgba(209, 235, 12, 0.1)')
                    : (isLight ? 'rgba(255,255,255,0.6)' : 'rgba(0, 36, 46, 0.4)'),
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
                  border: isSelected ? `2px solid ${accentColor}` : `2px solid ${isLight ? 'rgba(0,36,46,0.25)' : 'rgba(255,255,255,0.3)'}`,
                  background: isSelected ? accentColor : 'transparent',
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
                    <span style={{ fontWeight: 600, color: isSelected ? accentColor : (isLight ? '#00242E' : 'white') }}>
                      {point.title}
                      {(point.id === 'power_quality' || point.id === 'unreliable_metering') && (
                        <InfoTooltip text={
                          point.id === 'power_quality'
                            ? 'Low power factor causes reactive power penalties on your bill. PF correction equipment typically pays for itself within months.'
                            : 'Interval metering gives you 15-minute consumption data, replacing estimated bills with revenue-grade accuracy.'
                        } />
                      )}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                    {point.desc}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: isSelected ? accentColor : (isLight ? 'rgba(0, 79, 100, 0.5)' : 'rgba(209, 235, 12, 0.5)'),
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
          <button type="button" onClick={onBack} style={backButtonStyle}>
            Back
          </button>
          <button type="submit" disabled={!canProceed} style={nextButtonStyle(canProceed)}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3CIPainPoints;
