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

type FacilityData = {
  facilityName: string;
  address: string;
  city: string;
  facilityOwnership: string;
  floorArea: string;
  rooftopAvailable: string;
  operatingHours: string;
  hasMultipleFacilities: boolean;
};

const Step3CIFacility = ({ onNext, onBack }: { onNext: (data: FacilityData) => void; onBack: () => void }) => {
  const [form, setForm] = useState<FacilityData>({
    facilityName: '',
    address: '',
    city: '',
    facilityOwnership: '',
    floorArea: '',
    rooftopAvailable: '',
    operatingHours: '',
    hasMultipleFacilities: false,
  });

  const update = (field: keyof FacilityData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = form.facilityName && form.address && form.city
    && form.facilityOwnership && form.rooftopAvailable && form.operatingHours;

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.6rem 1rem',
    borderRadius: '2rem',
    border: active ? '1px solid #D1EB0C' : '1px solid rgba(255,255,255,0.2)',
    background: active ? 'rgba(209, 235, 12, 0.15)' : 'rgba(0, 36, 46, 0.4)',
    color: active ? '#D1EB0C' : 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.2s',
  });

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#D1EB0C' }}>
        Your Facility
      </h2>
      <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
        Help us scope your energy audit.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); if (canProceed) onNext(form); }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Facility Name / Location</label>
          <input
            type="text"
            style={inputStyle}
            placeholder="e.g. Main Plant — Laguna"
            value={form.facilityName}
            onChange={(e) => update('facilityName', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Facility Address</label>
          <input
            type="text"
            style={inputStyle}
            placeholder="Full address"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>City / Municipality</label>
          <input
            type="text"
            style={inputStyle}
            placeholder="e.g. Pasig City"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Facility Type</label>
            <select
              style={inputStyle}
              value={form.facilityOwnership}
              onChange={(e) => update('facilityOwnership', e.target.value)}
            >
              <option value="">Select</option>
              <option value="owned">Owned</option>
              <option value="leased">Leased</option>
              <option value="managed">Managed</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Floor Area (optional)</label>
            <input
              type="number"
              style={inputStyle}
              placeholder="sqm"
              value={form.floorArea}
              onChange={(e) => update('floorArea', e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Rooftop available for solar?</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {(['yes', 'no', 'not_sure'] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => update('rooftopAvailable', val)}
                style={pillStyle(form.rooftopAvailable === val)}
              >
                {val === 'not_sure' ? 'Not sure' : val.charAt(0).toUpperCase() + val.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Operating hours per day</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { value: '8h', label: '8 hrs' },
              { value: '12h', label: '12 hrs' },
              { value: '16h', label: '16 hrs' },
              { value: '24_7', label: '24/7' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('operatingHours', opt.value)}
                style={pillStyle(form.operatingHours === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Do you have multiple facilities?</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => update('hasMultipleFacilities', true)}
              style={pillStyle(form.hasMultipleFacilities === true)}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => update('hasMultipleFacilities', false)}
              style={pillStyle(form.hasMultipleFacilities === false)}
            >
              No
            </button>
          </div>
          {form.hasMultipleFacilities && (
            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
              Start with your primary facility. You can add more from your dashboard.
            </p>
          )}
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

export default Step3CIFacility;
