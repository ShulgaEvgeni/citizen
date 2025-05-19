import React from 'react';
import styles from './WelcomeScreen.module.scss';

const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className={styles.root}>
      <div className={styles.bg} />
      <div className={styles.content}>
        <div className={styles.cards}>
          <div className={styles.card}>
            <span className={styles.icon} />
            <div>
              <div className={styles.cardTitle}>Vehicle Pursuit of Armed Suspect</div>
              <div className={styles.cardSubtitle}>400 ft away</div>
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.icon} />
            <div>
              <div className={styles.cardTitle}>New Message: Agent Jackie</div>
              <div className={styles.cardSubtitle}>
                "I'm monitoring you until you get home safe"
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.icon} />
            <div>
              <div className={styles.cardTitle}>
                <span role="img" aria-label="green heart">💚</span> Missing Boy Found
              </div>
              <div className={styles.cardSubtitle}>
                Citizen community helps find loved one
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.welcomeText}>
            Live safely and confidently.<br />Welcome to Citizen
          </div>
          <button className={styles.button} onClick={onStart}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen; 