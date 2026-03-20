'use client';
import React, { useState } from 'react';
import { useOnboardingTheme } from '../useOnboardingTheme';

const painPointLabels: Record<string, { title: string; solution: string }> = {
  'high_cost': { title: 'High electricity costs', solution: 'Retail Supply (PSA)' },
  'power_quality': { title: 'Power quality issues', solution: 'PF Correction' },
  'no_visibility': { title: 'No consumption visibility', solution: 'Smappee Monitoring' },
  'want_solar': { title: 'Want to generate own power', solution: 'Embedded Solar' },
  'unreliable_metering': { title: 'Unreliable metering', solution: 'SparkMeter AMI' },
  'esg_goals': { title: 'ESG / sustainability goals', solution: 'RECs + Solar' },
};

const industryLabels: Record<string, string> = {
  'manufacturing': 'Manufacturing & Industrial',
  'hotels': 'Hotels & Hospitality',
  'retail_malls': 'Retail & Malls',
  'healthcare': 'Healthcare',
  'education': 'Education',
  'cold_chain': 'Cold Chain & Logistics',
  'office_bpo': 'Office / BPO',
  'other': 'Other',
};

const spendLabels: Record<string, string> = {
  'below_200k': 'Below ₱200K',
  '200k_500k': '₱200K – ₱500K',
  '500k_1m': '₱500K – ₱1M',
  '1m_5m': '₱1M – ₱5M',
  'above_5m': 'Above ₱5M',
};

const providerLabels: Record<string, string> = {
  'meralco': 'Meralco',
  'visayan_electric': 'Visayan Electric',
  'davao_light': 'Davao Light',
  'cepalco': 'CEPALCO',
  'other': 'Other',
};

type CIData = {
  companyName: string;
  industrySegment: string;
  monthlySpend: string;
  currentProvider: string;
  facilityName: string;
  facilityAddress: string;
  facilityCity: string;
  facilityOwnership: string;
  floorArea: string;
  rooftopAvailable: string;
  operatingHours: string;
  painPoints: string[];
  savingsLow: number;
  savingsHigh: number;
};

type Props = {
  data: CIData;
  onSubmit: (auditData: AuditRequestData) => void;
  onBack: () => void;
};

type AuditRequestData = {
  contactPerson: string;
  contactRole: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

const Step5CIReview = ({ data, onSubmit, onBack }: Props) => {
  const { cardStyle, inputStyle, labelStyle, headingColor, accentColor, backButtonStyle, isLight } = useOnboardingTheme();
  const [audit, setAudit] = useState<AuditRequestData>({
    contactPerson: '',
    contactRole: '',
    phone: '',
    preferredDate: '',
    preferredTime: 'flexible',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const updateAudit = (field: keyof AuditRequestData, value: string) => {
    setAudit(prev => ({ ...prev, [field]: value }));
  };

  const canSubmit = audit.contactPerson && audit.phone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit(audit);
  };

  const formatPeso = (amount: number): string => {
    if (amount >= 1000000) return `₱${(amount / 1000000).toFixed(1)}M`;
    return `₱${Math.round(amount).toLocaleString()}`;
  };

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: accentColor,
    marginBottom: '0.5rem',
    paddingBottom: '0.25rem',
    borderBottom: `1px solid ${isLight ? 'rgba(0, 79, 100, 0.15)' : 'rgba(209, 235, 12, 0.2)'}`,
  };

  const dividerColor = isLight ? 'rgba(0, 36, 46, 0.1)' : 'rgba(255,255,255,0.1)';
  const mutedOpacity = isLight ? 0.6 : 0.7;

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: headingColor }}>
        Review & Schedule Your Audit
      </h2>

      {/* Company Summary */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={sectionHeaderStyle}>Company</div>
        <div style={{ fontWeight: 600 }}>{data.companyName}</div>
        <div style={{ fontSize: '0.85rem', opacity: mutedOpacity }}>
          {industryLabels[data.industrySegment] || data.industrySegment}
          {' · '}
          {providerLabels[data.currentProvider] || data.currentProvider}
          {' · '}
          {spendLabels[data.monthlySpend] || data.monthlySpend}
        </div>
      </div>

      {/* Facility Summary */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={sectionHeaderStyle}>Facility</div>
        <div style={{ fontWeight: 600 }}>{data.facilityName}</div>
        <div style={{ fontSize: '0.85rem', opacity: mutedOpacity }}>
          {data.facilityAddress}, {data.facilityCity}
        </div>
        <div style={{ fontSize: '0.85rem', opacity: mutedOpacity }}>
          {data.facilityOwnership.charAt(0).toUpperCase() + data.facilityOwnership.slice(1)}
          {data.floorArea ? ` · ${data.floorArea} sqm` : ''}
          {' · '}
          {data.operatingHours === '24_7' ? '24/7 operations' : `${data.operatingHours} operations`}
          {' · Rooftop: '}
          {data.rooftopAvailable === 'yes' ? 'Available' : data.rooftopAvailable === 'no' ? 'Not available' : 'TBD'}
        </div>
      </div>

      {/* Challenges & Solutions */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={sectionHeaderStyle}>Challenges & Solutions</div>
        {data.painPoints.map(id => {
          const point = painPointLabels[id];
          if (!point) return null;
          return (
            <div key={id} style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <span style={{ color: accentColor }}>&#10003;</span>{' '}
              {point.title}{' '}
              <span style={{ opacity: 0.5 }}>&rarr; {point.solution}</span>
            </div>
          );
        })}
      </div>

      {/* Savings Estimate */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={sectionHeaderStyle}>Estimated Savings</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: accentColor }}>
          {formatPeso(data.savingsLow)} &ndash; {formatPeso(data.savingsHigh)} / month
        </div>
        <div style={{ fontSize: '0.9rem', opacity: mutedOpacity }}>
          {formatPeso(data.savingsLow * 12)} &ndash; {formatPeso(data.savingsHigh * 12)} / year
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: dividerColor, margin: '1.5rem 0' }} />

      {/* Audit Scheduling Form */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Schedule Your Free Energy Audit
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Contact Person</label>
          <input type="text" style={inputStyle} placeholder="Full name" value={audit.contactPerson} onChange={(e) => updateAudit('contactPerson', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Role / Title (optional)</label>
            <input type="text" style={inputStyle} placeholder="e.g. CEO, Plant Mgr" value={audit.contactRole} onChange={(e) => updateAudit('contactRole', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input type="tel" style={inputStyle} placeholder="+63 9XX XXX XXXX" value={audit.phone} onChange={(e) => updateAudit('phone', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Preferred Date (optional)</label>
            <input type="date" style={inputStyle} value={audit.preferredDate} onChange={(e) => updateAudit('preferredDate', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Preferred Time</label>
            <select style={inputStyle} value={audit.preferredTime} onChange={(e) => updateAudit('preferredTime', e.target.value)}>
              <option value="flexible">Flexible</option>
              <option value="morning">Morning (8AM–12PM)</option>
              <option value="afternoon">Afternoon (1PM–5PM)</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Additional Notes (optional)</label>
          <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Any specific concerns or scheduling constraints..." value={audit.notes} onChange={(e) => updateAudit('notes', e.target.value)} />
        </div>

        {/* What Happens Next */}
        <div style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          background: isLight ? 'rgba(0, 79, 100, 0.06)' : 'rgba(0, 36, 46, 0.3)',
          border: `1px solid ${isLight ? 'rgba(0, 79, 100, 0.1)' : 'transparent'}`,
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>What happens next:</div>
          <div style={{ opacity: 0.8 }}>1. An energy advisor contacts you within 24 hours</div>
          <div style={{ opacity: 0.8 }}>2. We schedule a free on-site energy audit</div>
          <div style={{ opacity: 0.8 }}>3. You receive a detailed savings proposal</div>
        </div>

        {/* Actions */}
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: '0.5rem',
            background: canSubmit && !submitting ? '#D1EB0C' : 'rgba(209, 235, 12, 0.3)',
            border: 'none',
            color: '#00242E',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed',
            opacity: canSubmit && !submitting ? 1 : 0.6,
            marginBottom: '0.75rem',
          }}
        >
          {submitting ? 'Submitting...' : 'Schedule Free Energy Audit'}
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={onBack} style={{ ...backButtonStyle, flex: 'none', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
            Back
          </button>
          <button
            type="button"
            style={{
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              color: isLight ? 'rgba(0, 36, 46, 0.5)' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textDecoration: 'underline',
            }}
          >
            Save & Continue Later
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step5CIReview;
