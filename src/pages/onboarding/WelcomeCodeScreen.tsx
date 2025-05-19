import React, { useEffect, useState } from 'react';
import styles from './WelcomeCodeScreen.module.scss'; 
import Button from '../../shared/ui/Button/Button';
import Input from '../../shared/ui/Input/Input';

const WelcomeCodeScreen: React.FC<{ onSubmit: (code: string) => void }> = ({ onSubmit }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (code.length === 4) {
      onSubmit(code);
    }
  }, [code, onSubmit]);

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.title}>Enter code</div>
        <Input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onClear={() => setCode('')}
          maxLength={4}
          fullWidth
        />
        <div className={styles.hint}>
          Didn't receive your code? <Button className={styles.resend} type="button">Resend</Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCodeScreen; 