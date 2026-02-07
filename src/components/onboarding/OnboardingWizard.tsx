'use client';
import React, { useState } from 'react';
import Step1Auth from './steps/Step1Auth';
import Step2Welcome from './steps/Step2Welcome';
import Step3Property from './steps/Step3Property'; // Reusing for Homeowner
import Step3BusinessDetails from './steps/Step3BusinessDetails'; // New for Business
import Step4Preferences from './steps/Step4Preferences';
import Step5Review from './steps/Step5Review';

const steps = ['Auth', 'Welcome', 'Details', 'Preferences', 'Review'];

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [intention, setIntention] = useState<'home' | 'business' | null>(null);

  const next = (val?: any) => {
    if (currentStep === 1 && val) setIntention(val);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  
  const back = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Auth onNext={next} />;
      case 1:
        return <Step2Welcome onNext={next} />;
      case 2:
        // Branching Logic: Home vs Business
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
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        {steps.map((step, index) => (
          <div 
            key={index}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: index <= currentStep ? '#D1EB0C' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.3s'
            }}
          />
        ))}
      </div>
      <div>{renderStep()}</div>
    </div>
  );
};

export default OnboardingWizard;
