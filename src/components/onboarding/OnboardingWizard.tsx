'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Step1QuickStart from './steps/Step1QuickStart';
import Step2Welcome from './steps/Step2Welcome';
import Step3Property from './steps/Step3Property';
import Step3BusinessDetails from './steps/Step3BusinessDetails';
import Step3CIQualification from './steps/Step3CIQualification';
import Step3CIFacility from './steps/Step3CIFacility';
import Step3CIPainPoints from './steps/Step3CIPainPoints';
import Step4Preferences from './steps/Step4Preferences';
import Step4CISavingsEstimate from './steps/Step4CISavingsEstimate';
import Step5Review from './steps/Step5Review';
import Step5CIReview from './steps/Step5CIReview';
import { useOnboardingTheme } from './useOnboardingTheme';

type Intention = 'home' | 'business' | 'ci' | null;

// Step definitions per flow
const residentialSteps = ['Sign Up', 'Choose Path', 'Details', 'Preferences', 'Review'];
const ciSteps = ['Sign Up', 'Choose Path', 'Company', 'Facility', 'Challenges', 'Savings', 'Review'];

const spendMidpoints: Record<string, number> = {
  'below_200k': 150000, '200k_500k': 350000, '500k_1m': 750000,
  '1m_5m': 3000000, 'above_5m': 7500000,
};
const savingsPercents: Record<string, number> = {
  'high_cost': 0.14, 'power_quality': 0.05, 'no_visibility': 0.03,
  'want_solar': 0.08, 'unreliable_metering': 0.02, 'esg_goals': 0.01,
};

const OnboardingWizard = () => {
  const { isLight } = useOnboardingTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [intention, setIntention] = useState<Intention>(null);
  const [userName, setUserName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // C&I state
  const [ciQualification, setCIQualification] = useState<any>(null);
  const [ciFacility, setCIFacility] = useState<any>(null);
  const [ciPainPoints, setCIPainPoints] = useState<string[]>([]);

  const steps = intention === 'ci' ? ciSteps : residentialSteps;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentStep]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const next = useCallback((val?: any) => {
    if (currentStep === 1 && val) setIntention(val);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    scrollToTop();
  }, [currentStep, steps.length, scrollToTop]);

  const back = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    scrollToTop();
  }, [scrollToTop]);

  // Calculate savings for C&I review
  const getSavingsRange = () => {
    const base = spendMidpoints[ciQualification?.monthlySpend] || 500000;
    const points = ciPainPoints.includes('high_cost') ? ciPainPoints : ['high_cost', ...ciPainPoints];
    const totalPercent = points.reduce((sum, id) => sum + (savingsPercents[id] || 0), 0);
    return { low: Math.round(base * totalPercent * 0.8), high: Math.round(base * totalPercent * 1.2) };
  };

  const renderStep = () => {
    // Step 0: Auth
    if (currentStep === 0) {
      return (
        <Step1QuickStart onNext={(name) => {
          setUserName(name);
          next();
        }} />
      );
    }

    // Step 1: Welcome / Choose Path
    if (currentStep === 1) return <Step2Welcome onNext={next} />;

    // C&I Flow
    if (intention === 'ci') {
      switch (currentStep) {
        case 2:
          return (
            <Step3CIQualification
              onNext={(data) => { setCIQualification(data); next(); }}
              onBack={back}
            />
          );
        case 3:
          return (
            <Step3CIFacility
              onNext={(data) => { setCIFacility(data); next(); }}
              onBack={back}
            />
          );
        case 4:
          return (
            <Step3CIPainPoints
              onNext={(selected) => { setCIPainPoints(selected); next(); }}
              onBack={back}
            />
          );
        case 5:
          return (
            <Step4CISavingsEstimate
              monthlySpend={ciQualification?.monthlySpend || '500k_1m'}
              painPoints={ciPainPoints}
              onNext={next}
              onBack={back}
            />
          );
        case 6: {
          const savings = getSavingsRange();
          return (
            <Step5CIReview
              data={{
                companyName: ciQualification?.companyName || '',
                industrySegment: ciQualification?.industrySegment || '',
                monthlySpend: ciQualification?.monthlySpend || '',
                currentProvider: ciQualification?.currentProvider || '',
                facilityName: ciFacility?.facilityName || '',
                facilityAddress: ciFacility?.address || '',
                facilityCity: ciFacility?.city || '',
                facilityOwnership: ciFacility?.facilityOwnership || '',
                floorArea: ciFacility?.floorArea || '',
                rooftopAvailable: ciFacility?.rooftopAvailable || '',
                operatingHours: ciFacility?.operatingHours || '',
                painPoints: ciPainPoints,
                savingsLow: savings.low,
                savingsHigh: savings.high,
              }}
              onSubmit={() => {
                // Redirect to C&I dashboard
                window.location.href = '/dashboard/ci';
              }}
              onBack={back}
            />
          );
        }
        default:
          return <div>Unknown step</div>;
      }
    }

    // Residential / Business Flow (existing)
    switch (currentStep) {
      case 2:
        return intention === 'business'
          ? <Step3BusinessDetails onNext={next} onBack={back} />
          : <Step3Property onNext={next} onBack={back} />;
      case 3:
        return <Step4Preferences onNext={next} onBack={back} />;
      case 4:
        return <Step5Review onBack={back} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div ref={containerRef} style={{ maxWidth: '520px', margin: '0 auto' }}>
      {/* Step Indicators */}
      <div style={{
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        {steps.map((_step, index) => (
          <div
            key={index}
            style={{
              width: index === currentStep ? '24px' : '10px',
              height: '10px',
              borderRadius: index === currentStep ? '5px' : '50%',
              background: index <= currentStep
                ? (isLight ? '#004F64' : '#D1EB0C')
                : (isLight ? 'rgba(0, 36, 46, 0.15)' : 'rgba(255,255,255,0.2)'),
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Step label */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1rem',
        fontSize: '0.75rem',
        opacity: 0.4,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        Step {currentStep + 1} of {steps.length} &mdash; {steps[currentStep]}
      </div>

      <div>{renderStep()}</div>
    </div>
  );
};

export default OnboardingWizard;
