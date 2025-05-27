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
          Введите номер<br />телефона для<br />регистрации или входа.
        </div>
        <Input
          type="tel"
          placeholder="+7 (___) ___-____"
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
          Продолжить
        </Button>
        <div className={styles.hint}>
          Могут применяться тарифы на сообщения и передачу данных. Продолжая, вы соглашаетесь<br />
          с нашими <a href="#" tabIndex={-1}>Условиями использования</a> и <a href="#" tabIndex={-1}>Политикой конфиденциальности</a>.
        </div>
      </div>
    </div>
  );
};

export default WelcomePhoneScreen; 