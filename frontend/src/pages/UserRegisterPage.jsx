import { useState } from 'react';
import { authService } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CITIES = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];

export default function UserRegisterPage({ onBack, onGoToLogin, onRegisterSuccess, theme, toggleTheme }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bloodGroup: 'O+',
    phone: '',
    city: 'Mumbai',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in name, email, and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        bloodGroup: formData.bloodGroup,
        phone: formData.phone.trim(),
        city: formData.city.trim(),
      });

      if (res && res.success) {
        onRegisterSuccess(res.profile, res.token);
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Cannot connect to server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '24px 20px 60px', transition: 'background 0.2s, color 0.2s' }}>

      {/* Top Bar */}
      <div style={{ maxWidth: 500, margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      <div style={{ maxWidth: 500, margin: '0 auto', background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 20, padding: '36px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ width: 56, height: 56, background: theme.redBg, border: `2px solid ${theme.redBorder}`, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 14 }}>
            🩸
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>Donor Registration</h1>
          <p style={{ fontSize: 14, color: theme.dim, marginTop: 6 }}>Register once to donate at nearby hospitals</p>
        </div>

        {error && (
          <div style={{ background: theme.redBg, border: `1px solid ${theme.redBorder}`, borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f87171', marginBottom: 20, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rahul@example.com"
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create your password"
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Blood Group *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none', cursor: 'pointer' }}
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
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
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? '#555' : theme.red, color: '#fff', border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, boxShadow: '0 4px 16px rgba(225, 29, 72, 0.28)' }}
          >
            {loading ? 'Registering...' : 'Complete Registration →'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: theme.dim }}>
          Already have an account?{' '}
          <span
            onClick={onGoToLogin}
            style={{ color: theme.red, cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
          >
            Sign in
          </span>
        </div>

      </div>
    </div>
  );
}
