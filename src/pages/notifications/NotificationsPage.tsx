import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotificationsPage.module.scss';

const STORAGE_KEY = 'notificationSettings';

const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    time: '13:28',
    title: 'Два человека застряли в перевернувшемся автомобиле',
    desc: 'Пожарные работают над освобождением двух пострадавших из обломков на площади Колумба. Нажмите для обновлений.',
    dot: 'blue',
  },
  {
    id: 2,
    time: '03:49',
    title: 'Прямая трансляция. 400 метров',
    desc: 'Дорожно-транспортное происшествие. Нажмите, чтобы обновить информацию для вашего сообщества',
    dot: 'red',
  },
];

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.helicopter || parsed.covid || parsed.weather) {
          setEnabled(true);
        } else {
          setEnabled(false);
        }
      } catch {
        setEnabled(false);
      }
    } else {
      setEnabled(true); // по умолчанию показываем уведомления
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>Уведомления</div>
        <button
          className={styles.settingsBtn}
          aria-label="Настройки уведомлений"
          onClick={() => navigate('/notifications/settings')}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="18" fill="#23242a"/>
            <path d="M18 13.5V22.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M13.5 18H22.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="18" cy="18" r="7" stroke="#fff" strokeWidth="2"/>
          </svg>
        </button>
      </div>
      {enabled ? (
        <>
          <div className={styles.recent}>Недавние</div>
          <div className={styles.notificationsList}>
            {DEMO_NOTIFICATIONS.map(n => (
              <div className={styles.notification} key={n.id}>
                <div className={styles.notificationTitleRow}>
                  <span className={styles[n.dot+'Dot']}></span>
                  <span className={styles.notificationTitle}>{n.title}</span>
                </div>
                <div className={styles.notificationDesc}>{n.desc}</div>
                <div className={styles.notificationMeta}>
                  <span className={styles.notificationTime}>{n.time}</span>
                  <span className={styles.metaBtn}>полезно <span role="img" aria-label="like">👍</span></span>
                  <span className={styles.metaBtn}>не полезно <span role="img" aria-label="dislike">👎</span></span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.mapWrap}>
            <svg width="320" height="220" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.25">
                <rect x="0" y="0" width="320" height="220" fill="#222" />
                <g stroke="#444" strokeWidth="2">
                  {[...Array(8)].map((_, i) => (
                    <line key={i} x1={40 * (i + 1)} y1={0} x2={40 * (i + 1)} y2={220} />
                  ))}
                  {[...Array(5)].map((_, i) => (
                    <line key={i} x1={0} y1={44 * (i + 1)} x2={320} y2={44 * (i + 1)} />
                  ))}
                </g>
              </g>
              <circle cx="160" cy="110" r="80" fill="#1aff6a" fillOpacity="0.18" />
              <circle cx="160" cy="110" r="12" fill="#fff" fillOpacity="0.9" />
              <circle cx="160" cy="110" r="7" fill="#1856f5" />
            </svg>
          </div>
          <div className={styles.noNotifTitle}>В ДАННЫЙ МОМЕНТ НЕТ УВЕДОМЛЕНИЙ</div>
          <div className={styles.noNotifDesc}>
            Мы уведомим вас, когда произойдет инцидент рядом с вами или вашими близкими.<br />
            Мы также будем отправлять вам новости и обновления сообщества.
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPage; 