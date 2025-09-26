import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const from = (location.state && location.state.from) || '/admin/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate(from, { replace: true });
      return;
    }
    setError('Invalid email or password');
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <h1>Admin Login</h1>
        <p className="login-sub">Please sign in to continue</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group input-wrapper">
            <label htmlFor="email">Admin Email</label>
            <input
              id="email"
              type={showEmail ? 'text' : 'email'}
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              inputMode="email"
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowEmail((v) => !v)}
              aria-label={showEmail ? 'Hide email' : 'Show email'}
            >
              {showEmail ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="form-group input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              inputMode="text"
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="login-btn">Sign In</button>
        </form>
        <small className="login-hint">Use admin@example.com / admin123 for demo</small>
      </div>
    </div>
  );
};

export default Login;


