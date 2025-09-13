import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import VideoView from './components/VideoView';
import DevicesView from './components/DevicesView';
import SettingsView from './components/SettingsView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'map':
        return <MapView />;
      case 'video':
        return <VideoView />;
      case 'devices':
        return <DevicesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Vehicle Tracker - Web Demo</h1>
        <p>Simulating the Android app functionality in the browser</p>
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