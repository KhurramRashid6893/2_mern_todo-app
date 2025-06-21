import React, { useState } from 'react';
import '../css/loginForm.css';
import apiClient from '../api';  // ✅ Import centralized API client

const LoginForm = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // ✅ Use apiClient to avoid hardcoding URL
      const res = await apiClient.post('/api/auth/login', {
        email,
        password
      });

      // ✅ Pass name, token, and user ID to parent
      onLogin(res.data.user.name, res.data.token, res.data.user.id);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back! 👋</h2>
          <p>Sign in to continue your productivity journey</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button type="button" className="forgot-password">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              'Login to Your Account 🔑'
            )}
          </button>
        </form>

        <div className="signup-prompt">
          Don't have an account?
          <button onClick={onSwitchToSignup} className="signup-link">
            Create account 🚀
          </button>
        </div>
      </div>

      <div className="login-benefits">
        <h3>Your Productivity Awaits</h3>
        <ul>
          <li><span>✅</span> Access all your tasks across devices</li>
          <li><span>📊</span> Visualize your progress with analytics</li>
          <li><span>🔔</span> Get reminders for important deadlines</li>
          <li><span>🎯</span> Achieve your goals faster with smart prioritization</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginForm;
