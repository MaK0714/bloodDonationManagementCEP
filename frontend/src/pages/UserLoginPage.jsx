import { useState } from 'react';
import { authService } from '../services/api';

export default function UserLoginPage({ onBack, onLoginSuccess, onGoToRegister, theme, toggleTheme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillDemo = () => {
    setEmail('donor@blood.org');
    setPassword('donor123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.loginUser(email.trim(), password);
      if (res && res.success) {
        onLoginSuccess(res.profile, res.token);
      } else {
        setError(res.message || 'Incorrect email or password.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Cannot connect to backend server. Make sure it is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, padding: '24px 20px 60px', transition: 'background 0.2s, color 0.2s' }}>

      {/* Top Bar */}
      <div style={{ maxWidth: 480, margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* Login Card */}
      <div style={{ maxWidth: 480, margin: '0 auto', background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 20, padding: '36px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: theme.redBg, border: `2px solid ${theme.redBorder}`, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 14 }}>
            🩸
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>Donor Login</h1>
          <p style={{ fontSize: 14, color: theme.dim, marginTop: 6 }}>Sign in to view nearby hospitals and track donations</p>
        </div>

        {error && (
          <div style={{ background: theme.redBg, border: `1px solid ${theme.redBorder}`, borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f87171', marginBottom: 20, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="donor@blood.org"
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? '#555' : theme.red, color: '#fff', border: 'none', borderRadius: 10, padding: '15px', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 6, boxShadow: '0 4px 16px rgba(225, 29, 72, 0.28)' }}
          >
            {loading ? 'Signing in...' : 'Sign In as Donor →'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: theme.dim }}>
          New donor?{' '}
          <span
            onClick={onGoToRegister}
            style={{ color: theme.red, cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
          >
            Register here
          </span>
        </div>

        {/* Demo Button */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${theme.bord}`, textAlign: 'center' }}>
          <button
            onClick={fillDemo}
            style={{ background: theme.cardAlt, border: `1px solid ${theme.bord}`, borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 600, color: theme.text, cursor: 'pointer' }}
          >
            ⚡ Auto-Fill Demo Account
          </button>
          <div style={{ fontSize: 12, color: theme.dim, marginTop: 6 }}>
            donor@blood.org · donor123
          </div>
        </div>

      </div>
    </div>
  );
}
