import { useState } from 'react';
import { hospitalService } from '../services/api';

const CITIES = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];

export default function HospitalRegisterPage({ onBack, onGoToLogin, onRegisterSuccess, theme, toggleTheme }) {
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    city: 'Mumbai',
    address: '',
    phone: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.licenseNumber.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await hospitalService.register({
        name: formData.name.trim(),
        licenseNumber: formData.licenseNumber.trim(),
        city: formData.city,
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      if (res && res.success) {
        setSuccess('Hospital registered and authenticated on portal successfully!');
        if (onRegisterSuccess) {
          setTimeout(() => {
            onRegisterSuccess(res.hospital);
          }, 1200);
        }
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Cannot reach backend server. Please verify it is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '24px 20px 60px', transition: 'background 0.2s, color 0.2s' }}>

      {/* Top Bar */}
      <div style={{ maxWidth: 540, margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Back
        </button>

        <button
          onClick={toggleTheme}
          style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 12px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
        >
          {theme.isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Card */}
      <div style={{ maxWidth: 540, margin: '0 auto', background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 20, padding: '36px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, background: theme.blueBg, border: `2px solid ${theme.blueBorder}`, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 14 }}>
            🏥
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>Register Hospital</h1>
          <p style={{ fontSize: 14, color: theme.dim, marginTop: 6 }}>
            Accredit your institution for live donor pledges
          </p>
        </div>

        {error && (
          <div style={{ background: theme.redBg, border: `1px solid ${theme.redBorder}`, borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f87171', marginBottom: 20, textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 10, padding: '12px 16px', fontSize: 14, color: theme.green, marginBottom: 20, textAlign: 'center' }}>
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Hospital Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Apollo Super Speciality Hospital"
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Medical License No. *</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="LIC-MH-2024-XXXX"
                required
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>City *</label>
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
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 124 Medical Campus Road"
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Official Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hospital@care.org"
                required
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Phone Helpline</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 22 2456 7890"
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Portal Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create portal access password"
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? '#555' : theme.blue, color: '#fff', border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, boxShadow: '0 4px 16px rgba(37, 99, 235, 0.28)' }}
          >
            {loading ? 'Authenticating...' : 'Register Hospital on Portal →'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: theme.dim }}>
          Already registered?{' '}
          <span
            onClick={onGoToLogin}
            style={{ color: theme.blue, cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
          >
            Sign in
          </span>
        </div>

      </div>
    </div>
  );
}
