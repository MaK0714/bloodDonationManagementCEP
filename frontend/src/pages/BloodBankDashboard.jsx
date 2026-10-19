import { useState, useEffect } from 'react';
import { driveService } from '../services/api';

export default function BloodBankDashboard({ user, onLogout, theme, toggleTheme }) {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    city: user?.city || 'Mumbai',
    location: '',
    reason: '',
    period: '',
    contactPhone: user?.phone || '',
  });

  useEffect(() => {
    fetchDrives();
  }, [user]);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const data = await driveService.getByBloodBank(user.id);
        setDrives(data || []);
      } else {
        const all = await driveService.getAll();
        setDrives(all || []);
      }
    } catch (err) {
      setDrives([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.location.trim() || !formData.reason.trim() || !formData.period.trim()) {
      setErrorMsg('Please specify location, reason, and period for the drive.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        bloodBankId: user?.id,
        bloodBankName: user?.name,
        city: formData.city.trim(),
        location: formData.location.trim(),
        reason: formData.reason.trim(),
        period: formData.period.trim(),
        contactPhone: formData.contactPhone.trim() || user?.phone || '',
      };

      const created = await driveService.create(payload);
      if (created) {
        setSuccessMsg('Blood collection drive posted successfully! Donors can now view it.');
        setFormData({
          city: user?.city || 'Mumbai',
          location: '',
          reason: '',
          period: '',
          contactPhone: user?.phone || '',
        });
        fetchDrives();
      }
    } catch (err) {
      setErrorMsg('Failed to post blood drive. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '24px 20px', transition: 'background 0.2s, color 0.2s' }}>

      {/* Top Nav */}
      <div style={{ maxWidth: 1040, margin: '0 auto 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, background: theme.green, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>
            🏛️
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name || 'Blood Bank Portal'}</div>
            <div style={{ fontSize: 12, color: theme.dim }}>Blood Collection Drive Management</div>
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

        {/* Left Column: Form to Post New Drive */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              📢
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>Announce Collection Drive</h2>
              <div style={{ fontSize: 12, color: theme.dim }}>Tell donors where & why you are collecting blood</div>
            </div>
          </div>

          {successMsg && (
            <div style={{ background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, color: theme.green, borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div style={{ background: theme.redBg, border: `1px solid ${theme.redBorder}`, color: '#f87171', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: theme.dim, marginBottom: 6, fontWeight: 500 }}>Drive Location / Venue</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. City Mall Atrium / Community Hall"
                required
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: theme.text, outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: theme.dim, marginBottom: 6, fontWeight: 500 }}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                required
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: theme.text, outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: theme.dim, marginBottom: 6, fontWeight: 500 }}>Why (Reason for Drive)</label>
              <textarea
                name="reason"
                rows={3}
                value={formData.reason}
                onChange={handleChange}
                placeholder="e.g. Replenishing critical O- and B+ stock for upcoming holiday emergencies..."
                required
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: theme.text, outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: theme.dim, marginBottom: 6, fontWeight: 500 }}>Period & Timing</label>
              <input
                type="text"
                name="period"
                value={formData.period}
                onChange={handleChange}
                placeholder="e.g. Oct 20–22, 9:00 AM – 5:00 PM"
                required
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: theme.text, outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: theme.dim, marginBottom: 6, fontWeight: 500 }}>Helpline / Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+91 22 6677 8899"
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: theme.text, outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{ width: '100%', background: submitting ? '#555' : theme.green, border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'Broadcasting Drive...' : 'Publish Collection Drive →'}
            </button>
          </form>
        </div>

        {/* Right Column: List of Existing Drives */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>Your Active Drives</h2>
              <div style={{ fontSize: 12, color: theme.dim }}>Visible to registered donors in real-time</div>
            </div>
            <button
              onClick={fetchDrives}
              style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, color: theme.dim, borderRadius: 8, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: theme.dim, fontSize: 13 }}>Loading drives...</div>
          ) : drives.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', background: theme.cardAlt, borderRadius: 12, border: `1px dashed ${theme.bord}` }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>📝</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>No collection drives created yet</div>
              <div style={{ fontSize: 12, color: theme.dim, marginTop: 4 }}>Fill the form on the left to announce your first blood drive.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {drives.map((d) => (
                <div
                  key={d.id}
                  style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 12, padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>📍 {d.location}</div>
                    <span style={{ background: theme.greenBg, color: theme.green, border: `1px solid ${theme.greenBorder}`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                      {d.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, color: theme.dim, marginBottom: 8 }}>
                    <strong>Why:</strong> {d.reason}
                  </div>

                  <div style={{ fontSize: 12, color: theme.dim, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <span>🕒 {d.period}</span>
                    <span>📞 {d.contactPhone}</span>
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

