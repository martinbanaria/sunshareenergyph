'use client';
import React, { useState } from 'react';
import InfoTooltip from '../InfoTooltip';
import { useOnboardingTheme } from '../useOnboardingTheme';

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
  const { cardStyle, inputStyle, labelStyle, headingColor, backButtonStyle, nextButtonStyle, pillStyle } = useOnboardingTheme();
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

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: headingColor }}>
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
          <label style={labelStyle}>
            Rooftop available for solar?
            <InfoTooltip text="If your building has unshaded rooftop space, we can install embedded solar panels at zero upfront cost under an Energy-as-a-Service model." />
          </label>
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
          <label style={labelStyle}>
            Operating hours per day
            <InfoTooltip text="This tells us your load profile shape. 24/7 operations benefit most from base-load supply, while shorter shifts may benefit more from solar." />
          </label>
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
          <button type="button" onClick={onBack} style={backButtonStyle}>
            Back
          </button>
          <button type="submit" disabled={!canProceed} style={nextButtonStyle(!!canProceed)}>
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3CIFacility;
