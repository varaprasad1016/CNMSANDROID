import React, { useState } from 'react';

function LoginForm({ onLogin, isLoading = false, error = null }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      onLogin(credentials.username, credentials.password);
    }
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>🚗 Vehicle Tracker</h2>
          <p>Connect to NeatCCTV GPS Tracking System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || !credentials.username || !credentials.password}
          >
            {isLoading ? 'Connecting...' : 'Login'}
          </button>
        </form>

        <div className="login-info">
          <h3>Demo Credentials</h3>
          <p>If you don't have an account, you can use the demo mode by leaving fields empty and clicking "Use Demo Mode" below.</p>
          <button 
            type="button" 
            className="demo-button"
            onClick={() => onLogin('demo', 'demo')}
            disabled={isLoading}
          >
            Use Demo Mode
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;