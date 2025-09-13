# Vehicle Tracker Android App

A professional Android application for vehicle tracking and fleet management, compatible with CMSV6 and CNMS systems. The app features a modern UI design inspired by Neat Telematics with comprehensive video streaming, GPS tracking, and device management capabilities.

## Features

### 🚗 Vehicle Tracking
- Real-time GPS tracking and location monitoring
- Interactive map with vehicle positions
- Route history and geofencing
- Speed monitoring and alerts

### 📹 Video Streaming
- Live video streaming from CMSV6/CNMS systems
- Multiple camera channel support
- Video playback controls
- Stream quality management

### 📱 Device Management
- Add and configure tracking devices
- Monitor device status and battery levels
- Signal strength monitoring
- Device assignment to vehicles

### ⚙️ Advanced Features
- Professional dashboard with key metrics
- Customizable settings and preferences
- Server configuration for CMSV6/CNMS
- Dark/light theme support
- Notification management

## Technology Stack

- **Platform**: Android (API 24+)
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM with Clean Architecture
- **Video Streaming**: ExoPlayer
- **Maps**: Google Maps SDK
- **Networking**: Retrofit + OkHttp
- **Database**: Room
- **Dependency Injection**: Hilt

## Setup Instructions

This project contains both the Android application and a web demo that showcases its functionality.

### Option 1: Web Demo (Browser Preview)

**For immediate preview and testing:**

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd androidapptrial
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Web Demo**
   ```bash
   npm start
   ```
   The web demo will be available at `http://localhost:5000`

**Features Available in Web Demo:**
- 📊 Dashboard with live metrics and vehicle status
- 🗺️ Interactive map with real-time vehicle tracking
- 📹 Video streaming interface (simulated)
- 📱 Device management and monitoring
- ⚙️ Settings configuration

### Option 2: Android Development

**For full Android app development:**

#### Prerequisites

1. **Android Studio**: Latest stable version (Hedgehog or newer)
2. **Android SDK**: API level 34 (Android 14)
3. **Google Maps API Key**: Required for map functionality
4. **CMSV6/CNMS Server**: Access to a compatible server

#### Installation Steps

1. **Configure Google Maps API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable "Maps SDK for Android" and "Places API"
   - Create an API key with Android restrictions
   - Update `local.properties`:
     ```properties
     GOOGLE_MAPS_API_KEY=your_actual_api_key_here
     ```

2. **Open in Android Studio**
   - Open Android Studio
   - Select "Open an existing project"
   - Navigate to the project directory
   - Wait for Gradle sync to complete

3. **Build and Run**
   - Connect an Android device or start an emulator
   - Click "Run" or press Ctrl+R (Cmd+R on Mac)
   - Grant required permissions when prompted

### Option 3: CI/CD Build (GitHub Actions)

**Automated APK builds:**

1. **Set up GitHub Secrets**
   - Go to your repository settings
   - Navigate to Secrets and Variables > Actions
   - Add secret: `GOOGLE_MAPS_API_KEY` with your API key

2. **Trigger Build**
   - Push to `main` or `develop` branch
   - Or create a pull request
   - GitHub Actions will automatically build the APK

3. **Download APK**
   - Go to Actions tab in your repository
   - Select the latest workflow run
   - Download the `vehicle-tracker-debug` artifact

### Configuration

#### Server Setup
1. Open the app and navigate to Settings
2. Tap "Server Configuration"
3. Enter your CMSV6/CNMS server details:
   - Server URL
   - Port number
   - Username and password
   - Enable HTTPS if supported

#### Permissions
The app requires the following permissions:
- **Location**: For GPS tracking and mapping
- **Camera**: For video streaming features
- **Internet**: For server communication
- **Storage**: For caching and data storage

## Project Structure

```
app/src/main/java/com/telematics/vehicletracker/
├── MainActivity.kt                 # Main entry point
├── navigation/
│   └── Navigation.kt              # Navigation setup
├── ui/
│   ├── components/
│   │   └── BottomNavigationBar.kt # Bottom navigation
│   ├── dashboard/
│   │   └── DashboardScreen.kt     # Main dashboard
│   ├── map/
│   │   └── MapScreen.kt           # GPS tracking map
│   ├── video/
│   │   └── VideoScreen.kt         # Video streaming
│   ├── devices/
│   │   └── DevicesScreen.kt       # Device management
│   ├── settings/
│   │   └── SettingsScreen.kt      # App settings
│   └── theme/
│       ├── Color.kt               # Color definitions
│       ├── Theme.kt               # App theme
│       └── Type.kt                # Typography
└── AndroidManifest.xml            # App configuration
```

## Key Dependencies

```gradle
// UI and Compose
implementation 'androidx.compose.ui:ui:1.5.4'
implementation 'androidx.compose.material3:material3:1.1.2'

// Video Streaming
implementation 'com.google.android.exoplayer:exoplayer:2.19.1'

// Maps and Location
implementation 'com.google.android.gms:play-services-maps:18.2.0'
implementation 'com.google.android.gms:play-services-location:21.0.1'

// Networking
implementation 'com.squareup.retrofit2:retrofit:2.9.0'
implementation 'com.squareup.okhttp3:okhttp:4.12.0'

// Database
implementation 'androidx.room:room-runtime:2.6.0'
implementation 'androidx.room:room-ktx:2.6.0'
```

## API Integration

### CMSV6/CNMS Compatibility
The app is designed to work with:
- **CMSV6**: Chinese vehicle monitoring system
- **CNMS**: Compatible network management system
- **Standard protocols**: RTSP, HTTP, WebSocket

### Supported Features
- Real-time video streaming
- GPS data retrieval
- Device status monitoring
- Alert and notification handling
- Historical data access

## Troubleshooting

### Common Issues

1. **Maps not loading**
   - Verify Google Maps API key is correct
   - Check if Maps SDK for Android is enabled
   - Ensure device has internet connection

2. **Video streaming issues**
   - Verify server URL and credentials
   - Check network connectivity
   - Ensure RTSP streams are accessible

3. **GPS not working**
   - Grant location permissions
   - Enable location services on device
   - Check if GPS is available

4. **Build errors**
   - Clean and rebuild project
   - Update Android Studio and SDK
   - Check Gradle version compatibility

### Logs and Debugging
- Use Android Studio's Logcat for debugging
- Enable developer options on device
- Check network traffic with debugging tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or questions:
- Email: support@vehicletracker.com
- Documentation: [Project Wiki](wiki-url)
- Issues: [GitHub Issues](issues-url)

## Roadmap

- [ ] Offline map support
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Push notification improvements
- [ ] Enhanced video recording features
- [ ] Fleet management tools
- [ ] Driver behavior analysis

---

**Note**: This app requires a compatible CMSV6 or CNMS server for full functionality. Demo servers may be available for testing purposes.