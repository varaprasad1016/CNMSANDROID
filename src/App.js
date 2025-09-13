import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import VideoView from './components/VideoView';
import DevicesView from './components/DevicesView';
import SettingsView from './components/SettingsView';
import LoginForm from './components/LoginForm';
import authService from './services/authService';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize authentication on app start
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const isLoggedIn = await authService.initialize();
        setIsAuthenticated(isLoggedIn);
        if (isLoggedIn) {
          setCurrentUser(authService.getCurrentUser());
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const handleAuthChange = (isLoggedIn, user) => {
      setIsAuthenticated(isLoggedIn);
      setCurrentUser(user);
    };

    authService.addAuthStateListener(handleAuthChange);

    // Cleanup listener on unmount
    return () => {
      authService.removeAuthStateListener(handleAuthChange);
    };
  }, []);

  // Handle login
  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Special handling for demo mode
      if (username === 'demo' && password === 'demo') {
        // Use mock data for demo mode
        setIsAuthenticated(true);
        setCurrentUser({ username: 'demo', demoMode: true });
        setIsLoading(false);
        return;
      }

      const result = await authService.login(username, password);
      
      if (result.success) {
        setIsAuthenticated(true);
        setCurrentUser(result.user);
        setLoginError(null);
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveTab('dashboard'); // Reset to default tab
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} />;
      case 'map':
        return <MapView currentUser={currentUser} />;
      case 'video':
        return <VideoView currentUser={currentUser} />;
      case 'devices':
        return <DevicesView currentUser={currentUser} />;
      case 'settings':
        return <SettingsView currentUser={currentUser} onLogout={handleLogout} />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  // Show loading screen during initialization
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>🚗 Vehicle Tracker</h2>
          <p>Initializing...</p>
        </div>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .loading-content {
            text-align: center;
            color: white;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginForm 
        onLogin={handleLogin}
        isLoading={isLoading}
        error={loginError}
      />
    );
  }

  // Show main app if authenticated
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>Vehicle Tracker {currentUser?.demoMode ? '- Demo Mode' : ''}</h1>
            <p>{currentUser?.demoMode ? 'Using simulated data' : 'Connected to NeatCCTV GPS System'}</p>
          </div>
          <div className="header-user">
            <span>👤 {currentUser?.username || 'User'}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="content">
        {renderContent()}
      </div>

      <nav className="bottom-nav">
        <button 
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-button ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          🗺️ Map
        </button>
        <button 
          className={`nav-button ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
        >
          📹 Video
        </button>
        <button 
          className={`nav-button ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          📱 Devices
        </button>
        <button 
          className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>
    </div>
  );
}

export default App;