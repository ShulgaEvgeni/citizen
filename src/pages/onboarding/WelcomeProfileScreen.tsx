import React, { useState } from 'react';
import styles from './WelcomeProfileScreen.module.scss';
import Button from '../../shared/ui/Button/Button';
import Input from '../../shared/ui/Input/Input';

const generateUsername = () => `NewYorkUser${Math.floor(Math.random() * 1e8)}`;

const WelcomeProfileScreen: React.FC<{ onContinue: (username: string, email: string) => void }> = ({ onContinue }) => {
  const [username, setUsername] = useState(generateUsername());
  const [email, setEmail] = useState('');  
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.title}>Create your profile</div>
        <div className={styles.subtitle}>Enter username and email address</div>
     
        <Input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onClear={() => setUsername('')}
          fullWidth
        />
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          fullWidth
        />
        <Button
          fullWidth
          disabled={!username.trim() || !email.trim()}
          onClick={() => onContinue(username, email)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default WelcomeProfileScreen; 