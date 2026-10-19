import { useState, useEffect } from 'react';
import { bloodRequestService } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function HospitalDashboard({ user, onLogout, theme, toggleTheme }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsNeeded: 2,
    urgency: 'HIGH',
    diagnosis: '',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await bloodRequestService.getAll();
      setRequests(data || []);
    } catch (err) {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setSubmitting(true);
    try {
      await bloodRequestService.create({
        hospitalId: user?.id,
        hospitalName: user?.name,
        city: user?.city || 'Mumbai',
        patientName: form.patientName,
        bloodGroup: form.bloodGroup,
        unitsNeeded: parseInt(form.unitsNeeded, 10),
        urgency: form.urgency,
        diagnosis: form.diagnosis,
      });
      setMsg('Urgent blood request posted successfully!');
      setForm({
        patientName: '',
        bloodGroup: 'O+',
        unitsNeeded: 2,
        urgency: 'HIGH',
        diagnosis: '',
      });
      fetchRequests();
    } catch (err) {
      setMsg('Error posting request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '24px 20px', transition: 'background 0.2s, color 0.2s' }}>

      {/* Top Nav */}
      <div style={{ maxWidth: 1040, margin: '0 auto 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, background: theme.blue, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>
            🏥
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name || 'Hospital Portal'}</div>
            <div style={{ fontSize: 12, color: theme.dim }}>Verified Partner Hospital · {user?.city}</div>
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

      <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>

        {/* Create Request */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: theme.blueBg, border: `1px solid ${theme.blueBorder}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              🩸
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>Post Urgent Blood Request</h2>
              <div style={{ fontSize: 12, color: theme.dim }}>Alert matched donors in {user?.city || 'your city'}</div>
            </div>
          </div>

          {msg && (
            <div style={{ background: theme.blueBg, border: `1px solid ${theme.blueBorder}`, color: theme.blue, borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: theme.dim, marginBottom: 6 }}>Patient Reference / Name</label>
              <input
                type="text"
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                placeholder="e.g. Ward 4 / Emergency ICU"
                required
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: theme.text, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: theme.dim, marginBottom: 6 }}>Blood Group</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, color: theme.text, outline: 'none' }}
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: theme.dim, marginBottom: 6 }}>Units Needed</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={form.unitsNeeded}
                  onChange={(e) => setForm({ ...form, unitsNeeded: e.target.value })}
                  required
                  style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, color: theme.text, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: theme.dim, marginBottom: 6 }}>Urgency Level</label>
              <select
                value={form.urgency}
                onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '10px 12px', fontSize: 14, color: theme.text, outline: 'none' }}
              >
                <option value="CRITICAL">🔴 CRITICAL (Immediate)</option>
                <option value="HIGH">🟠 HIGH (Within 12 hrs)</option>
                <option value="MEDIUM">🟡 MEDIUM (Within 24 hrs)</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: theme.dim, marginBottom: 6 }}>Diagnosis / Clinical Reason</label>
              <input
                type="text"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="e.g. Major surgery / Thalassemia transfusion"
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: theme.text, outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{ width: '100%', background: submitting ? '#555' : theme.blue, border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'Broadcasting...' : 'Broadcast Urgent Request →'}
            </button>
          </form>
        </div>

        {/* Existing Requests */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>Live Blood Requests</h2>
              <div style={{ fontSize: 12, color: theme.dim }}>Active requests in the network</div>
            </div>
            <button
              onClick={fetchRequests}
              style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, color: theme.dim, borderRadius: 8, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: theme.dim, fontSize: 13 }}>Loading requests...</div>
          ) : requests.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: theme.dim, fontSize: 13 }}>No active requests</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {requests.map((r) => (
                <div
                  key={r.id}
                  style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 12, padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: theme.redBg, color: theme.red, border: `1px solid ${theme.redBorder}`, padding: '2px 8px', borderRadius: 6, fontWeight: 800, fontSize: 12 }}>
                        {r.bloodGroup}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{r.unitsNeeded} units needed</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: r.urgency === 'CRITICAL' ? '#ef4444' : '#f59e0b' }}>
                      {r.urgency}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: theme.dim }}>
                    🏥 {r.hospitalName} ({r.city}) · Patient: {r.patientName}
                  </div>
                  <div style={{ fontSize: 11, color: '#777', marginTop: 4 }}>
                    Diagnosis: {r.diagnosis || 'Standard blood transfusion'}
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

