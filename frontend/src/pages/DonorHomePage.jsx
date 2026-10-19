import { useState, useEffect } from 'react';
import { donationService } from '../services/api';

export default function DonorHomePage({ user, onFindHospitals, onViewDrives, onLogout, onGoHome, theme, toggleTheme }) {
  const [summary, setSummary] = useState({
    totalDonations: 0,
    totalUnits: 0,
    livesImpacted: 0,
    isEligible: true,
    daysUntilEligible: 0,
    nextEligibleDate: null,
    lastDonationDate: null,
    history: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDonorSummary();
    }
  }, [user]);

  const fetchDonorSummary = async () => {
    try {
      const data = await donationService.getDonorSummary(user.id);
      if (data) {
        setSummary(data);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '24px 36px 60px', transition: 'background 0.2s, color 0.2s' }}>

      {/* Top Bar */}
      <div style={{ maxWidth: 1200, margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          onClick={onGoHome}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: onGoHome ? 'pointer' : 'default' }}
          title={onGoHome ? 'Return to Public Landing Page' : undefined}
        >
          <div style={{ width: 34, height: 34, background: theme.red, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>
            🩸
          </div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.3px' }}>BloodConnect</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {onGoHome && (
            <button
              onClick={onGoHome}
              style={{ background: 'transparent', border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              ← Public Portal
            </button>
          )}
          <button
            onClick={toggleTheme}
            style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            {theme.isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            onClick={onLogout}
            style={{ background: 'transparent', border: `1px solid ${theme.bord}`, color: theme.dim, borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Personalized Donor Profile Header */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 20, padding: '32px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 68, height: 68, background: theme.redBg, border: `2px solid ${theme.redBorder}`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: theme.red }}>
              {user?.bloodGroup || '🩸'}
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
                {user?.name || 'Registered Donor'}
              </h1>
              <div style={{ fontSize: 13, color: theme.dim, marginTop: 4 }}>
                {user?.email} · Location: <strong>{user?.city || 'Mumbai'}</strong>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: theme.red, background: theme.redBg, border: `1px solid ${theme.redBorder}`, padding: '2px 8px', borderRadius: 6 }}>
                  Blood Group: {user?.bloodGroup || 'O+'}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: theme.dim, background: theme.cardAlt, border: `1px solid ${theme.bord}`, padding: '2px 8px', borderRadius: 6 }}>
                  Verified Donor
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Eligibility Status */}
          <div style={{ textAlign: 'right', minWidth: 200 }}>
            {summary.isEligible ? (
              <div style={{ background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, color: theme.green, padding: '10px 16px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>✓ Eligible to Donate</div>
                <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>Ready for whole blood donation</div>
              </div>
            ) : (
              <div style={{ background: '#2c1e08', border: '1px solid #78350f', color: '#fbbf24', padding: '10px 16px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>⏳ 90-Day Cooldown</div>
                <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>
                  Next: {summary.nextEligibleDate || 'In recovery'} ({summary.daysUntilEligible} days)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Impact Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 16, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: theme.red }}>{summary.totalDonations}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.dim, marginTop: 2 }}>Donations Recorded</div>
          </div>

          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 16, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: theme.blue }}>{summary.totalUnits} Units</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.dim, marginTop: 2 }}>Total Blood Given</div>
          </div>

          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 16, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: theme.green }}>{summary.livesImpacted} Lives</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.dim, marginTop: 2 }}>Estimated Impact</div>
          </div>
        </div>

        {/* Action Options */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          <button
            onClick={onFindHospitals}
            style={{
              background: theme.red,
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              padding: '22px 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(225, 29, 72, 0.25)',
              textAlign: 'left',
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>🏥 Find Nearby Hospitals</div>
              <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.9, marginTop: 4 }}>
                Fulfill active demands in {user?.city || 'your city'}
              </div>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800 }}>→</span>
          </button>

          <button
            onClick={onViewDrives}
            style={{
              background: theme.card,
              color: theme.text,
              border: `1px solid ${theme.bord}`,
              borderRadius: 16,
              padding: '22px 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>🏛️ View Collection Drives</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: theme.dim, marginTop: 4 }}>
                Community camps hosted by blood banks
              </div>
            </div>
            <span style={{ fontSize: 22, color: theme.dim }}>→</span>
          </button>
        </div>

        {/* Donation History Card */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
              Donation History & Certificates
            </h2>
            <span style={{ fontSize: 12, color: theme.dim }}>
              Live verified ledger
            </span>
          </div>

          {summary.history && summary.history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {summary.history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: theme.cardAlt,
                    border: `1px solid ${theme.bord}`,
                    borderRadius: 12,
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>
                      {item.hospitalName}
                    </div>
                    <div style={{ fontSize: 12, color: theme.dim, marginTop: 3 }}>
                      {item.city} · Group: <strong>{item.bloodGroup}</strong> · {item.units} unit{item.units > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: theme.green, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, padding: '3px 8px', borderRadius: 6 }}>
                      ✓ {item.status || 'CONFIRMED'}
                    </span>
                    <div style={{ fontSize: 11, color: theme.dim, marginTop: 4 }}>
                      Record #{item.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: theme.dim, fontSize: 13, background: theme.cardAlt, borderRadius: 12, border: `1px dashed ${theme.bord}` }}>
              No donations recorded yet on this account. Click <strong>"Find Nearby Hospitals"</strong> above to make your first donation pledge!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
