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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.5rem',
  background: 'rgba(0, 36, 46, 0.6)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'white',
  fontSize: '1rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.9rem',
};

type QualificationData = {
  companyName: string;
  industrySegment: string;
  monthlySpend: string;
  peakDemand: string;
  currentProvider: string;
};

type EligibilityStatus = 'eligible' | 'eligible_2026' | 'unknown_demand' | 'below_threshold' | null;

const Step3CIQualification = ({ onNext, onBack }: { onNext: (data: QualificationData) => void; onBack: () => void }) => {
  const [form, setForm] = useState<QualificationData>({
    companyName: '',
    industrySegment: '',
    monthlySpend: '',
    peakDemand: '',
    currentProvider: '',
  });

  const update = (field: keyof QualificationData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const getEligibility = (): EligibilityStatus => {
    if (!form.peakDemand) return null;
    if (form.peakDemand === 'dont_know') return 'unknown_demand';
    if (form.peakDemand === 'below_100') return 'below_threshold';
    if (form.peakDemand === '100_500') return 'eligible_2026';
    return 'eligible';
  };

  const eligibility = getEligibility();
  const canProceed = form.companyName.length >= 2
    && form.industrySegment
    && form.monthlySpend
    && form.peakDemand
    && form.currentProvider
    && eligibility !== 'below_threshold';

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#D1EB0C' }}>
        Tell us about your organization
      </h2>
      <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
        We'll check your eligibility and estimate your savings.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); if (canProceed) onNext(form); }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Company / Organization Name</label>
          <input
            type="text"
            style={inputStyle}
            placeholder="e.g. ABC Manufacturing Corp."
            value={form.companyName}
            onChange={(e) => update('companyName', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Industry Segment</label>
          <select
            style={inputStyle}
            value={form.industrySegment}
            onChange={(e) => update('industrySegment', e.target.value)}
          >
            <option value="">Select your industry</option>
            <option value="manufacturing">Manufacturing & Industrial</option>
            <option value="hotels">Hotels & Hospitality</option>
            <option value="retail_malls">Retail & Malls</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="cold_chain">Cold Chain & Logistics</option>
            <option value="office_bpo">Office / BPO</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Approximate Monthly Electricity Spend</label>
          <select
            style={inputStyle}
            value={form.monthlySpend}
            onChange={(e) => update('monthlySpend', e.target.value)}
          >
            <option value="">Select range</option>
            <option value="below_200k">Below ₱200,000</option>
            <option value="200k_500k">₱200,000 – ₱500,000</option>
            <option value="500k_1m">₱500,000 – ₱1,000,000</option>
            <option value="1m_5m">₱1,000,000 – ₱5,000,000</option>
            <option value="above_5m">Above ₱5,000,000</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Approximate Peak Demand (kW)</label>
          <select
            style={inputStyle}
            value={form.peakDemand}
            onChange={(e) => update('peakDemand', e.target.value)}
          >
            <option value="">Select range</option>
            <option value="below_100">Below 100 kW</option>
            <option value="100_500">100 – 500 kW</option>
            <option value="500_1mw">500 kW – 1 MW</option>
            <option value="1mw_5mw">1 MW – 5 MW</option>
            <option value="above_5mw">Above 5 MW</option>
            <option value="dont_know">I don't know</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Current Electricity Provider</label>
          <select
            style={inputStyle}
            value={form.currentProvider}
            onChange={(e) => update('currentProvider', e.target.value)}
          >
            <option value="">Select provider</option>
            <option value="meralco">Meralco</option>
            <option value="visayan_electric">Visayan Electric</option>
            <option value="davao_light">Davao Light</option>
            <option value="cepalco">CEPALCO</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Eligibility Banners */}
        {eligibility === 'eligible' && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: 'rgba(209, 235, 12, 0.1)',
            border: '1px solid rgba(209, 235, 12, 0.3)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}>
            <span style={{ color: '#D1EB0C', fontWeight: 600 }}>&#10003; You're eligible</span>
            <span style={{ opacity: 0.8 }}> for RCOA retail electricity supply.</span>
          </div>
        )}

        {eligibility === 'eligible_2026' && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: 'rgba(32, 178, 170, 0.1)',
            border: '1px solid rgba(32, 178, 170, 0.3)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}>
            <span style={{ color: '#20B2AA', fontWeight: 600 }}>&#8505; </span>
            <span style={{ opacity: 0.8 }}>
              You'll be fully eligible from June 2026 when the threshold drops to 100 kW.
              We can still do a free energy audit today.
            </span>
          </div>
        )}

        {eligibility === 'unknown_demand' && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: 'rgba(32, 178, 170, 0.1)',
            border: '1px solid rgba(32, 178, 170, 0.3)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}>
            <span style={{ color: '#20B2AA', fontWeight: 600 }}>&#8505; </span>
            <span style={{ opacity: 0.8 }}>
              No worries — our free energy audit will determine your exact demand. Let's continue.
            </span>
          </div>
        )}

        {eligibility === 'below_threshold' && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: 'rgba(255, 200, 50, 0.1)',
            border: '1px solid rgba(255, 200, 50, 0.3)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}>
            <span style={{ color: '#FFC832', fontWeight: 600 }}>&#9888; </span>
            <span style={{ opacity: 0.8 }}>
              For businesses under 100 kW, check out our{' '}
              <span style={{ color: '#D1EB0C', cursor: 'pointer', textDecoration: 'underline' }}>
                SME solutions
              </span>.
            </span>
          </div>
        )}

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

export default Step3CIQualification;
