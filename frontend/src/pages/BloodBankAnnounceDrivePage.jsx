import { useState } from 'react';
import { driveService } from '../services/api';

const CITIES = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];

export default function BloodBankAnnounceDrivePage({ user, onBack, onLogout, onViewDrives, theme, toggleTheme }) {
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

    if (!user || !user.id) {
      setErrorMsg('Please log in as an authorized blood bank to announce collection drives.');
      return;
    }

    if (!formData.location.trim() || !formData.reason.trim() || !formData.period.trim()) {
      setErrorMsg('Please specify venue, reason, and period for the collection drive.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        bloodBankId: user.id,
        bloodBankName: user.name || 'Blood Bank',
        city: formData.city.trim(),
        location: formData.location.trim(),
        reason: formData.reason.trim(),
        period: formData.period.trim(),
        contactPhone: formData.contactPhone.trim() || user.phone || '',
      };

      const res = await driveService.create(payload);
      if (res) {
        setSuccessMsg('Blood collection drive broadcasted successfully! It is now live in real time for donors.');
        setFormData({
          city: user?.city || 'Mumbai',
          location: '',
          reason: '',
          period: '',
          contactPhone: user?.phone || '',
        });
      }
    } catch (err) {
      setErrorMsg('Failed to announce drive. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '24px 20px 60px', transition: 'background 0.2s, color 0.2s' }}>

      {/* Top Bar */}
      <div style={{ maxWidth: 640, margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* Main Form Card */}
      <div style={{ maxWidth: 640, margin: '0 auto', background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 18, padding: '36px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Announce Blood Collection Drive
          </h1>
          <p style={{ fontSize: 14, color: theme.dim, marginTop: 4 }}>
            {user?.name} · Broadcast a live community donation camp
          </p>
        </div>

        {successMsg && (
          <div style={{ background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, color: theme.green, borderRadius: 10, padding: '14px 18px', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
            ✓ {successMsg}
            <div style={{ marginTop: 10 }}>
              <button
                onClick={onViewDrives}
                style={{ background: theme.green, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                View Live Collection Drives →
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div style={{ background: theme.redBg, border: `1px solid ${theme.redBorder}`, color: '#f87171', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>
              Drive Venue / Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bandra Kurla Complex Ground No. 2"
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>
                City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none', cursor: 'pointer' }}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>
                Helpline Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+91 22 6677 8899"
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>
              Purpose & Clinical Reason *
            </label>
            <textarea
              name="reason"
              rows={3}
              value={formData.reason}
              onChange={handleChange}
              placeholder="e.g. Emergency reserve collection for regional trauma centers..."
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>
              Period & Timings *
            </label>
            <input
              type="text"
              name="period"
              value={formData.period}
              onChange={handleChange}
              placeholder="e.g. Nov 15–18 · 9AM–5PM"
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ width: '100%', background: submitting ? '#555' : theme.green, color: '#fff', border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', marginTop: 6 }}
          >
            {submitting ? 'Broadcasting...' : 'Publish Collection Drive to Donors →'}
          </button>

        </form>

      </div>
    </div>
  );
}
