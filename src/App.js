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
    <div className="telematics-app">
      {/* Top Header */}
      <header className="telematics-header">
        <div className="header-left">
          <div className="logo-section">
            <h1>🚛 NeatTelematics</h1>
            <span className="version-badge">{currentUser?.demoMode ? 'DEMO' : 'LIVE'}</span>
          </div>
        </div>
        <div className="header-center">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search vehicles, drivers, routes..." 
              disabled 
              title="Search functionality coming soon"
            />
            <button disabled title="Search functionality coming soon">🔍</button>
          </div>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <button className="notification-btn" title="Notifications">🔔 <span className="badge">3</span></button>
            <button className="alert-btn" title="Active Alerts">⚠️ <span className="badge">2</span></button>
            <div className="user-profile">
              <div className="profile-avatar">
                {(currentUser?.username || 'User').charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="username">{currentUser?.username || 'User'}</span>
                <span className="user-role">Fleet Manager</span>
              </div>
              <button onClick={handleLogout} className="logout-btn" title="Logout">⏻</button>
            </div>
          </div>
        </div>
      </header>

      <div className="telematics-body">
        {/* Sidebar Navigation */}
        <nav className="telematics-sidebar">
          <div className="sidebar-menu">
            <button 
              className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="icon">📊</span>
              <span className="label">Dashboard</span>
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <span className="icon">🗺️</span>
              <span className="label">Live Tracking</span>
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              <span className="icon">📹</span>
              <span className="label">Video Monitoring</span>
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'devices' ? 'active' : ''}`}
              onClick={() => setActiveTab('devices')}
            >
              <span className="icon">📱</span>
              <span className="label">Fleet Management</span>
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="icon">⚙️</span>
              <span className="label">Settings</span>
            </button>
          </div>
          
          <div className="sidebar-footer">
            <div className="connection-status">
              <div className="status-indicator online"></div>
              <span>System Online</span>
            </div>
            <div className="fleet-summary">
              <div className="fleet-stat">
                <span className="stat-value">12</span>
                <span className="stat-label">Active Vehicles</span>
              </div>
              <div className="fleet-stat">
                <span className="stat-value">2</span>
                <span className="stat-label">Alerts</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="telematics-content">
          <div className="content-header">
            <h2>{getPageTitle()}</h2>
            <div className="content-actions">
              <button className="refresh-btn">🔄 Refresh</button>
              <button className="export-btn">📤 Export</button>
            </div>
          </div>
          <div className="content-body">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );

  function getPageTitle() {
    switch (activeTab) {
      case 'dashboard': return 'Fleet Overview Dashboard';
      case 'map': return 'Live Vehicle Tracking';
      case 'video': return 'Video Monitoring Center';
      case 'devices': return 'Fleet & Device Management';
      case 'settings': return 'System Settings';
      default: return 'Fleet Overview Dashboard';
    }
  }
}

export default App;