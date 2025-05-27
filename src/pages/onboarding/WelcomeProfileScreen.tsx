import React, { useState } from 'react';
import styles from './WelcomeProfileScreen.module.scss';
import Button from '../../shared/ui/Button/Button';
import Input from '../../shared/ui/Input/Input';

const generateUsername = () => `Пользователь${Math.floor(Math.random() * 1e8)}`;

const WelcomeProfileScreen: React.FC<{ onContinue: (username: string, email: string) => void }> = ({ onContinue }) => {
  const [username, setUsername] = useState(generateUsername());
  const [email, setEmail] = useState('');  
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.title}>Создайте профиль</div>
        <div className={styles.subtitle}>Введите имя пользователя и email</div>
     
        <Input
          type="text"
          placeholder="Введите имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onClear={() => setUsername('')}
          fullWidth
        />
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email адрес"
          fullWidth
        />
        <Button
          fullWidth
          disabled={!username.trim() || !email.trim()}
          onClick={() => onContinue(username, email)}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default WelcomeProfileScreen; 