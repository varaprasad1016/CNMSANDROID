import React, { useState } from 'react';

function SettingsView() {
  const [settings, setSettings] = useState({
    serverUrl: 'https://demo.cmsv6.com',
    serverPort: '8080',
    username: 'demo_user',
    password: '',
    enableHttps: true,
    enableNotifications: true,
    refreshInterval: 30,
    mapProvider: 'openstreetmap',
    theme: 'light'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    alert('Settings saved! (This is a demo - changes are not persistent)');
  };

  return (
    <>
      <div className="sidebar">
        <h3>Settings Categories</h3>
        <div className="vehicle-list">
          <div className="vehicle-item active">
            <div className="vehicle-name">🌐 Server Configuration</div>
          </div>
          <div className="vehicle-item">
            <div className="vehicle-name">🔔 Notifications</div>
          </div>
          <div className="vehicle-item">
            <div className="vehicle-name">🗺️ Map Settings</div>
          </div>
          <div className="vehicle-item">
            <div className="vehicle-name">🎨 Appearance</div>
          </div>
          <div className="vehicle-item">
            <div className="vehicle-name">🔒 Security</div>
          </div>
          <div className="vehicle-item">
            <div className="vehicle-name">ℹ️ About</div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div style={{ padding: '1rem' }}>
          <h2>Settings</h2>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h3>🌐 Server Configuration</h3>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Server URL
                </label>
                <input
                  type="text"
                  value={settings.serverUrl}
                  onChange={(e) => handleSettingChange('serverUrl', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Port
                  </label>
                  <input
                    type="text"
                    value={settings.serverPort}
                    onChange={(e) => handleSettingChange('serverPort', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) => handleSettingChange('username', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={settings.password}
                  onChange={(e) => handleSettingChange('password', e.target.value)}
                  placeholder="Enter password"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={settings.enableHttps}
                    onChange={(e) => handleSettingChange('enableHttps', e.target.checked)}
                  />
                  Enable HTTPS
                </label>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h3>🔔 Notification Settings</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                  />
                  Enable push notifications
                </label>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Data Refresh Interval (seconds)
                </label>
                <select
                  value={settings.refreshInterval}
                  onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h3>🗺️ Map Settings</h3>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Map Provider
              </label>
              <select
                value={settings.mapProvider}
                onChange={(e) => handleSettingChange('mapProvider', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="openstreetmap">OpenStreetMap</option>
                <option value="google">Google Maps</option>
                <option value="satellite">Satellite View</option>
              </select>
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h3>🎨 Appearance</h3>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button 
              onClick={handleSave}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                marginRight: '1rem'
              }}
            >
              Save Settings
            </button>
            <button 
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsView;