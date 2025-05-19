import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import WelcomePhoneScreen from './WelcomePhoneScreen';
import WelcomeCodeScreen from './WelcomeCodeScreen';
import WelcomeProfileScreen from './WelcomeProfileScreen';

const OnboardingPage: React.FC  = ( ) => {
  const [step, setStep] = useState<'welcome' | 'phone' | 'code' | 'profile'>('welcome');

  if (step === 'welcome') {
    return <WelcomeScreen onStart={() => setStep('phone')} />;
  }

  if (step === 'phone') {
    return <WelcomePhoneScreen onContinue={() => setStep('code')} />;
  }

  if (step === 'code') {
    return <WelcomeCodeScreen onSubmit={code => code === '1234' ? setStep('profile') : undefined} />;
  }

  if (step === 'profile') {
    return <WelcomeProfileScreen   />;
  }

  return null;
};

export default OnboardingPage; 