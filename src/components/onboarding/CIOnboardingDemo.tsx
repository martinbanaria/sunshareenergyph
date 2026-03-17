'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Step3CIQualification from './steps/Step3CIQualification';
import Step3CIFacility from './steps/Step3CIFacility';
import Step3CIPainPoints from './steps/Step3CIPainPoints';
import Step4CISavingsEstimate from './steps/Step4CISavingsEstimate';
import Step5CIReview from './steps/Step5CIReview';

// ─── Types ───────────────────────────────────────────────────────────────────

type QualificationData = {
  companyName: string;
  industrySegment: string;
  monthlySpend: string;
  peakDemand: string;
  currentProvider: string;
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

type AuditRequestData = {
  contactPerson: string;
  contactRole: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

// ─── Step Labels & Config ────────────────────────────────────────────────────

const ciStepLabels = [
  'Welcome',
  'Qualification',
  'Facility',
  'Pain Points',
  'Savings Estimate',
  'Review & Schedule',
];

const spendMidpoints: Record<string, number> = {
  'below_200k': 150000,
  '200k_500k': 350000,
  '500k_1m': 750000,
  '1m_5m': 3000000,
  'above_5m': 7500000,
};

const savingsPercents: Record<string, number> = {
  'high_cost': 0.14,
  'power_quality': 0.05,
  'no_visibility': 0.03,
  'want_solar': 0.08,
  'unreliable_metering': 0.02,
  'esg_goals': 0.01,
};

// ─── Pre-fill Data for Demo ──────────────────────────────────────────────────

const prefillQualification: QualificationData = {
  companyName: 'Pacific Star Manufacturing Corp.',
  industrySegment: 'manufacturing',
  monthlySpend: '500k_1m',
  peakDemand: '500_1mw',
  currentProvider: 'meralco',
};

const prefillFacility: FacilityData = {
  facilityName: 'Main Plant — Laguna Technopark',
  address: 'Lot 5 Block 12, Laguna Technopark SEZ',
  city: 'Binan, Laguna',
  facilityOwnership: 'owned',
  floorArea: '3500',
  rooftopAvailable: 'yes',
  operatingHours: '24_7',
  hasMultipleFacilities: true,
};

const prefillPainPoints = ['high_cost', 'power_quality', 'no_visibility', 'want_solar'];

// ─── Welcome Screen ──────────────────────────────────────────────────────────

const WelcomeScreen = ({ onNext }: { onNext: () => void }) => (
  <div style={{
    padding: '2rem',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: '#F3F6E4',
  }}>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#D1EB0C' }}>
      Let's get you started.
    </h2>
    <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Choose the option that fits you best.</p>

    <p style={{ marginBottom: '1rem', fontWeight: 600 }}>What brings you here?</p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
      <button
        disabled
        style={{
          padding: '1.5rem 1rem',
          borderRadius: '0.75rem',
          background: 'rgba(0, 36, 46, 0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.35)',
          cursor: 'not-allowed',
          textAlign: 'center',
          transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>&#127968;</div>
        <div style={{ fontWeight: 600 }}>For My Home</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>Residential</div>
      </button>

      <button
        disabled
        style={{
          padding: '1.5rem 1rem',
          borderRadius: '0.75rem',
          background: 'rgba(0, 36, 46, 0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.35)',
          cursor: 'not-allowed',
          textAlign: 'center',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>&#127970;</div>
        <div style={{ fontWeight: 600 }}>For My Business</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>SME</div>
      </button>
    </div>

    <button
      onClick={onNext}
      style={{
        width: '100%',
        padding: '1.5rem 1rem',
        borderRadius: '0.75rem',
        background: 'rgba(0, 36, 46, 0.4)',
        border: '1px solid rgba(209, 235, 12, 0.3)',
        color: 'white',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(209, 235, 12, 0.6)';
        e.currentTarget.style.background = 'rgba(209, 235, 12, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(209, 235, 12, 0.3)';
        e.currentTarget.style.background = 'rgba(0, 36, 46, 0.4)';
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#127981;</div>
      <div style={{ fontWeight: 600 }}>For My Facility</div>
      <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>Commercial & Industrial</div>
      <div style={{
        fontSize: '0.7rem',
        color: '#D1EB0C',
        marginTop: '0.5rem',
        opacity: 0.8,
      }}>
        500 kW+ peak demand? Get a free energy audit
      </div>
    </button>

    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <span style={{ fontSize: '0.8rem', opacity: 0.5, cursor: 'pointer', textDecoration: 'underline' }}>
        Not sure which? Take the 30-second quiz
      </span>
    </div>
  </div>
);

// ─── Success Screen ──────────────────────────────────────────────────────────

const SuccessScreen = ({
  data,
  audit,
  onRestart,
}: {
  data: {
    companyName: string;
    facilityName: string;
    savingsLow: number;
    savingsHigh: number;
  };
  audit: AuditRequestData;
  onRestart: () => void;
}) => {
  const [checkVisible, setCheckVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCheckVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const formatPeso = (n: number) => n >= 1000000 ? `₱${(n / 1000000).toFixed(1)}M` : `₱${Math.round(n).toLocaleString()}`;

  return (
    <div style={{
      padding: '2rem',
      borderRadius: '15px',
      background: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      color: '#F3F6E4',
      textAlign: 'center',
    }}>
      {/* Animated Checkmark */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(209, 235, 12, 0.15)',
        border: '2px solid #D1EB0C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        transform: checkVisible ? 'scale(1)' : 'scale(0)',
        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{
          opacity: checkVisible ? 1 : 0,
          transition: 'opacity 0.3s 0.3s',
        }}>
          <path
            d="M8 18L15 25L28 11"
            stroke="#D1EB0C"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#D1EB0C' }}>
        Energy Audit Requested
      </h2>
      <p style={{ opacity: 0.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        A SunShare energy advisor will contact you within 24 hours to schedule your free on-site audit.
      </p>

      {/* Summary Card */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '0.75rem',
        background: 'rgba(0, 36, 46, 0.4)',
        border: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'left',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D1EB0C', marginBottom: '0.75rem', fontWeight: 600 }}>
          Audit Request Summary
        </div>
        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div><span style={{ opacity: 0.6 }}>Company:</span> {data.companyName}</div>
          <div><span style={{ opacity: 0.6 }}>Facility:</span> {data.facilityName}</div>
          <div><span style={{ opacity: 0.6 }}>Contact:</span> {audit.contactPerson} {audit.contactRole && `(${audit.contactRole})`}</div>
          <div><span style={{ opacity: 0.6 }}>Phone:</span> {audit.phone}</div>
          {audit.preferredDate && (
            <div><span style={{ opacity: 0.6 }}>Preferred date:</span> {audit.preferredDate}</div>
          )}
          <div style={{
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            <span style={{ opacity: 0.6 }}>Est. savings:</span>{' '}
            <span style={{ color: '#D1EB0C', fontWeight: 600 }}>
              {formatPeso(data.savingsLow)} &ndash; {formatPeso(data.savingsHigh)}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Email Note */}
      <div style={{
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        background: 'rgba(209, 235, 12, 0.08)',
        border: '1px solid rgba(209, 235, 12, 0.15)',
        marginBottom: '1.5rem',
        fontSize: '0.85rem',
      }}>
        Confirmation email sent to your registered email address
      </div>

      {/* Next Steps */}
      <div style={{
        padding: '1rem',
        borderRadius: '0.5rem',
        background: 'rgba(0, 36, 46, 0.3)',
        textAlign: 'left',
        marginBottom: '1.5rem',
        fontSize: '0.85rem',
        lineHeight: 1.7,
      }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>What happens next:</div>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{
            width: '22px', height: '22px', minWidth: '22px',
            borderRadius: '50%', background: 'rgba(209, 235, 12, 0.15)',
            color: '#D1EB0C', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700,
          }}>1</span>
          <span style={{ opacity: 0.8 }}>Energy advisor contacts you within 24 hours</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{
            width: '22px', height: '22px', minWidth: '22px',
            borderRadius: '50%', background: 'rgba(209, 235, 12, 0.15)',
            color: '#D1EB0C', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700,
          }}>2</span>
          <span style={{ opacity: 0.8 }}>Free on-site energy audit (Smappee monitoring deployment)</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span style={{
            width: '22px', height: '22px', minWidth: '22px',
            borderRadius: '50%', background: 'rgba(209, 235, 12, 0.15)',
            color: '#D1EB0C', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700,
          }}>3</span>
          <span style={{ opacity: 0.8 }}>Detailed efficiency diagnosis & savings proposal</span>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onRestart}
        style={{
          width: '100%',
          padding: '0.875rem',
          borderRadius: '0.5rem',
          background: '#D1EB0C',
          border: 'none',
          color: '#00242E',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '0.75rem',
        }}
      >
        Go to Dashboard
      </button>
      <button
        onClick={onRestart}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Add Another Facility
      </button>
    </div>
  );
};

// ─── Demo Toolbar ────────────────────────────────────────────────────────────

const DemoToolbar = ({
  currentStep,
  totalSteps,
  stepLabel,
  onRestart,
  onPrefill,
  onJumpTo,
}: {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  onRestart: () => void;
  onPrefill: () => void;
  onJumpTo: (step: number) => void;
}) => {
  const [showNav, setShowNav] = useState(false);

  return (
    <div style={{
      background: 'rgba(209, 235, 12, 0.08)',
      border: '1px solid rgba(209, 235, 12, 0.2)',
      borderRadius: '0.75rem',
      padding: '0.75rem 1rem',
      marginBottom: '1.5rem',
      fontSize: '0.8rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            background: '#D1EB0C',
            color: '#00242E',
            padding: '0.15rem 0.5rem',
            borderRadius: '0.25rem',
            fontWeight: 700,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            DEMO
          </span>
          <span style={{ opacity: 0.7 }}>
            Step {currentStep + 1}/{totalSteps} &mdash; {stepLabel}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onPrefill}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '0.25rem',
              background: 'rgba(209, 235, 12, 0.15)',
              border: '1px solid rgba(209, 235, 12, 0.3)',
              color: '#D1EB0C',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            Auto-fill &rarr; Review
          </button>
          <button
            onClick={() => setShowNav(!showNav)}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '0.25rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            Jump to step
          </button>
          <button
            onClick={onRestart}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '0.25rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            Restart
          </button>
        </div>
      </div>
      {showNav && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          flexWrap: 'wrap',
        }}>
          {ciStepLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => { onJumpTo(i); setShowNav(false); }}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                background: i === currentStep ? 'rgba(209, 235, 12, 0.2)' : 'rgba(255,255,255,0.05)',
                border: i === currentStep ? '1px solid rgba(209, 235, 12, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: i === currentStep ? '#D1EB0C' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: '0.7rem',
              }}
            >
              {i + 1}. {label}
            </button>
          ))}
          <button
            onClick={() => { onJumpTo(6); setShowNav(false); }}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontSize: '0.7rem',
            }}
          >
            7. Success
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main Demo Component ─────────────────────────────────────────────────────

const CIOnboardingDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [qualification, setQualification] = useState<QualificationData | null>(null);
  const [facility, setFacility] = useState<FacilityData | null>(null);
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<AuditRequestData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const next = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, ciStepLabels.length - 1));
    scrollToTop();
  }, [scrollToTop]);

  const back = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    scrollToTop();
  }, [scrollToTop]);

  const restart = useCallback(() => {
    setCurrentStep(0);
    setQualification(null);
    setFacility(null);
    setPainPoints([]);
    setAuditData(null);
    setShowSuccess(false);
    scrollToTop();
  }, [scrollToTop]);

  const prefillAndJump = useCallback(() => {
    setQualification(prefillQualification);
    setFacility(prefillFacility);
    setPainPoints(prefillPainPoints);
    setCurrentStep(4); // Jump to savings estimate
    scrollToTop();
  }, [scrollToTop]);

  const jumpTo = useCallback((step: number) => {
    if (step === 6) {
      // Jump to success — need pre-filled data
      setQualification(prefillQualification);
      setFacility(prefillFacility);
      setPainPoints(prefillPainPoints);
      setAuditData({
        contactPerson: 'Martin Banaria',
        contactRole: 'CEO',
        phone: '+63 917 123 4567',
        preferredDate: '2026-03-24',
        preferredTime: 'morning',
        notes: '',
      });
      setShowSuccess(true);
    } else {
      // Pre-fill data for steps beyond the target
      if (step >= 1) {
        setQualification(prefillQualification);
      }
      if (step >= 2) {
        setFacility(prefillFacility);
      }
      if (step >= 3) {
        setPainPoints(prefillPainPoints);
      }
      setShowSuccess(false);
      setCurrentStep(step);
    }
    scrollToTop();
  }, [scrollToTop]);

  // Calculate savings
  const getSavingsRange = () => {
    const base = spendMidpoints[qualification?.monthlySpend || '500k_1m'] || 500000;
    const points = painPoints.includes('high_cost') ? painPoints : ['high_cost', ...painPoints];
    const totalPercent = points.reduce((sum, id) => sum + (savingsPercents[id] || 0), 0);
    return {
      low: Math.round(base * totalPercent * 0.8),
      high: Math.round(base * totalPercent * 1.2),
    };
  };

  const savings = getSavingsRange();

  const renderStep = () => {
    if (showSuccess) {
      return (
        <SuccessScreen
          data={{
            companyName: qualification?.companyName || 'Pacific Star Manufacturing Corp.',
            facilityName: facility?.facilityName || 'Main Plant — Laguna',
            savingsLow: savings.low,
            savingsHigh: savings.high,
          }}
          audit={auditData || {
            contactPerson: 'Martin Banaria',
            contactRole: 'CEO',
            phone: '+63 917 123 4567',
            preferredDate: '',
            preferredTime: 'flexible',
            notes: '',
          }}
          onRestart={restart}
        />
      );
    }

    switch (currentStep) {
      case 0:
        return <WelcomeScreen onNext={next} />;
      case 1:
        return (
          <Step3CIQualification
            onNext={(data) => { setQualification(data); next(); }}
            onBack={back}
          />
        );
      case 2:
        return (
          <Step3CIFacility
            onNext={(data) => { setFacility(data); next(); }}
            onBack={back}
          />
        );
      case 3:
        return (
          <Step3CIPainPoints
            onNext={(selected) => { setPainPoints(selected); next(); }}
            onBack={back}
          />
        );
      case 4:
        return (
          <Step4CISavingsEstimate
            monthlySpend={qualification?.monthlySpend || '500k_1m'}
            painPoints={painPoints}
            onNext={next}
            onBack={back}
          />
        );
      case 5:
        return (
          <Step5CIReview
            data={{
              companyName: qualification?.companyName || '',
              industrySegment: qualification?.industrySegment || '',
              monthlySpend: qualification?.monthlySpend || '',
              currentProvider: qualification?.currentProvider || '',
              facilityName: facility?.facilityName || '',
              facilityAddress: facility?.address || '',
              facilityCity: facility?.city || '',
              facilityOwnership: facility?.facilityOwnership || '',
              floorArea: facility?.floorArea || '',
              rooftopAvailable: facility?.rooftopAvailable || '',
              operatingHours: facility?.operatingHours || '',
              painPoints: painPoints,
              savingsLow: savings.low,
              savingsHigh: savings.high,
            }}
            onSubmit={(audit) => {
              setAuditData(audit);
              setShowSuccess(true);
              scrollToTop();
            }}
            onBack={back}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} style={{ maxWidth: '520px', margin: '0 auto', padding: '1rem' }}>
      {/* Demo Toolbar */}
      <DemoToolbar
        currentStep={showSuccess ? 6 : currentStep}
        totalSteps={7}
        stepLabel={showSuccess ? 'Success' : ciStepLabels[currentStep]}
        onRestart={restart}
        onPrefill={prefillAndJump}
        onJumpTo={jumpTo}
      />

      {/* Step Indicators */}
      {!showSuccess && (
        <div style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          alignItems: 'center',
        }}>
          {ciStepLabels.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentStep ? '24px' : '10px',
                height: '10px',
                borderRadius: index === currentStep ? '5px' : '50%',
                background: index <= currentStep ? '#D1EB0C' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* Step Content */}
      <div style={{
        opacity: 1,
        transition: 'opacity 0.2s',
      }}>
        {renderStep()}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontSize: '0.75rem',
        opacity: 0.4,
      }}>
        SunShare Philippines Inc. &mdash; C&I Onboarding Prototype v1.0
      </div>
    </div>
  );
};

export default CIOnboardingDemo;
