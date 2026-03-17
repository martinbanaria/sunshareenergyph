'use client';
import React, { useState, useEffect } from 'react';

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

// Monthly spend midpoints for calculation
const spendMidpoints: Record<string, number> = {
  'below_200k': 150000,
  '200k_500k': 350000,
  '500k_1m': 750000,
  '1m_5m': 3000000,
  'above_5m': 7500000,
};

// Savings breakdown by pain point
const savingsComponents: Record<string, { label: string; percent: number; desc: string }> = {
  'high_cost': { label: 'Retail Supply (PSA)', percent: 0.14, desc: 'Switch to competitive supply' },
  'power_quality': { label: 'PF Correction', percent: 0.05, desc: 'Eliminate reactive power penalties' },
  'no_visibility': { label: 'Energy Monitoring', percent: 0.03, desc: 'Identify and eliminate waste' },
  'want_solar': { label: 'Embedded Solar', percent: 0.08, desc: 'Generate your own clean power' },
  'unreliable_metering': { label: 'Smart Metering', percent: 0.02, desc: 'Revenue-grade accuracy' },
  'esg_goals': { label: 'RECs & Carbon Tracking', percent: 0.01, desc: 'Verified clean energy credits' },
};

type Props = {
  monthlySpend: string;
  painPoints: string[];
  onNext: () => void;
  onBack: () => void;
};

const formatPeso = (amount: number): string => {
  if (amount >= 1000000) {
    return `₱${(amount / 1000000).toFixed(1)}M`;
  }
  return `₱${Math.round(amount).toLocaleString()}`;
};

const AnimatedNumber = ({ target, duration = 1500 }: { target: number; duration?: number }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCurrent(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <>{formatPeso(current)}</>;
};

const Step4CISavingsEstimate = ({ monthlySpend, painPoints, onNext, onBack }: Props) => {
  const baseMonthlyCost = spendMidpoints[monthlySpend] || 500000;

  // Always include base RCOA savings
  const activePainPoints = painPoints.includes('high_cost')
    ? painPoints
    : ['high_cost', ...painPoints];

  const breakdown = activePainPoints
    .filter(id => savingsComponents[id])
    .map(id => {
      const comp = savingsComponents[id];
      const savingsLow = Math.round(baseMonthlyCost * comp.percent * 0.8);
      const savingsHigh = Math.round(baseMonthlyCost * comp.percent * 1.2);
      return { ...comp, id, savingsLow, savingsHigh };
    });

  const totalLow = breakdown.reduce((sum, b) => sum + b.savingsLow, 0);
  const totalHigh = breakdown.reduce((sum, b) => sum + b.savingsHigh, 0);
  const annualHigh = totalHigh * 12;

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: '#D1EB0C' }}>
        Your Estimated Savings
      </h2>

      {/* Primary Savings Display */}
      <div style={{
        padding: '1.5rem',
        borderRadius: '0.75rem',
        background: 'rgba(209, 235, 12, 0.08)',
        border: '1px solid rgba(209, 235, 12, 0.2)',
        textAlign: 'center',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#D1EB0C', marginBottom: '0.25rem' }}>
          <AnimatedNumber target={totalLow} /> &ndash; <AnimatedNumber target={totalHigh} />
        </div>
        <div style={{ fontSize: '1rem', opacity: 0.7 }}>per month</div>
        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '1.1rem',
          fontWeight: 600,
        }}>
          Up to {formatPeso(annualHigh)} per year
        </div>
      </div>

      {/* Breakdown Cards */}
      <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>How you'll save:</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {breakdown.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '1rem',
              borderRadius: '0.75rem',
              background: 'rgba(0, 36, 46, 0.4)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#D1EB0C' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              {formatPeso(item.savingsLow)} &ndash; {formatPeso(item.savingsHigh)}/mo
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Trust Signal */}
      <div style={{
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        background: 'rgba(0, 36, 46, 0.3)',
        border: '1px solid rgba(255,255,255,0.05)',
        fontSize: '0.8rem',
        opacity: 0.7,
        lineHeight: 1.5,
        marginBottom: '1.5rem',
      }}>
        Based on PEMC 2024 data: contestable customers save an average of 14% vs. distribution utility rates.
        This is an estimate. Your free energy audit will provide exact numbers based on your facility's actual
        consumption data.
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
          type="button"
          onClick={onNext}
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '0.5rem',
            background: '#D1EB0C',
            border: 'none',
            color: '#00242E',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step4CISavingsEstimate;
