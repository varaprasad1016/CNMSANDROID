import React, { useState } from 'react';

function DevicesView() {
  const [devices] = useState([
    { 
      id: 1, 
      name: 'Tracker-001', 
      vehicle: 'Vehicle 001', 
      status: 'online', 
      battery: 85, 
      signal: 95,
      lastUpdate: '2 minutes ago'
    },
    { 
      id: 2, 
      name: 'Tracker-002', 
      vehicle: 'Vehicle 002', 
      status: 'online', 
      battery: 72, 
      signal: 88,
      lastUpdate: '1 minute ago'
    },
    { 
      id: 3, 
      name: 'Tracker-003', 
      vehicle: 'Vehicle 003', 
      status: 'offline', 
      battery: 15, 
      signal: 0,
      lastUpdate: '2 hours ago'
    },
    { 
      id: 4, 
      name: 'Tracker-004', 
      vehicle: 'Vehicle 004', 
      status: 'online', 
      battery: 91, 
      signal: 92,
      lastUpdate: '30 seconds ago'
    },
    { 
      id: 5, 
      name: 'Tracker-005', 
      vehicle: 'Vehicle 005', 
      status: 'warning', 
      battery: 25, 
      signal: 78,
      lastUpdate: '5 minutes ago'
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#4caf50';
      case 'offline': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#666';
    }
  };

  const getBatteryColor = (battery) => {
    if (battery > 50) return '#4caf50';
    if (battery > 20) return '#ff9800';
    return '#f44336';
  };

  return (
    <>
      <div className="sidebar">
        <h3>Device Management</h3>
        <button style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '1rem'
        }}>
          + Add New Device
        </button>

        <div className="vehicle-list">
          {devices.map(device => (
            <div 
              key={device.id} 
              className={`vehicle-item ${selectedDevice?.id === device.id ? 'active' : ''}`}
              onClick={() => setSelectedDevice(device)}
            >
              <div className="vehicle-name">{device.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                {device.vehicle}
              </div>
              <div style={{ 
                color: getStatusColor(device.status), 
                fontSize: '0.8rem',
                marginBottom: '0.25rem'
              }}>
                ● {device.status.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#999' }}>
                Last update: {device.lastUpdate}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div style={{ padding: '1rem' }}>
          <h2>Device Details</h2>
          
          {selectedDevice ? (
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3>{selectedDevice.name}</h3>
              <div style={{ marginBottom: '1rem', color: '#666' }}>
                Assigned to: <strong>{selectedDevice.vehicle}</strong>
              </div>
              
              <div className="dashboard-grid" style={{ marginBottom: '1rem' }}>
                <div className="metric-card">
                  <h3>Status</h3>
                  <div className="metric-value" style={{ color: getStatusColor(selectedDevice.status) }}>
                    {selectedDevice.status.toUpperCase()}
                  </div>
                </div>
                <div className="metric-card">
                  <h3>Battery Level</h3>
                  <div className="metric-value" style={{ color: getBatteryColor(selectedDevice.battery) }}>
                    {selectedDevice.battery}%
                  </div>
                </div>
                <div className="metric-card">
                  <h3>Signal Strength</h3>
                  <div className="metric-value">
                    {selectedDevice.signal}%
                  </div>
                </div>
                <div className="metric-card">
                  <h3>Last Update</h3>
                  <div className="metric-value" style={{ fontSize: '1rem' }}>
                    {selectedDevice.lastUpdate}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Configure
                </button>
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Restart
                </button>
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              textAlign: 'center',
              color: '#666'
            }}>
              Select a device from the sidebar to view details
            </div>
          )}

          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
            <h3>Device Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#4caf50' }}>4</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Online Devices</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#f44336' }}>1</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Offline Devices</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#ff9800' }}>1</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Low Battery</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: '#1976d2' }}>89%</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Avg Signal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DevicesView;