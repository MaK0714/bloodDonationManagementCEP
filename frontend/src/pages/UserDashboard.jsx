import { useState, useEffect } from 'react';
import { hospitalService, driveService } from '../services/api';

const POPULAR_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'];

export default function UserDashboard({ user, onLogout, theme, toggleTheme }) {
  const [selectedCity, setSelectedCity] = useState(user?.city || 'Mumbai');
  const [hospitals, setHospitals] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [loadingDrives, setLoadingDrives] = useState(false);
  const [pledgedHospitals, setPledgedHospitals] = useState({});

  useEffect(() => {
    fetchHospitals(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchHospitals = async (city) => {
    setLoadingHospitals(true);
    try {
      const data = await hospitalService.getByCity(city);
      setHospitals(data || []);
    } catch (err) {
      setHospitals([]);
    } finally {
      setLoadingHospitals(false);
    }
  };

  const fetchDrives = async () => {
    setLoadingDrives(true);
    try {
      const data = await driveService.getAll();
      setDrives(data || []);
    } catch (err) {
      setDrives([]);
    } finally {
      setLoadingDrives(false);
    }
  };

  const handlePledge = (hospitalId) => {
    setPledgedHospitals((prev) => ({ ...prev, [hospitalId]: true }));
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '24px 20px', transition: 'background 0.2s, color 0.2s' }}>
      
      {/* Top Navigation */}
      <div style={{ maxWidth: 1040, margin: '0 auto 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, background: theme.red, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>
            +
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>BloodConnect</div>
            <div style={{ fontSize: 12, color: theme.dim }}>Donor Dashboard</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggleTheme}
            style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer' }}
          >
            {theme.isDark ? '☀️ Bright Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={onLogout}
            style={{ background: 'transparent', border: `1px solid ${theme.bord}`, color: theme.dim, borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Donor Profile Card */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 54, height: 54, background: theme.redBg, border: `1px solid ${theme.redBorder}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: theme.red }}>
              {user?.bloodGroup || '🩸'}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{user?.name || 'Registered Donor'}</div>
              <div style={{ fontSize: 13, color: theme.dim, marginTop: 4 }}>
                {user?.email} · Phone: {user?.phone || 'Not provided'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: theme.dim }}>Registered City</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginTop: 2 }}>{user?.city || 'Mumbai'}</div>
            </div>
            <div style={{ background: theme.redBg, border: `1px solid ${theme.redBorder}`, borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: theme.red }}>Blood Group</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: theme.red, marginTop: 2 }}>{user?.bloodGroup || 'O+'}</div>
            </div>
          </div>
        </div>

        {/* SECTION: Nearby Registered Hospitals */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🏥 Nearby Registered Hospitals</span>
              </h2>
              <p style={{ fontSize: 13, color: theme.dim, marginTop: 4 }}>
                Showing only verified hospitals registered on our portal
              </p>
            </div>

            {/* City Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ fontSize: 13, color: theme.dim, fontWeight: 500 }}>Select City:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ background: theme.inputBg, border: `1px solid ${theme.inputBord}`, color: theme.text, borderRadius: 8, padding: '7px 14px', fontSize: 13, outline: 'none', cursor: 'pointer' }}
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingHospitals ? (
            <div style={{ padding: '30px', textAlign: 'center', color: theme.dim, fontSize: 14 }}>
              Loading registered hospitals in {selectedCity}...
            </div>
          ) : hospitals.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', background: theme.cardAlt, borderRadius: 12, border: `1px dashed ${theme.bord}` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🏥</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>No registered hospitals found in {selectedCity} yet</div>
              <div style={{ fontSize: 12, color: theme.dim, marginTop: 4 }}>
                Only hospitals authenticated on our portal are shown. Try selecting <strong>Mumbai</strong> or <strong>Delhi</strong>.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {hospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{hosp.name}</div>
                      <span style={{ background: theme.blueBg, color: theme.blue, border: `1px solid ${theme.blueBorder}`, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        🛡️ Verified
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: theme.dim, marginTop: 8 }}>
                      📍 {hosp.address}, {hosp.city}
                    </div>
                    <div style={{ fontSize: 12, color: theme.dim, marginTop: 4 }}>
                      📞 {hosp.phone}
                    </div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                      License: {hosp.licenseNumber}
                    </div>
                  </div>

                  <div style={{ marginTop: 18, borderTop: `1px solid ${theme.bord}`, paddingTop: 14 }}>
                    {pledgedHospitals[hosp.id] ? (
                      <div style={{ background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, color: theme.green, padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, textAlign: 'center' }}>
                        ✓ Donation Pledge Registered!
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePledge(hosp.id)}
                        style={{ width: '100%', background: theme.red, color: '#fff', border: 'none', borderRadius: 8, padding: '9px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Donate Here →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION: Active Blood Collection Drives by Blood Banks */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '28px' }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🏛️ Active Blood Collection Drives</span>
            </h2>
            <p style={{ fontSize: 13, color: theme.dim, marginTop: 4 }}>
              Community collection camps organized by authorized blood banks — where and why they need your support
            </p>
          </div>

          {loadingDrives ? (
            <div style={{ padding: '30px', textAlign: 'center', color: theme.dim, fontSize: 14 }}>
              Loading collection drives...
            </div>
          ) : drives.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', background: theme.cardAlt, borderRadius: 12, border: `1px dashed ${theme.bord}` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🏛️</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>No active collection drives right now</div>
              <div style={{ fontSize: 12, color: theme.dim, marginTop: 4 }}>Check back soon as blood banks announce new community drives.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 16 }}>
              {drives.map((drv) => (
                <div
                  key={drv.id}
                  style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{drv.bloodBankName}</div>
                    <span style={{ background: theme.greenBg, color: theme.green, border: `1px solid ${theme.greenBorder}`, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>
                      Active Drive
                    </span>
                  </div>

                  <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: theme.dim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Why We Need Blood</div>
                    <div style={{ fontSize: 13, color: theme.text, marginTop: 4, fontWeight: 500 }}>
                      {drv.reason}
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: theme.dim, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div>📍 <strong>Location:</strong> {drv.location}, {drv.city}</div>
                    <div>🕒 <strong>Dates & Timing:</strong> {drv.period}</div>
                    <div>📞 <strong>Contact:</strong> {drv.contactPhone}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

