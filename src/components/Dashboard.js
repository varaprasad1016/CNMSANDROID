import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalVehicles: 12,
    activeVehicles: 8,
    totalDistance: 1247.5,
    averageSpeed: 45.2
  });

  const [vehicles] = useState([
    { id: 1, name: 'Vehicle 001', status: 'online', speed: 52, location: 'Highway 101' },
    { id: 2, name: 'Vehicle 002', status: 'online', speed: 38, location: 'Downtown' },
    { id: 3, name: 'Vehicle 003', status: 'offline', speed: 0, location: 'Parking Lot A' },
    { id: 4, name: 'Vehicle 004', status: 'online', speed: 65, location: 'Interstate 5' },
    { id: 5, name: 'Vehicle 005', status: 'online', speed: 42, location: 'City Center' },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalDistance: prev.totalDistance + Math.random() * 2,
        averageSpeed: 40 + Math.random() * 20
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="sidebar">
        <h3>Fleet Overview</h3>
        <div className="dashboard-grid">
          <div className="metric-card">
            <h3>Total Vehicles</h3>
            <div className="metric-value">{metrics.totalVehicles}</div>
          </div>
          <div className="metric-card">
            <h3>Active Vehicles</h3>
            <div className="metric-value">{metrics.activeVehicles}</div>
          </div>
          <div className="metric-card">
            <h3>Total Distance (km)</h3>
            <div className="metric-value">{metrics.totalDistance.toFixed(1)}</div>
          </div>
          <div className="metric-card">
            <h3>Avg Speed (km/h)</h3>
            <div className="metric-value">{metrics.averageSpeed.toFixed(1)}</div>
          </div>
        </div>

        <h3>Recent Alerts</h3>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div style={{ color: '#ff9800', marginBottom: '0.5rem' }}>⚠️ Vehicle 004: Speed limit exceeded</div>
          <div style={{ color: '#4caf50', marginBottom: '0.5rem' }}>✅ Vehicle 002: Maintenance completed</div>
          <div style={{ color: '#f44336', marginBottom: '0.5rem' }}>🔴 Vehicle 003: Offline for 2 hours</div>
        </div>
      </div>

      <div className="main-content">
        <div style={{ padding: '1rem' }}>
          <h2>Live Vehicle Status</h2>
          <div className="vehicle-list">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="vehicle-item">
                <div className="vehicle-name">{vehicle.name}</div>
                <div className={`vehicle-status ${vehicle.status === 'online' ? 'status-online' : 'status-offline'}`}>
                  Status: {vehicle.status} | Speed: {vehicle.speed} km/h | Location: {vehicle.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;