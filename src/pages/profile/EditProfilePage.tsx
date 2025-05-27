import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LS_KEY = 'profileData';

const defaultProfile = {
  firstName: '',
  lastName: '',
  username: '',
  location: '',
  email: '',
  mission: '',
  avatar: '',
};

const EditProfilePage: React.FC = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
      setAvatarPreview(parsed.avatar || '');
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setAvatarPreview(ev.target?.result as string);
        setProfile(prev => ({ ...prev, avatar: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(profile));
    navigate(-1);
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#111', color: '#fff', fontFamily: 'inherit', paddingBottom: 100 }}>
      {/* Верхняя панель */}
      <div style={{ display: 'flex', alignItems: 'center', height: 56, borderBottom: '1px solid #222', padding: '0 12px', position: 'sticky', top: 0, background: '#111', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, fontWeight: 600, marginRight: 8, cursor: 'pointer' }}>ОТМЕНА</button>
        <div style={{ flex: 1 }} />
        <button onClick={handleSave} style={{ background: 'none', border: 'none', color: '#7faaff', fontSize: 18, fontWeight: 600, cursor: 'pointer' }}>СОХРАНИТЬ</button>
      </div>
      {/* Аватар */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 28, marginBottom: 18 }}>
        <div style={{ width: 110, height: 110, borderRadius: '50%', background: '#3a5647', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative', cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="аватар" style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="32" r="20" fill="#7fa88c" />
              <path d="M40 52c-13 0-24 6-24 14v2h48v-2c0-8-11-14-24-14z" fill="#7fa88c" />
              <circle cx="40" cy="40" r="16" fill="#3a5647" />
              <rect x="32" y="36" width="16" height="12" rx="3" fill="#fff" opacity="0.18" />
              <circle cx="40" cy="42" r="3" fill="#fff" opacity="0.4" />
              <rect x="36" y="38" width="8" height="4" rx="2" fill="#fff" />
            </svg>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          <div style={{ position: 'absolute', bottom: 8, right: 8, background: '#222', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #111' }}>
            <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M8 12h8"/></svg>
          </div>
        </div>
      </div>
      {/* Форма */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 18px' }}>
        <div style={{ color: '#888', fontSize: 13, fontWeight: 600, marginBottom: 2, marginTop: 18 }}>ИМЯ (ТОЛЬКО ДЛЯ ДРУЗЕЙ)</div>
        <input value={profile.firstName} onChange={e => handleChange('firstName', e.target.value)} placeholder="Имя" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #222', color: '#fff', fontSize: 20, padding: '10px 0', marginBottom: 8 }} />
        <div style={{ color: '#888', fontSize: 13, fontWeight: 600, marginBottom: 2, marginTop: 18 }}>ФАМИЛИЯ (ТОЛЬКО ДЛЯ ДРУЗЕЙ)</div>
        <input value={profile.lastName} onChange={e => handleChange('lastName', e.target.value)} placeholder="Фамилия" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #222', color: '#fff', fontSize: 20, padding: '10px 0', marginBottom: 8 }} />
        <div style={{ color: '#888', fontSize: 13, fontWeight: 600, marginBottom: 2, marginTop: 18 }}>ИМЯ ПОЛЬЗОВАТЕЛЯ</div>
        <input value={profile.username} onChange={e => handleChange('username', e.target.value)} placeholder="Имя пользователя" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #222', color: '#fff', fontSize: 20, padding: '10px 0', marginBottom: 8 }} />
        <div style={{ color: '#888', fontSize: 13, fontWeight: 600, marginBottom: 2, marginTop: 18 }}>МЕСТОПОЛОЖЕНИЕ</div>
        <input value={profile.location} onChange={e => handleChange('location', e.target.value)} placeholder="введите ваш город" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #222', color: '#fff', fontSize: 20, padding: '10px 0', marginBottom: 8 }} />
        <div style={{ color: '#888', fontSize: 13, fontWeight: 600, marginBottom: 2, marginTop: 18 }}>EMAIL</div>
        <input value={profile.email} onChange={e => handleChange('email', e.target.value)} placeholder="Email" style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #222', color: '#fff', fontSize: 20, padding: '10px 0', marginBottom: 8 }} />
        <div style={{ color: '#888', fontSize: 13, fontWeight: 600, marginBottom: 2, marginTop: 18 }}>ВАША МИССИЯ</div>
        <input value={profile.mission} onChange={e => handleChange('mission', e.target.value)} placeholder="введите вашу миссию..." style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #222', color: '#fff', fontSize: 20, padding: '10px 0', marginBottom: 8 }} />
      </div>
    </div>
  );
};

export default EditProfilePage;