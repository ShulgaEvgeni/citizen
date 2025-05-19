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
      } catch {}
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
        <div className={styles.title}>Notification Settings</div>
      </div>
      <div className={styles.desc}>
        Customize your notifications based on your personal preferences. Opt-out to receive only major notifications in each category.
      </div>
      <div className={styles.categoriesTitle}>Categories</div>
      <div className={styles.list}>
        <div className={styles.item}>
          <div>
            <div className={styles.itemTitle}>Helicopter Notifications</div>
            <div className={styles.itemDesc}>Information about helicopters overhead and related incidents</div>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={helicopter} onChange={() => setHelicopter(v => !v)} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.item}>
          <div>
            <div className={styles.itemTitle}>COVID-19 Notifications</div>
            <div className={styles.itemDesc}>Updates on public health, like virus outbreaks or vaccination (e.g. COVID)</div>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={covid} onChange={() => setCovid(v => !v)} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.item}>
          <div>
            <div className={styles.itemTitle}>Weather Notifications</div>
            <div className={styles.itemDesc}>Alerts about weather conditions and natural disasters, like earthquakes or tornadoes</div>
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