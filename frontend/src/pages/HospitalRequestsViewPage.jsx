import { useState, useEffect } from 'react';
import { bloodRequestService } from '../services/api';

const FILTER_TABS = ['ALL', 'ACTIVE', 'FULFILLED'];

export default function HospitalRequestsViewPage({ user, onBack, onLogout, theme, toggleTheme }) {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await bloodRequestService.getAll();
      setRequests(data || []);
    } catch (err) {
      setRequests([]);
    }
  };

  const handleFulfill = async (id) => {
    try {
      await bloodRequestService.fulfill(id);
      setActionMsg('Request marked as fulfilled in real time.');
      fetchRequests();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      // ignore
    }
  };

  const handleDelete = async (id) => {
    try {
      await bloodRequestService.delete(id);
      setActionMsg('Request removed from portal in real time.');
      fetchRequests();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      // ignore
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '24px 36px 60px', transition: 'background 0.2s, color 0.2s' }}>

      {/* Top Bar */}
      <div style={{ maxWidth: 1200, margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Back
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={toggleTheme}
            style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 12px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
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

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Page Title */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
            Live Hospital Blood Requests
          </h1>
          <p style={{ fontSize: 14, color: theme.dim }}>
            Real-time blood demands broadcasted across the portal · Auto-synced with donations
          </p>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div style={{ background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, color: theme.green, borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 600, marginBottom: 18 }}>
            ✓ {actionMsg}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {FILTER_TABS.map((tab) => {
            const active = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  background: active ? theme.blue : theme.card,
                  color: active ? '#fff' : theme.dim,
                  border: `1px solid ${active ? theme.blue : theme.bord}`,
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {tab === 'ALL' ? 'All Requests' : tab === 'ACTIVE' ? 'Active Demands' : 'Fulfilled'}
              </button>
            );
          })}
        </div>

        {filteredRequests.length === 0 ? (
          <div style={{ background: theme.card, border: `1px dashed ${theme.bord}`, borderRadius: 14, padding: '40px 20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>No requests matching this filter</h3>
            <p style={{ fontSize: 14, color: theme.dim }}>All blood demands are currently satisfied or none posted.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredRequests.map((r) => {
              const isFulfilled = r.status === 'FULFILLED';
              const remaining = Math.max(0, r.unitsNeeded - (r.unitsFulfilled || 0));

              return (
                <div
                  key={r.id}
                  className="card-hover"
                  style={{
                    background: theme.card,
                    border: `1px solid ${theme.bord}`,
                    borderRadius: 14,
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 14,
                    opacity: isFulfilled ? 0.75 : 1,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 900, color: theme.red, background: theme.redBg, border: `1px solid ${theme.redBorder}`, borderRadius: 6, padding: '2px 8px' }}>
                        {r.bloodGroup}
                      </span>
                      <strong style={{ fontSize: 16, color: theme.text }}>
                        {isFulfilled ? 'Demand Fulfilled' : `${remaining} Units Needed`}
                      </strong>
                      <span style={{ fontSize: 12, color: theme.dim }}>
                        ({r.unitsFulfilled || 0}/{r.unitsNeeded} units received)
                      </span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: r.urgency === 'CRITICAL' ? theme.redBg : theme.cardAlt,
                        color: r.urgency === 'CRITICAL' ? '#f87171' : theme.dim,
                        border: `1px solid ${r.urgency === 'CRITICAL' ? theme.redBorder : theme.bord}`,
                      }}>
                        {r.urgency}
                      </span>
                      {isFulfilled && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: theme.greenBg, color: theme.green }}>
                          ✓ FULFILLED
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 13, color: theme.dim, marginTop: 6 }}>
                      {r.hospitalName} ({r.city}) {r.patientName ? `· Ref: ${r.patientName}` : ''} {r.diagnosis ? `· Clinical: ${r.diagnosis}` : ''}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {!isFulfilled && (
                      <button
                        onClick={() => handleFulfill(r.id)}
                        style={{
                          background: theme.greenBg,
                          border: `1px solid ${theme.greenBorder}`,
                          color: theme.green,
                          borderRadius: 8,
                          padding: '8px 14px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Mark Fulfilled
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(r.id)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${theme.bord}`,
                        color: theme.dim,
                        borderRadius: 8,
                        padding: '8px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
