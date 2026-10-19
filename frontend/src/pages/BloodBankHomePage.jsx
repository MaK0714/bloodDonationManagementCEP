import { useState, useEffect } from 'react';
import { driveService } from '../services/api';

export default function BloodBankHomePage({ user, onAnnounceDrive, onViewDrives, onLogout, onGoHome, theme, toggleTheme }) {
  const [myDrives, setMyDrives] = useState([]);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchDrives();
    const interval = setInterval(fetchDrives, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchDrives = async () => {
    try {
      const data = await driveService.getAll();
      const list = (data || []).filter((d) =>
        user?.id === d.bloodBankId || user?.name === d.bloodBankName
      );
      setMyDrives(list);
      const attendees = list.reduce((sum, d) => sum + (d.registeredDonors ? d.registeredDonors.length : 0), 0);
      setTotalAttendees(attendees);
    } catch (err) {
      // ignore
    }
  };

  const handleCompleteDrive = async (id) => {
    try {
      await driveService.complete(id);
      setActionMsg('Drive status marked as completed.');
      fetchDrives();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (e) {
      // ignore
    }
  };

  const handleDeleteDrive = async (id) => {
    try {
      await driveService.delete(id);
      setActionMsg('Collection drive cancelled and removed from portal.');
      fetchDrives();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (e) {
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
          <div style={{ width: 34, height: 34, background: theme.green, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>
            🏛️
          </div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.3px' }}>BloodConnect Blood Bank Operations</span>
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

        {/* Action Message Toast */}
        {actionMsg && (
          <div style={{ background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, color: theme.green, padding: '12px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}>
            ✓ {actionMsg}
          </div>
        )}

        {/* Profile Card */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 20, padding: '30px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, background: theme.greenBg, border: `2px solid ${theme.greenBorder}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              🏛️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.4px', margin: 0 }}>
                  {user?.name || 'Blood Bank Portal'}
                </h1>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.green, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, padding: '2px 8px', borderRadius: 4 }}>
                  ✓ Authorized Blood Bank
                </span>
              </div>
              <div style={{ fontSize: 13, color: theme.dim, marginTop: 4 }}>
                {user?.address ? `${user.address}, ` : ''}{user?.city || 'Mumbai'} · {user?.email}
              </div>
            </div>
          </div>

          <div style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 12, padding: '8px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.dim, textTransform: 'uppercase' }}>Portal Status</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.green, marginTop: 2 }}>● Authenticated</div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: theme.green }}>{myDrives.length}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.dim, marginTop: 2 }}>Collection Drives Hosted</div>
          </div>

          <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: theme.blue }}>{totalAttendees}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.dim, marginTop: 2 }}>Total Registered Donors</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          <button
            onClick={onAnnounceDrive}
            style={{
              background: theme.green,
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
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.28)',
              textAlign: 'left',
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>📢 Announce Blood Collection Drive</div>
              <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.95, marginTop: 4 }}>
                Specify venue, schedule & purpose for public donors
              </div>
            </div>
            <span style={{ fontSize: 22 }}>→</span>
          </button>

          <button
            onClick={onViewDrives}
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
              <div style={{ fontSize: 17, fontWeight: 800 }}>🌐 View Public Drives Schedule</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: theme.dim, marginTop: 4 }}>
                See how community donors view your drives
              </div>
            </div>
            <span style={{ fontSize: 22, color: theme.dim }}>→</span>
          </button>
        </div>

        {/* Hosted Drives Management Ledger */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
              Collection Drives Broadcasted by Your Blood Bank
            </h2>
            <span style={{ fontSize: 12, color: theme.dim }}>
              Live portal status
            </span>
          </div>

          {myDrives.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myDrives.map((d) => (
                <div
                  key={d.id}
                  style={{
                    background: theme.cardAlt,
                    border: `1px solid ${theme.bord}`,
                    borderRadius: 14,
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 14,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: theme.text }}>
                        📍 {d.location}
                      </span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: d.status === 'COMPLETED' ? theme.dim : theme.green,
                        background: d.status === 'COMPLETED' ? theme.card : theme.greenBg,
                        border: `1px solid ${d.status === 'COMPLETED' ? theme.bord : theme.greenBorder}`,
                        padding: '1px 6px',
                        borderRadius: 4
                      }}>
                        {d.status || 'ACTIVE'}
                      </span>
                    </div>

                    <div style={{ fontSize: 13, color: theme.dim, marginTop: 4 }}>
                      🗓️ {d.period} · {d.city}
                    </div>

                    {d.reason && (
                      <div style={{ fontSize: 12, color: theme.dim, marginTop: 4, fontStyle: 'italic' }}>
                        "{d.reason}"
                      </div>
                    )}

                    <div style={{ fontSize: 12, color: theme.green, fontWeight: 600, marginTop: 6 }}>
                      👥 {d.registeredDonors ? d.registeredDonors.length : 0} donor(s) registered
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {d.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleCompleteDrive(d.id)}
                        style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        ✓ Mark Completed
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteDrive(d.id)}
                      style={{ background: 'transparent', border: `1px solid ${theme.redBorder}`, color: '#f87171', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancel Drive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: theme.dim, fontSize: 13, background: theme.cardAlt, borderRadius: 12, border: `1px dashed ${theme.bord}` }}>
              No collection drives currently scheduled. Click <strong>"Announce Blood Collection Drive"</strong> to broadcast a camp!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
