/**
 * Authentication Service for NeatCCTV API
 */
import neatAPI from './neatAPI';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isLoggedIn = false;
    this.listeners = [];
  }

  // Add listener for auth state changes
  addAuthStateListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeAuthStateListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners of auth state changes
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.isLoggedIn, this.currentUser));
  }

  // Check if user is currently authenticated
  async checkAuthState() {
    this.isLoggedIn = neatAPI.isAuthenticated();
    if (this.isLoggedIn) {
      // Try to get user info to verify token is still valid
      try {
        const result = await neatAPI.getUserVehicles();
        if (!result.success) {
          this.isLoggedIn = false;
          this.currentUser = null;
        }
      } catch (error) {
        this.isLoggedIn = false;
        this.currentUser = null;
      }
    }
    this.notifyListeners();
    return this.isLoggedIn;
  }

  // Login with username and password
  async login(username, password) {
    try {
      const result = await neatAPI.login(username, password);
      
      if (result.success) {
        this.isLoggedIn = true;
        this.currentUser = {
          username: username,
          sessionToken: result.data.jsession,
          loginTime: new Date().toISOString(),
        };
        
        // Store user info in localStorage
        localStorage.setItem('neat_current_user', JSON.stringify(this.currentUser));
        
        this.notifyListeners();
        return { success: true, user: this.currentUser };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Auth service login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout
  async logout() {
    try {
      await neatAPI.logout();
      
      this.isLoggedIn = false;
      this.currentUser = null;
      
      // Clear stored user info
      localStorage.removeItem('neat_current_user');
      
      this.notifyListeners();
      return { success: true };
    } catch (error) {
      console.error('Auth service logout error:', error);
      // Even if logout API fails, clear local state
      this.isLoggedIn = false;
      this.currentUser = null;
      localStorage.removeItem('neat_current_user');
      this.notifyListeners();
      
      return { success: false, error: error.message };
    }
  }

  // Get current user info
  getCurrentUser() {
    if (!this.currentUser && this.isLoggedIn) {
      // Try to restore from localStorage
      const storedUser = localStorage.getItem('neat_current_user');
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
    }
    return this.currentUser;
  }

  // Check if currently logged in
  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  // Initialize auth service (call on app startup)
  async initialize() {
    // Check if there's a stored session
    const storedUser = localStorage.getItem('neat_current_user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.isLoggedIn = neatAPI.isAuthenticated();
        
        if (this.isLoggedIn) {
          // Verify the session is still valid
          const isValid = await this.checkAuthState();
          if (!isValid) {
            // Clear invalid session
            this.currentUser = null;
            localStorage.removeItem('neat_current_user');
          }
        }
      } catch (error) {
        console.error('Error initializing auth service:', error);
        // Clear corrupted data
        localStorage.removeItem('neat_current_user');
      }
    }
    
    this.notifyListeners();
    return this.isLoggedIn;
  }
}

// Create singleton instance
const authService = new AuthService();
export default authService;