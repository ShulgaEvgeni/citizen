import React, { useState, useEffect } from 'react';
import styles from './NotificationsPage.module.scss';

const STORAGE_KEY = 'notificationSettings';

const NotificationsSettingsPage: React.FC = () => {
  const [helicopter, setHelicopter] = useState(true);
  const [covid, setCovid] = useState(true);
  const [weather, setWeather] = useState(true);

  // Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHelicopter(!!parsed.helicopter);
        setCovid(!!parsed.covid);
        setWeather(!!parsed.weather);
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error);
      }
    }
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ helicopter, covid, weather }));
  }, [helicopter, covid, weather]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <button className={styles.backBtn} aria-label="Назад" onClick={() => window.history.back()}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.title}>Настройки уведомлений</div>
      </div>
      <div className={styles.desc}>
        Настройте уведомления в соответствии с вашими предпочтениями. Отключите ненужные категории, чтобы получать только важные уведомления.
      </div>
      <div className={styles.categoriesTitle}>Категории</div>
      <div className={styles.list}>
        <div className={styles.item}>
          <div>
            <div className={styles.itemTitle}>Уведомления о вертолетах</div>
            <div className={styles.itemDesc}>Информация о вертолетах в воздухе и связанных инцидентах</div>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={helicopter} onChange={() => setHelicopter(v => !v)} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.item}>
          <div>
            <div className={styles.itemTitle}>Уведомления о COVID-19</div>
            <div className={styles.itemDesc}>Обновления о состоянии общественного здоровья, вспышках заболеваний и вакцинации</div>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={covid} onChange={() => setCovid(v => !v)} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.item}>
          <div>
            <div className={styles.itemTitle}>Уведомления о погоде</div>
            <div className={styles.itemDesc}>Предупреждения о погодных условиях и стихийных бедствиях, таких как землетрясения или торнадо</div>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={weather} onChange={() => setWeather(v => !v)} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettingsPage; 