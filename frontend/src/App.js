import React, { useState, useEffect } from 'react';
//import apiClient from './api'; // Import your API client
import './css/app.css';
import TodoList from './components/TodoList';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

function App() {
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const id = localStorage.getItem('userId');
    
    if (token && name && id) {
      setUser(name);
      setUserId(id);
      setAuthMode(null);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (name, token, id) => {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    localStorage.setItem('userId', id);
    setUser(name);
    setUserId(id);
    setAuthMode(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    setUser(null);
    setUserId(null);
    setAuthMode(null);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Todo Master...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">
          <span className="title-text">Todo Master</span> 
          <span className="title-emoji">📋✨</span>
        </h1>

        {!user && !authMode && (
          <div className="welcome-card">
            <div className="welcome-header">
              <h2>Welcome to Todo Master 🚀</h2>
              <p>Your Ultimate Productivity Companion</p>
            </div>
            
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">⏱️</div>
                <h3>Save Time</h3>
                <p>Reduce task management time by 40% with our smart system</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">📈</div>
                <h3>Boost Productivity</h3>
                <p>Users complete 30% more tasks with our priority system</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">📱</div>
                <h3>Access Anywhere</h3>
                <p>Works seamlessly on all your devices</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">🔒</div>
                <h3>Secure & Private</h3>
                <p>Military-grade encryption for your data</p>
              </div>
            </div>
            
            <div className="testimonial">
              <p className="quote">"Todo Master transformed how I organize my work! I'm 2x more productive now."</p>
              <p className="author">- Sarah J., Marketing Director</p>
            </div>
            
            <div className="auth-options">
              <button 
                onClick={() => setAuthMode('login')}
                className="auth-btn login-btn"
              >
                Login to Your Account 🔑
              </button>
              <button 
                onClick={() => setAuthMode('signup')}
                className="auth-btn signup-btn"
              >
                Start Free Today 🚀
              </button>
            </div>
            
            <div className="app-stats">
              <p><span>10,000+</span> Active Users</p>
              <p><span>98%</span> Satisfaction Rate</p>
            </div>
          </div>
        )}

        {!user && authMode === 'login' && (
          <LoginForm 
            onLogin={handleLogin} 
            onSwitchToSignup={() => setAuthMode('signup')} 
          />
        )}
        {!user && authMode === 'signup' && (
          <SignupForm 
            onSwitchToLogin={() => setAuthMode('login')} 
          />
        )}

        {user && userId && (
          <>
            <div className="user-header">
              <p className="user-greeting">
                Welcome back, <span className="user-name">{user}</span>! 👋
              </p>
              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
            <TodoList userId={userId} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
