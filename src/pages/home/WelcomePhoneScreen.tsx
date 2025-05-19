import React, { useState } from 'react';
import styles from './WelcomePhoneScreen.module.scss';
import Button from '../../shared/ui/Button/Button';
import Input from '../../shared/ui/Input/Input';

const WelcomePhoneScreen: React.FC<{ onContinue: (phone: string) => void }> = ({ onContinue }) => {
  const [phone, setPhone] = useState('');

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.title}>
          Enter your phone<br />number to<br />sign up or log in.
        </div>
        <Input
          type="tel"
          placeholder="+1 (___) ___-____"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onClear={() => setPhone('')}
          fullWidth
        />
        <Button
          fullWidth
          disabled={!phone.trim()}
          onClick={() => onContinue(phone)}
        >
          Continue
        </Button>
        <div className={styles.hint}>
          Message and data rates may apply. By continuing, you agree<br />
          to our <a href="#" tabIndex={-1}>Terms of Use</a> and <a href="#" tabIndex={-1}>Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default WelcomePhoneScreen; 