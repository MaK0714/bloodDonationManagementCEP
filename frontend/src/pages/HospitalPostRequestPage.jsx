import { useState } from 'react';
import { bloodRequestService } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function HospitalPostRequestPage({ user, onBack, onLogout, theme, toggleTheme }) {
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsNeeded: 2,
    urgency: 'HIGH',
    diagnosis: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');

    if (!user || !user.id) {
      setErrorMsg('Please log in as an authorized hospital to post blood requests.');
      return;
    }

    if (!form.patientName.trim()) {
      setErrorMsg('Please enter patient or ward reference.');
      return;
    }

    setSubmitting(true);
    try {
      await bloodRequestService.create({
        hospitalId: user.id,
        hospitalName: user.name || 'Hospital',
        city: user.city || 'Mumbai',
        patientName: form.patientName.trim(),
        bloodGroup: form.bloodGroup,
        unitsNeeded: parseInt(form.unitsNeeded, 10),
        urgency: form.urgency,
        diagnosis: form.diagnosis.trim(),
        note: form.diagnosis.trim() || form.patientName.trim(),
      });
      setMsg('Urgent blood request broadcasted successfully! It is now live in real time on the portal.');
      setForm({
        patientName: '',
        bloodGroup: 'O+',
        unitsNeeded: 2,
        urgency: 'HIGH',
        diagnosis: '',
      });
    } catch (err) {
      setErrorMsg('Failed to post blood request. Please try again.');
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
            style={{ background: theme.card, border: `1px solid ${theme.bord}`, color: theme.text, borderRadius: 8, padding: '8px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
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

      {/* Form Card */}
      <div style={{ maxWidth: 640, margin: '0 auto', background: theme.card, border: `1px solid ${theme.bord}`, borderRadius: 20, padding: '36px 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: theme.blueBg, border: `2px solid ${theme.blueBorder}`, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 14 }}>
            🩸
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
            Broadcast Urgent Blood Need
          </h1>
          <p style={{ fontSize: 14, color: theme.dim, marginTop: 6 }}>
            {user?.name} · {user?.city}
          </p>
        </div>

        {msg && (
          <div style={{ background: theme.blueBg, border: `1px solid ${theme.blueBorder}`, color: theme.blue, borderRadius: 10, padding: '14px 18px', fontSize: 14, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>
            ✓ {msg}
          </div>
        )}

        {errorMsg && (
          <div style={{ background: theme.redBg, border: `1px solid ${theme.redBorder}`, color: '#f87171', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 600, marginBottom: 20, textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>
              Patient Name / Ward Reference *
            </label>
            <input
              type="text"
              value={form.patientName}
              onChange={(e) => setForm({ ...form, patientName: e.target.value })}
              placeholder="e.g. ICU Ward 3 - Patient Sharma"
              required
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>
                Required Blood Group *
              </label>
              <select
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none', cursor: 'pointer' }}
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>
                Units Needed *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={form.unitsNeeded}
                onChange={(e) => setForm({ ...form, unitsNeeded: e.target.value })}
                required
                style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>
              Urgency Level *
            </label>
            <select
              value={form.urgency}
              onChange={(e) => setForm({ ...form, urgency: e.target.value })}
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none', cursor: 'pointer' }}
            >
              <option value="CRITICAL">🔴 CRITICAL (Immediate Life-Threatening Need)</option>
              <option value="HIGH">🟠 HIGH (Needed Within 12 Hours)</option>
              <option value="NORMAL">🟡 NORMAL (Scheduled Procedure)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: theme.dim, marginBottom: 6 }}>
              Clinical Diagnosis / Medical Indication
            </label>
            <input
              type="text"
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              placeholder="e.g. Emergency surgery or Thalassemia transfusion"
              style={{ width: '100%', background: theme.inputBg, border: `1px solid ${theme.inputBord}`, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: theme.text, outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ width: '100%', background: submitting ? '#555' : theme.blue, color: '#fff', border: 'none', borderRadius: 12, padding: '16px', fontSize: 16, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer', marginTop: 8, boxShadow: '0 4px 16px rgba(37, 99, 235, 0.28)' }}
          >
            {submitting ? 'Broadcasting...' : 'Publish Urgent Blood Demand →'}
          </button>

        </form>

      </div>
    </div>
  );
}
