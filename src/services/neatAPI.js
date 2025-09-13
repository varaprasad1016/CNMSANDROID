/**
 * NeatCCTV API Service
 * Integration with https://neatcctv.co.uk/808gps/open/webApi.html
 */

class NeatAPIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_NEAT_API_URL || 'https://neatcctv.co.uk/808gps/open';
    this.token = null;
    this.sessionToken = null;
  }

  // Authentication
  async login(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/StandardApiAction_login.action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          account: username,
          password: password,
        }),
      });

      const data = await response.json();
      
      if (data.result === 0) {
        this.token = data.jsession;
        this.sessionToken = data.jsession;
        localStorage.setItem('neat_api_token', this.token);
        localStorage.setItem('neat_api_session', this.sessionToken);
        return { success: true, data };
      } else {
        throw new Error(data.desc || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      if (!this.token) return { success: true };

      const response = await fetch(`${this.baseURL}/StandardApiAction_logout.action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          jsession: this.token,
        }),
      });

      const data = await response.json();
      
      this.token = null;
      this.sessionToken = null;
      localStorage.removeItem('neat_api_token');
      localStorage.removeItem('neat_api_session');
      
      return { success: true, data };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    if (!this.token) {
      this.token = localStorage.getItem('neat_api_token');
      this.sessionToken = localStorage.getItem('neat_api_session');
    }
    return !!this.token;
  }

  // Vehicle Management - Get user's devices/vehicles
  async getUserVehicles() {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      // Try the device list endpoint first
      const response = await fetch(`${this.baseURL}/StandardApiAction_getDeviceInfo.action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          jsession: this.token,
        }),
      });

      const data = await response.json();
      
      if (data.result === 0) {
        // Normalize the response structure
        const devices = data.deviceInfo || data.devices || data.list || [];
        return { success: true, vehicles: devices };
      } else {
        throw new Error(data.desc || 'Failed to fetch devices');
      }
    } catch (error) {
      console.error('Get vehicles error:', error);
      return { success: false, error: error.message };
    }
  }

  // Alternative method to get device list if the first one fails
  async getDeviceList() {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseURL}/StandardApiAction_getDeviceIdno.action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          jsession: this.token,
        }),
      });

      const data = await response.json();
      
      if (data.result === 0) {
        return { success: true, devices: data.list || [] };
      } else {
        throw new Error(data.desc || 'Failed to fetch device list');
      }
    } catch (error) {
      console.error('Get device list error:', error);
      return { success: false, error: error.message };
    }
  }

  async getDeviceOnlineStatus(deviceIdno) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseURL}/StandardApiAction_deviceOnline.action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          jsession: this.token,
          devIdno: deviceIdno,
        }),
      });

      const data = await response.json();
      
      if (data.result === 0) {
        return { success: true, status: data.list || [] };
      } else {
        throw new Error(data.desc || 'Failed to fetch device status');
      }
    } catch (error) {
      console.error('Get device status error:', error);
      return { success: false, error: error.message };
    }
  }

  async getDeviceGPSStatus(deviceIdno) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseURL}/StandardApiAction_deviceGpsStatus.action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          jsession: this.token,
          devIdno: deviceIdno,
        }),
      });

      const data = await response.json();
      
      if (data.result === 0) {
        return { success: true, gpsData: data.list || [] };
      } else {
        throw new Error(data.desc || 'Failed to fetch GPS data');
      }
    } catch (error) {
      console.error('Get GPS data error:', error);
      return { success: false, error: error.message };
    }
  }

  // Video Streaming
  async getHLSLiveAddress(deviceIdno, channelNum = 1) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseURL}/StandardApiAction_getHlsLiveAddress.action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          jsession: this.token,
          devIdno: deviceIdno,
          channelNum: channelNum.toString(),
        }),
      });

      const data = await response.json();
      
      if (data.result === 0) {
        return { 
          success: true, 
          streamUrl: data.hlsUrl,
          streamInfo: data
        };
      } else {
        throw new Error(data.desc || 'Failed to get video stream');
      }
    } catch (error) {
      console.error('Get video stream error:', error);
      return { success: false, error: error.message };
    }
  }

  async getRTSPLiveAddress(deviceIdno, channelNum = 1) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseURL}/StandardApiAction_getRtspLiveAddress.action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          jsession: this.token,
          devIdno: deviceIdno,
          channelNum: channelNum.toString(),
        }),
      });

      const data = await response.json();
      
      if (data.result === 0) {
        return { 
          success: true, 
          streamUrl: data.rtspUrl,
          streamInfo: data
        };
      } else {
        throw new Error(data.desc || 'Failed to get RTSP stream');
      }
    } catch (error) {
      console.error('Get RTSP stream error:', error);
      return { success: false, error: error.message };
    }
  }

  // Device Track/History
  async getDeviceTrack(deviceIdno, startTime, endTime) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseURL}/StandardApiAction_deviceTrack.action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          jsession: this.token,
          devIdno: deviceIdno,
          startTime: startTime,
          endTime: endTime,
        }),
      });

      const data = await response.json();
      
      if (data.result === 0) {
        return { success: true, tracks: data.list || [] };
      } else {
        throw new Error(data.desc || 'Failed to fetch device track');
      }
    } catch (error) {
      console.error('Get device track error:', error);
      return { success: false, error: error.message };
    }
  }

  // Vehicle Latest Position
  async getVehicleLatestPosition(deviceIdno) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseURL}/StandardApiAction_getDeviceLatestPosition.action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          jsession: this.token,
          devIdno: deviceIdno,
        }),
      });

      const data = await response.json();
      
      if (data.result === 0) {
        return { success: true, position: data };
      } else {
        throw new Error(data.desc || 'Failed to fetch latest position');
      }
    } catch (error) {
      console.error('Get latest position error:', error);
      return { success: false, error: error.message };
    }
  }

  // Utility method to handle API errors
  handleAPIError(error) {
    if (error.message.includes('Not authenticated') || error.message.includes('session')) {
      // Clear stored tokens and redirect to login
      this.token = null;
      this.sessionToken = null;
      localStorage.removeItem('neat_api_token');
      localStorage.removeItem('neat_api_session');
      return { requireLogin: true, error: error.message };
    }
    return { requireLogin: false, error: error.message };
  }
}

// Create singleton instance
const neatAPI = new NeatAPIService();
export default neatAPI;