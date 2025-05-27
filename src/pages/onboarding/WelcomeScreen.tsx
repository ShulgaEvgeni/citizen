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
              <div className={styles.cardTitle}>Преследование вооруженного подозреваемого</div>
              <div className={styles.cardSubtitle}>400 метров</div>
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.icon} />
            <div>
              <div className={styles.cardTitle}>Новое сообщение: Агент Джеки</div>
              <div className={styles.cardSubtitle}>
                "Я слежу за вашей безопасностью, пока вы не доберетесь домой"
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.icon} />
            <div>
              <div className={styles.cardTitle}>
                <span role="img" aria-label="зеленое сердце">💚</span> Пропавший мальчик найден
              </div>
              <div className={styles.cardSubtitle}>
                Сообщество CITIZEN помогло найти близкого человека
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.welcomeText}>
            Живите безопасно и уверенно.<br />Добро пожаловать в CITIZEN
          </div>
          <button className={styles.button} onClick={onStart}>Начать</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen; 