import { useState, useEffect } from 'react';
import { bloodRequestService, donationService } from '../services/api';

export default function HospitalHomePage({ user, onPostRequest, onViewRequests, onLogout, onGoHome, theme, toggleTheme }) {
  const [activeCount, setActiveCount] = useState(0);
  const [fulfilledCount, setFulfilledCount] = useState(0);
  const [donationsSummary, setDonationsSummary] = useState({
    totalDonationsReceived: 0,
    totalUnitsReceived: 0,
    recentDonations: [],
  });

  useEffect(() => {
    fetchHospitalData();
    const interval = setInterval(fetchHospitalData, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchHospitalData = async () => {
    try {
      const data = await bloodRequestService.getAll();
      const myRequests = (data || []).filter((r) =>
        user?.id === r.hospitalId || user?.name === r.hospitalName
      );
      setActiveCount(myRequests.filter((r) => r.status === 'ACTIVE').length);
      setFulfilledCount(myRequests.filter((r) => r.status === 'FULFILLED').length);

      if (user?.id) {
        const donSummary = await donationService.getHospitalSummary(user.id);
        if (donSummary) {
          setDonationsSummary(donSummary);
        }
      }
    } catch (err) {
      // ignore
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
          <div style={{ width: 34, height: 34, background: theme.blue, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>
            🏥
          </div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.3px' }}>BloodConnect Hospital Operations</span>
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

        {/* Hospital Institution Header Card */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 20, padding: '30px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, background: theme.blueBg, border: `2px solid ${theme.blueBorder}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              🏥
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.4px', margin: 0 }}>
                  {user?.name || 'Accredited Hospital'}
                </h1>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.blue, background: theme.blueBg, border: `1px solid ${theme.blueBorder}`, padding: '2px 8px', borderRadius: 4 }}>
                  ✓ Medical License Verified
                </span>
              </div>
              <div style={{ fontSize: 13, color: theme.dim, marginTop: 4 }}>
                {user?.address ? `${user.address}, ` : ''}{user?.city || 'Mumbai'} · {user?.email}
              </div>
              {user?.licenseNumber && (
                <div style={{ fontSize: 11, color: theme.dim, marginTop: 4 }}>
                  Registration: <strong>{user.licenseNumber}</strong>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 12, padding: '8px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.dim, textTransform: 'uppercase' }}>Portal Status</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.green, marginTop: 2 }}>● Authenticated</div>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: activeCount > 0 ? theme.red : theme.green }}>{activeCount}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.dim, marginTop: 2 }}>Active Blood Needs</div>
          </div>

          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: theme.green }}>{fulfilledCount}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.dim, marginTop: 2 }}>Fulfilled Demands</div>
          </div>

          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: theme.blue }}>{donationsSummary.totalUnitsReceived} Units</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.dim, marginTop: 2 }}>Donations Received</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          <button
            onClick={onPostRequest}
            style={{
              background: theme.blue,
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              padding: '22px 24px',
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.28)',
              textAlign: 'left',
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>🩸 Broadcast Urgent Blood Request</div>
              <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.95, marginTop: 4 }}>
                Specify blood group, units & urgency for matched donors
              </div>
            </div>
            <span style={{ fontSize: 22 }}>→</span>
          </button>

          <button
            onClick={onViewRequests}
            style={{
              background: theme.card,
              color: theme.text,
              border: `1px solid ${theme.bord}`,
              borderRadius: 16,
              padding: '22px 24px',
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>📋 Manage Live Blood Requests</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: theme.dim, marginTop: 4 }}>
                {activeCount} active requests pending · Fulfill or remove
              </div>
            </div>
            <span style={{ fontSize: 22, color: theme.dim }}>→</span>
          </button>
        </div>

        {/* Live Received Donations Ledger */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
              Recent Donations Pledged to Your Hospital
            </h2>
            <span style={{ fontSize: 12, color: theme.dim }}>
              Live intake ledger
            </span>
          </div>

          {donationsSummary.recentDonations && donationsSummary.recentDonations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {donationsSummary.recentDonations.map((d) => (
                <div
                  key={d.id}
                  style={{
                    background: theme.cardAlt,
                    border: `1px solid ${theme.bord}`,
                    borderRadius: 12,
                    padding: '12px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>
                      {d.donorName}
                    </div>
                    <div style={{ fontSize: 12, color: theme.dim, marginTop: 2 }}>
                      Group: <strong style={{ color: theme.red }}>{d.bloodGroup}</strong> · {d.units} unit{d.units > 1 ? 's' : ''} {d.donorEmail ? `· ${d.donorEmail}` : ''}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: theme.green, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, padding: '3px 8px', borderRadius: 6 }}>
                      ✓ {d.status || 'CONFIRMED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: theme.dim, fontSize: 13, background: theme.cardAlt, borderRadius: 12, border: `1px dashed ${theme.bord}` }}>
              No donor pledges received yet. Post urgent blood requirements to alert nearby donors!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
