import React, { useState } from 'react';

function VideoView() {
  const [selectedCamera, setSelectedCamera] = useState(1);
  const [isStreaming, setIsStreaming] = useState(false);

  const cameras = [
    { id: 1, name: 'Front Camera', vehicle: 'Vehicle 001', status: 'online' },
    { id: 2, name: 'Rear Camera', vehicle: 'Vehicle 001', status: 'online' },
    { id: 3, name: 'Interior Camera', vehicle: 'Vehicle 002', status: 'online' },
    { id: 4, name: 'Front Camera', vehicle: 'Vehicle 004', status: 'offline' },
  ];

  const toggleStream = () => {
    setIsStreaming(!isStreaming);
  };

  return (
    <>
      <div className="sidebar">
        <h3>Camera List</h3>
        <div className="vehicle-list">
          {cameras.map(camera => (
            <div 
              key={camera.id} 
              className={`vehicle-item ${selectedCamera === camera.id ? 'active' : ''}`}
              onClick={() => setSelectedCamera(camera.id)}
            >
              <div className="vehicle-name">{camera.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                {camera.vehicle}
              </div>
              <div className={`vehicle-status ${camera.status === 'online' ? 'status-online' : 'status-offline'}`}>
                Status: {camera.status}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={toggleStream}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isStreaming ? '#f44336' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isStreaming ? 'Stop Stream' : 'Start Stream'}
          </button>
        </div>
      </div>

      <div className="main-content">
        <div style={{ padding: '1rem', height: '100%' }}>
          <h2>Video Stream</h2>
          <div style={{ 
            width: '100%', 
            height: 'calc(100% - 60px)', 
            backgroundColor: '#000', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem'
          }}>
            {isStreaming ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📹</div>
                <div>Live Stream Active</div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
                  Camera {selectedCamera} - {cameras.find(c => c.id === selectedCamera)?.name}
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '1rem', color: '#4caf50' }}>
                  ● LIVE - 1080p @ 30fps
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📹</div>
                <div>Video Stream Not Active</div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
                  Select a camera and click "Start Stream" to begin
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoView;