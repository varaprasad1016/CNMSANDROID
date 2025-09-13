import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import neatAPI from '../services/neatAPI';

function VideoView({ currentUser }) {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Load vehicles and cameras on component mount
  useEffect(() => {
    if (currentUser && !currentUser.demoMode) {
      loadVehiclesAndCameras();
    } else {
      // Use demo data for demo mode
      const demoVehicles = [
        { devIdno: 'DEMO001', alias: 'Demo Vehicle 001', status: 'online' },
        { devIdno: 'DEMO002', alias: 'Demo Vehicle 002', status: 'online' },
      ];
      setVehicles(demoVehicles);
      
      const demoCameras = [
        { id: 1, name: 'Front Camera', vehicle: 'Demo Vehicle 001', devIdno: 'DEMO001', channel: 1, status: 'online' },
        { id: 2, name: 'Rear Camera', vehicle: 'Demo Vehicle 001', devIdno: 'DEMO001', channel: 2, status: 'online' },
        { id: 3, name: 'Interior Camera', vehicle: 'Demo Vehicle 002', devIdno: 'DEMO002', channel: 1, status: 'online' },
        { id: 4, name: 'Side Camera', vehicle: 'Demo Vehicle 002', devIdno: 'DEMO002', channel: 2, status: 'offline' },
      ];
      setCameras(demoCameras);
    }
  }, [currentUser]);

  const loadVehiclesAndCameras = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await neatAPI.getUserVehicles();
      
      if (result.success) {
        const vehicleList = result.vehicles;
        setVehicles(vehicleList);
        
        // Generate camera list based on vehicles (assuming 4 channels per vehicle)
        const cameraList = [];
        vehicleList.forEach(vehicle => {
          const channelNames = ['Front Camera', 'Rear Camera', 'Interior Camera', 'Side Camera'];
          for (let i = 1; i <= 4; i++) {
            cameraList.push({
              id: `${vehicle.devIdno}_${i}`,
              name: channelNames[i - 1] || `Camera ${i}`,
              vehicle: vehicle.alias || vehicle.devIdno,
              devIdno: vehicle.devIdno,
              channel: i,
              status: 'online' // We'll check this separately if needed
            });
          }
        });
        setCameras(cameraList);
      } else {
        setError(result.error || 'Failed to load vehicles');
      }
    } catch (err) {
      console.error('Error loading vehicles:', err);
      setError(err.message || 'An error occurred while loading vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  const setupHLSPlayer = (url) => {
    const video = videoRef.current;
    if (!video) return;

    // Clean up any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Check if HLS is natively supported (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.load();
      video.play().catch(error => {
        console.warn('Autoplay failed:', error);
      });
    } else if (Hls.isSupported()) {
      // Use hls.js for other browsers
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed');
        video.play().catch(error => {
          console.warn('Autoplay failed:', error);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error loading video stream');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error playing video stream');
              break;
            default:
              setError('Fatal error loading video stream');
              break;
          }
          setIsStreaming(false);
        }
      });
    } else {
      setError('HLS video streaming is not supported in this browser');
    }
  };

  const startStream = async (camera) => {
    if (!camera) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (currentUser?.demoMode) {
        // Demo mode - use a demo HLS stream
        const demoStreamUrl = 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8';
        setStreamUrl(demoStreamUrl);
        setIsStreaming(true);
        setupHLSPlayer(demoStreamUrl);
      } else {
        // Real API mode
        const result = await neatAPI.getHLSLiveAddress(camera.devIdno, camera.channel);
        
        if (result.success && result.streamUrl) {
          setStreamUrl(result.streamUrl);
          setIsStreaming(true);
          setupHLSPlayer(result.streamUrl);
        } else {
          setError(result.error || 'Failed to get video stream');
        }
      }
    } catch (err) {
      console.error('Error starting stream:', err);
      setError(err.message || 'An error occurred while starting the stream');
    } finally {
      setIsLoading(false);
    }
  };

  const stopStream = () => {
    setIsStreaming(false);
    setStreamUrl(null);
    
    // Clean up HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    // Clean up video element
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
      videoRef.current.load();
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  const toggleStream = () => {
    if (isStreaming) {
      stopStream();
    } else if (selectedCamera) {
      startStream(selectedCamera);
    }
  };

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
    if (isStreaming) {
      stopStream();
    }
  };

  return (
    <>
      <div className="sidebar">
        <h3>Camera List</h3>
        
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div>Loading cameras...</div>
          </div>
        )}

        {error && (
          <div style={{ 
            background: '#ffebee', 
            color: '#c62828', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            ⚠️ {error}
            <button 
              onClick={() => currentUser?.demoMode ? null : loadVehiclesAndCameras()}
              style={{
                display: 'block',
                margin: '0.5rem auto 0',
                padding: '0.25rem 0.5rem',
                fontSize: '0.8rem',
                background: '#c62828',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        <div className="vehicle-list">
          {cameras.map(camera => (
            <div 
              key={camera.id} 
              className={`vehicle-item ${selectedCamera?.id === camera.id ? 'active' : ''}`}
              onClick={() => handleCameraSelect(camera)}
            >
              <div className="vehicle-name">{camera.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                {camera.vehicle}
              </div>
              <div className={`vehicle-status ${camera.status === 'online' ? 'status-online' : 'status-offline'}`}>
                Status: {camera.status}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#999' }}>
                Channel: {camera.channel} | Device: {camera.devIdno}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={toggleStream}
            disabled={!selectedCamera || isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 
                !selectedCamera || isLoading ? '#ccc' :
                isStreaming ? '#f44336' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !selectedCamera || isLoading ? 'not-allowed' : 'pointer',
              opacity: !selectedCamera || isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Loading...' : 
             isStreaming ? 'Stop Stream' : 
             selectedCamera ? 'Start Stream' : 'Select Camera First'}
          </button>
        </div>

        {vehicles.length > 0 && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Connected Vehicles</h4>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} available
            </div>
          </div>
        )}
      </div>

      <div className="main-content">
        <div style={{ padding: '1rem', height: '100%' }}>
          <h2>Video Stream {currentUser?.demoMode ? '(Demo)' : ''}</h2>
          
          <div style={{ 
            width: '100%', 
            height: 'calc(100% - 60px)', 
            backgroundColor: '#000', 
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {isStreaming && streamUrl ? (
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
                controls
                autoPlay
                muted
                playsInline
                onError={(e) => {
                  console.error('Video error:', e);
                  setError('Video playback error. The stream may not be available.');
                  setIsStreaming(false);
                }}
              >
                Your browser does not support HLS video streaming.
              </video>
            ) : (
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}>
                {selectedCamera ? (
                  <>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📹</div>
                    <div>Ready to Stream</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
                      {selectedCamera.name} - {selectedCamera.vehicle}
                    </div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#4caf50' }}>
                      Click "Start Stream" to begin
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📹</div>
                    <div>No Camera Selected</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
                      Select a camera from the sidebar to view its stream
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoView;