import React, { useState } from 'react';
import axios from 'axios';
import '../css/signupForm.css'; // New CSS file

const SignupForm = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password
      });

      alert('🎉 Signup successful! Please log in.');
      setName('');
      setEmail('');
      setPassword('');
      if (typeof onSwitchToLogin === 'function') {
        onSwitchToLogin();
      }
    } catch (err) {
      alert(err.response?.data?.msg || '❌ Signup failed');
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create Your Account 🚀</h2>
          <p>Join thousands of productive users today!</p>
        </div>
        
        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="password-strength">
              <div className="strength-bar"></div>
              <div className="strength-text">Password strength: Medium</div>
            </div>
          </div>

          <div className="benefits">
            <h3>Why join us?</h3>
            <ul>
              <li>✨ Unlimited tasks and projects</li>
              <li>📱 Sync across all your devices</li>
              <li>🔒 Bank-level security</li>
              <li>🎁 Free forever for personal use</li>
            </ul>
          </div>

          <button type="submit" className="signup-btn">
            Create My Account 🚀
          </button>
        </form>

        <div className="login-prompt">
          Already have an account? 
          <button onClick={onSwitchToLogin} className="login-link">
            Login here 🔑
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;