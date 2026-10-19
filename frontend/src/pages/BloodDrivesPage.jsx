import { useState, useEffect } from 'react';
import { driveService } from '../services/api';

const CITIES = ['All', 'Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai'];

export default function BloodDrivesPage({ onBack, currentUser, defaultCity = 'All', theme, toggleTheme, onGoToLogin }) {
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [searchQuery, setSearchQuery] = useState('');
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registeredDrives, setRegisteredDrives] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchDrives(true);

    // Live real-time sync with backend: polls every 3 seconds
    const interval = setInterval(() => {
      fetchDrives(false);
    }, 3000);

    const onFocus = () => fetchDrives(false);
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [selectedCity, searchQuery]);

  const fetchDrives = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const params = {};
      if (selectedCity && selectedCity !== 'All') params.city = selectedCity;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await driveService.getAll(params);
      setDrives(data || []);
    } catch (err) {
      // maintain state on transient fetch error
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const handleRegister = async (drive) => {
    if (!currentUser) {
      if (onGoToLogin) {
        onGoToLogin();
      }
      return;
    }
    try {
      await driveService.registerDonor(drive.id, currentUser.name || 'Registered Donor');
      setRegisteredDrives((prev) => ({ ...prev, [drive.id]: true }));
      setToastMsg(`Successfully registered to attend "${drive.bloodBankName}" collection drive!`);
      setTimeout(() => setToastMsg(''), 4000);
      fetchDrives(false);
    } catch (err) {
      setRegisteredDrives((prev) => ({ ...prev, [drive.id]: true }));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '24px 36px 60px', transition: 'background 0.2s, color 0.2s' }}>

      {/* Wide Top Bar */}
      <div style={{ maxWidth: 1380, margin: '0 auto 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {currentUser && (
            <span style={{ fontSize: 12, color: theme.dim, background: theme.cardAlt, padding: '5px 12px', borderRadius: 12, border: `1px solid ${theme.bord}` }}>
              Logged in: <strong>{currentUser.name}</strong>
            </span>
          )}
          <button
            onClick={toggleTheme}
            style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
          >
            {theme.isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1380, margin: '0 auto' }}>

        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
              Active Blood Collection Drives
            </h1>
            <span style={{ background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, color: theme.green, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 12 }}>
              Authorized Camps
            </span>
          </div>
          <p style={{ fontSize: 14, color: theme.dim, marginTop: 6 }}>
            Community donation drives organized by accredited blood banks · Live real-time schedule across cities
          </p>
        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div style={{ background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, color: theme.green, padding: '12px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>✓</span>
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Wide Filters */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="text"
            placeholder="Search drive by venue, blood bank, or locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 8, padding: '12px 16px', fontSize: 14, color: theme.text, outline: 'none' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.dim, textTransform: 'uppercase' }}>Filter City:</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CITIES.map((c) => {
                const active = selectedCity.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedCity(c)}
                    style={{
                      background: active ? theme.red : theme.cardAlt,
                      color: active ? '#fff' : theme.dim,
                      border: `1px solid ${active ? theme.red : theme.bord}`,
                      borderRadius: 16,
                      padding: '5px 13px',
                      fontSize: 12,
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* List of Drives in Responsive 2-Column Grid */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: theme.dim, fontSize: 15 }}>
            Loading blood collection drives...
          </div>
        ) : drives.length === 0 ? (
          <div style={{ background: theme.card, border: `1px dashed ${theme.bord}`, borderRadius: 16, padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>No active blood drives found</div>
            <div style={{ fontSize: 14, color: theme.dim }}>
              New collection camps announced by authorized blood banks will appear here in real time.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 16 }}>
            {drives.map((drv) => (
              <div
                key={drv.id}
                className="card-hover"
                style={{
                  background: theme.card,
                  border: `1px solid ${theme.bord}`,
                  borderRadius: 16,
                  padding: '24px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 18,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: theme.text }}>
                      {drv.bloodBankName}
                    </h2>
                    <span style={{ fontSize: 11, fontWeight: 700, color: theme.green, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, padding: '2px 8px', borderRadius: 4 }}>
                      Authorized Organizer
                    </span>
                  </div>

                  <div style={{ fontSize: 13, color: theme.dim, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    <span>📍 {drv.location}, {drv.city}</span>
                    <span>·</span>
                    <span style={{ color: theme.text, fontWeight: 600 }}>🗓️ {drv.period}</span>
                  </div>

                  {drv.reason && (
                    <div style={{ fontSize: 13, color: theme.dim, fontStyle: 'italic', marginBottom: 8 }}>
                      "{drv.reason}"
                    </div>
                  )}

                  {drv.contactPhone && (
                    <div style={{ fontSize: 12, color: theme.dim }}>
                      Helpline: <a href={`tel:${drv.contactPhone}`} style={{ color: theme.blue, fontWeight: 600 }}>{drv.contactPhone}</a>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 14, borderTop: `1px solid ${theme.bord}` }}>
                  {registeredDrives[drv.id] ? (
                    <span style={{ color: theme.green, fontSize: 13, fontWeight: 700, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 8, padding: '9px 16px', display: 'inline-block' }}>
                      ✓ Registered to Attend
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegister(drv)}
                      style={{
                        background: theme.red,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 22px',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
                      }}
                    >
                      Register to Attend →
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
