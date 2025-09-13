import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapView() {
  const [vehicles, setVehicles] = useState([
    { id: 1, name: 'Vehicle 001', lat: 37.7749, lng: -122.4194, speed: 52, status: 'online' },
    { id: 2, name: 'Vehicle 002', lat: 37.7849, lng: -122.4094, speed: 38, status: 'online' },
    { id: 3, name: 'Vehicle 003', lat: 37.7649, lng: -122.4294, speed: 0, status: 'offline' },
    { id: 4, name: 'Vehicle 004', lat: 37.7949, lng: -122.3994, speed: 65, status: 'online' },
    { id: 5, name: 'Vehicle 005', lat: 37.7549, lng: -122.4394, speed: 42, status: 'online' },
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    // Simulate vehicle movement
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => {
        if (vehicle.status === 'online') {
          return {
            ...vehicle,
            lat: vehicle.lat + (Math.random() - 0.5) * 0.001,
            lng: vehicle.lng + (Math.random() - 0.5) * 0.001,
            speed: Math.max(0, vehicle.speed + (Math.random() - 0.5) * 10)
          };
        }
        return vehicle;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="sidebar">
        <h3>Vehicle List</h3>
        <div className="vehicle-list">
          {vehicles.map(vehicle => (
            <div 
              key={vehicle.id} 
              className={`vehicle-item ${selectedVehicle?.id === vehicle.id ? 'active' : ''}`}
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <div className="vehicle-name">{vehicle.name}</div>
              <div className={`vehicle-status ${vehicle.status === 'online' ? 'status-online' : 'status-offline'}`}>
                Status: {vehicle.status}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                Speed: {vehicle.speed.toFixed(1)} km/h
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                Lat: {vehicle.lat.toFixed(4)}, Lng: {vehicle.lng.toFixed(4)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="map-container">
          <MapContainer 
            center={[37.7749, -122.4194]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {vehicles.map(vehicle => (
              <Marker 
                key={vehicle.id} 
                position={[vehicle.lat, vehicle.lng]}
                opacity={vehicle.status === 'online' ? 1 : 0.5}
              >
                <Popup>
                  <div>
                    <strong>{vehicle.name}</strong><br />
                    Status: <span className={vehicle.status === 'online' ? 'status-online' : 'status-offline'}>
                      {vehicle.status}
                    </span><br />
                    Speed: {vehicle.speed.toFixed(1)} km/h<br />
                    Position: {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default MapView;