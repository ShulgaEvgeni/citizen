import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
// import HomePage from '../pages/home/HomePage';
import AboutPage from '../pages/about/AboutPage';
import styles from './App.module.scss';
import OnboardingPage from '../pages/onboarding/OnboardingPage';
// import { Button } from '../shared/ui';
import SubscriptionModal from '../pages/subscription/SubscriptionPage';
import MapPage from '../pages/map/MapPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import NotificationsSettingsPage from '../pages/notifications/NotificationsSettingsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import EditProfilePage from '../pages/profile/EditProfilePage';

const SplashScreen: React.FC = () => (
  <div className={styles.splash}>
    <div className={styles.splash__center}>
      <div className={styles.splash__logo}>
        <svg width="220" height="140" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="110" cy="70" r="40" fill="white" />
          <path d="M40 70a70 70 0 0 1 70-70" stroke="white" strokeWidth="28" strokeLinecap="butt" fill="none" />
          <path d="M180 70a70 70 0 0 0-70-70" stroke="white" strokeWidth="28" strokeLinecap="butt" fill="none" />
        </svg>
      </div>
      <div className={styles.splash__title}>CITIZEN</div>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showRealMap, setShowRealMap] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    
    // Проверяем наличие isOnboarding в localStorage
    const isOnboarding = localStorage.getItem('isOnboarding');
    if (!isOnboarding) {
      navigate('/onboarding');
    }
    
    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) return <SplashScreen />;

  return (
    <>
      <Routes>
        <Route path="/" element={<MapPage onShowRealMapChange={setShowRealMap} />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/notifications/settings" element={<NotificationsSettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
      </Routes>
      
      {showRealMap && (
        <div className={styles.bottomNav}>
          <Link to="/" className={styles.bottomNavIcon} aria-label="Главная">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L18 8L29 17V28C29 29.1046 28.1046 30 27 30H9C7.89543 30 7 29.1046 7 28V17Z" stroke="#fff" strokeWidth="2.5" fill="none"/>
            </svg>
          </Link>
          <div className={styles.bottomNavCenter}>
            <button
              className={styles.bottomNavCircle}
              aria-label="Открыть модалку"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              onClick={() => setModalOpen(true)}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#1856f5"/>
                <g filter="url(#glow)">
                  <path d="M24 12C18 12 14 15.5 14 21.5C14 32 24 36 24 36C24 36 34 32 34 21.5C34 15.5 30 12 24 12Z" fill="white"/>
                  <circle cx="24" cy="24" r="5" fill="#1856f5"/>
                </g>
                <defs>
                  <filter id="glow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            </button>
          </div>
          <Link to="/notifications" className={styles.bottomNavIcon} aria-label="Уведомления">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27 25V16C27 11.0294 22.9706 7 18 7C13.0294 7 9 11.0294 9 16V25L7 27V29H29V27L27 25Z" stroke="#fff" strokeWidth="2.5" fill="none"/>
              <circle cx="18" cy="31" r="2" fill="#fff"/>
            </svg>
          </Link>
        </div>
      )}
      <SubscriptionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mainContent={
          <div
            style={{
              position: 'fixed',
              zIndex: 1000,
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh', 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
            onClick={() => setModalOpen(false)}
          >
            <div
              style={{
                background: '#181A20',
                borderRadius: '24px 24px 0 0',
                padding: 24,
                maxWidth: 420,
                width: '100%',
                margin: 0,
                color: '#fff',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 60% 40%, #1856f5 60%, #181A20 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                  boxShadow: '0 0 24px 8px #1856f5'
                }}>
                  {/* Заглушка-аватар */}
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" fill="#23242a" />
                    <ellipse cx="50" cy="45" rx="22" ry="18" fill="#444" />
                    <ellipse cx="50" cy="78" rx="28" ry="14" fill="#444" />
                    <ellipse cx="50" cy="45" rx="12" ry="10" fill="#888" />
                  </svg>
                </div>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Live Agents on duty</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 22, textAlign: 'center', marginBottom: 8 }}>
                Get instant help from powerful safety agents
              </div>
              <div style={{ color: '#aaa', textAlign: 'center', marginBottom: 16 }}>
                Demo Agent powers &rsaquo;
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 24, justifyContent: 'center' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #0a1a3a 60%, #1856f5 100%)',
                  borderRadius: 16,
                  border: 'none',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 18,
                  padding: '24px 20px',
                  minWidth: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(24,86,245,0.15)'
                }}>
                  <span style={{ fontSize: 28, marginBottom: 8 }}>🟦</span>
                  Live Monitoring
                </button>
                <button style={{
                  background: 'linear-gradient(135deg, #0a1a3a 60%, #1856f5 100%)',
                  borderRadius: 16,
                  border: 'none',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 18,
                  padding: '24px 20px',
                  minWidth: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(24,86,245,0.15)'
                }}>
                  <span style={{ fontSize: 28, marginBottom: 8 }}>🎥</span>
                  Video Call
                </button>
              </div>
              <input
                type="text"
                disabled
                value="Start Agent Chat"
                style={{
                  width: '100%',
                  borderRadius: 16,
                  background: '#23242a',
                  color: '#888',
                  border: 'none',
                  padding: '16px 20px',
                  fontSize: 18,
                  fontWeight: 500,
                  marginBottom: 0
                }}
              />
            </div>
          </div>
        }
        bottomContent={null}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter basename='citizen'>
      <AppContent />
    </BrowserRouter>
  );
};

export default App; 