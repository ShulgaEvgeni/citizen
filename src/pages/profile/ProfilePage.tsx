import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const [hideBroadcasts, setHideBroadcasts] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', fontFamily: 'inherit', paddingBottom: 100 }}>
      {/* Верхняя панель */}
      <div style={{ display: 'flex', alignItems: 'center', height: 56, borderBottom: '1px solid #222', padding: '0 12px', position: 'sticky', top: 0, background: '#111', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, marginRight: 8, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 18, letterSpacing: 0.2 }}>JohnMobbinNYC</div>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/profile/edit')}>EDIT</button>
      </div>
      {/* Аватар и имя */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 28, marginBottom: 12 }}>
        <div style={{ width: 110, height: 110, borderRadius: '50%', background: '#3a5647', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="32" r="20" fill="#7fa88c" />
            <path d="M40 52c-13 0-24 6-24 14v2h48v-2c0-8-11-14-24-14z" fill="#7fa88c" />
          </svg>
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>John Mobbin</div>
      </div>
      {/* Статистика */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 18px auto', maxWidth: 340, background: '#181818', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '18px 0 12px 0' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>1</div>
          <div style={{ color: '#888', fontSize: 13, fontWeight: 600, letterSpacing: 1, marginTop: 2 }}>PLACES</div>
        </div>
        <div style={{ width: 1, height: 36, background: '#222' }} />
        <div style={{ flex: 1, textAlign: 'center', padding: '18px 0 12px 0' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>0</div>
          <div style={{ color: '#888', fontSize: 13, fontWeight: 600, letterSpacing: 1, marginTop: 2 }}>FRIENDS</div>
        </div>
      </div>
      {/* Переключатели */}
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <span style={{ fontSize: 18 }}>Hide My Broadcasts <span style={{ color: '#888', fontSize: 18, marginLeft: 4, cursor: 'pointer' }}>?</span></span>
          <label style={{ display: 'inline-block', position: 'relative', width: 48, height: 28 }}>
            <input type="checkbox" checked={hideBroadcasts} onChange={e => setHideBroadcasts(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, background: hideBroadcasts ? '#1856f5' : '#444', borderRadius: 16, transition: 'background 0.2s' }} />
            <span style={{ position: 'absolute', left: hideBroadcasts ? 22 : 2, top: 2, width: 24, height: 24, background: '#fff', borderRadius: '50%', transition: 'left 0.2s' }} />
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
          <span style={{ fontSize: 18 }}>Ghost Mode</span>
          <label style={{ display: 'inline-block', position: 'relative', width: 48, height: 28 }}>
            <input type="checkbox" checked={ghostMode} onChange={e => setGhostMode(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, background: ghostMode ? '#1856f5' : '#444', borderRadius: 16, transition: 'background 0.2s' }} />
            <span style={{ position: 'absolute', left: ghostMode ? 22 : 2, top: 2, width: 24, height: 24, background: '#fff', borderRadius: '50%', transition: 'left 0.2s' }} />
          </label>
        </div>
        <div style={{ color: '#888', fontSize: 15, margin: '8px 0 18px 0', lineHeight: 1.4 }}>
          Turn off Ghost Mode to allow friends and family to look out for you on the safety map.
        </div>
      </div>
      {/* Статистика 2 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 18px auto', maxWidth: 400, background: '#181818', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '14px 0 10px 0' }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>1</div>
          <div style={{ color: '#888', fontSize: 13, fontWeight: 600, letterSpacing: 1, marginTop: 2 }}>BROADCASTS</div>
        </div>
        <div style={{ width: 1, height: 32, background: '#222' }} />
        <div style={{ flex: 1, textAlign: 'center', padding: '14px 0 10px 0' }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>0</div>
          <div style={{ color: '#888', fontSize: 13, fontWeight: 600, letterSpacing: 1, marginTop: 2 }}>VERIFIED</div>
        </div>
        <div style={{ width: 1, height: 32, background: '#222' }} />
        <div style={{ flex: 1, textAlign: 'center', padding: '14px 0 10px 0' }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>0</div>
          <div style={{ color: '#888', fontSize: 13, fontWeight: 600, letterSpacing: 1, marginTop: 2 }}>VIEWS</div>
        </div>
      </div>
      {/* Кнопки */}
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0 0 0', cursor: 'pointer' }}>
          <span style={{ color: '#7fff7f', fontSize: 22, display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" fill="none" stroke="#7fff7f" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <span style={{ fontSize: 18, fontWeight: 600 }}>ADD FRIENDS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0 0 0', cursor: 'pointer' }}>
          <span style={{ color: '#7fff7f', fontSize: 22, display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" fill="none" stroke="#7fff7f" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M8 12h8"/></svg>
          </span>
          <span style={{ fontSize: 18, fontWeight: 600 }}>APP SETTINGS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0 0 0', cursor: 'pointer' }}>
          <span style={{ color: '#7fff7f', fontSize: 22, display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" fill="none" stroke="#7fff7f" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
          </span>
          <span style={{ fontSize: 18, fontWeight: 600 }}>FAQ</span>
        </div>
      </div>
      {/* Соцсети */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 38, marginBottom: 10 }}>
        <a href="#" style={{ color: '#fff', fontSize: 28 }} aria-label="Facebook"><svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
        <a href="#" style={{ color: '#fff', fontSize: 28 }} aria-label="Twitter"><svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1.64a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 1c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 6.4 4.07 4.67 1.64 2.16c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 0 1 1 7.15v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.16 2.97 4.07 3A9.05 9.05 0 0 1 1 19.54a12.8 12.8 0 0 0 6.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 23 3z"/></svg></a>
        <a href="#" style={{ color: '#fff', fontSize: 28 }} aria-label="Instagram"><svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg></a>
        <a href="#" style={{ color: '#fff', fontSize: 28 }} aria-label="Medium"><svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="2"/><path d="M8.59 16.34A7.97 7.97 0 0 0 12 17c1.61 0 3.13-.48 4.41-1.31"/></svg></a>
      </div>
      {/* Индикатор свайпа */}
      <div style={{ height: 18, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 120, height: 5, borderRadius: 3, background: '#222', margin: '0 auto' }} />
      </div>
    </div>
  );
};

export default ProfilePage; 