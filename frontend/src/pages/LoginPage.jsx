import { useState } from 'react';
import { authService } from '../services/api';

export default function LoginPage({
  initialRole = 'USER',
  currentUser,
  onLoginSuccess,
  onLogout,
  onBackToHome,
}) {
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleFillDemo = () => {
    setError('');
    if (role === 'USER') {
      setEmail('donor@blood.org');
      setPassword('donor123');
    } else {
      setEmail('hospital@care.org');
      setPassword('hosp123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response =
        role === 'HOSPITAL'
          ? await authService.loginHospital(email.trim(), password)
          : await authService.loginUser(email.trim(), password);

      if (response && response.success) {
        onLoginSuccess(response.profile, response.token);
      } else {
        setError(response.message || 'Incorrect email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Cannot connect to backend server. Make sure port 8080 is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-sm w-full">
        {/* Back Link */}
        <button
          onClick={onBackToHome}
          className="text-xs text-neutral-400 hover:text-white mb-6 flex items-center gap-1 transition"
        >
          &larr; Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-lg mx-auto mb-3">
              +
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Sign In</h1>
            <p className="text-xs text-neutral-400 mt-1">Select your account type to continue</p>
          </div>

          {/* Simple 2-button role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-black rounded-xl border border-neutral-800 mb-5">
            <button
              type="button"
              onClick={() => handleRoleChange('USER')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                role === 'USER'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🩸 Donor
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('HOSPITAL')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                role === 'HOSPITAL'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🏥 Hospital
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                {role === 'HOSPITAL' ? 'Hospital Email' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'HOSPITAL' ? 'hospital@care.org' : 'donor@blood.org'}
                required
                className="w-full bg-black border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-black border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-red-950 disabled:bg-neutral-800"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Auto Fill Demo Helper */}
          <div className="mt-5 pt-4 border-t border-neutral-800 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-neutral-400 hover:text-white bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 px-3.5 py-1.5 rounded-lg transition"
            >
              ⚡ Auto-Fill Demo Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
