import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
// import HomePage from '../pages/home/HomePage';
import AboutPage from '../pages/about/AboutPage';
import styles from './App.module.scss';
import OnboardingPage from '../pages/onboarding/OnboardingPage';
// import { Button } from '../shared/ui';
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

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isOnboardingCompleted = localStorage.getItem('isOnboarding');
    if (!isOnboardingCompleted) {
      navigate('/onboarding');
    }
  }, [navigate]);

  if (loading) return <SplashScreen />;

  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/notifications/settings" element={<NotificationsSettingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter basename='citizen'>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App; 