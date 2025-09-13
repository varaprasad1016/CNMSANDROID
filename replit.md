# Overview

This is a hybrid vehicle tracking application that showcases fleet management functionality. The project consists of an Android app concept with a React-based web demo for immediate browser testing. The system is designed for compatibility with CMSV6 and CNMS vehicle tracking systems, providing real-time GPS monitoring, video streaming capabilities, device management, and fleet analytics through a modern dashboard interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a dual-platform approach:
- **Android Application**: Built with Kotlin and Jetpack Compose following MVVM with Clean Architecture patterns
- **Web Demo**: React-based single-page application for browser testing and demonstration

The web demo implements a professional telematics interface with:
- **Enterprise Layout**: Desktop-first design with professional header and sidebar navigation
- **NeatTelematics Branding**: Dark header with logo, search functionality, and user profile management
- **Sidebar Navigation**: Icon-based menu system with active states and enterprise styling
- **Card-Based Content**: Modern card layouts for dashboard metrics, vehicle lists, and status displays
- **Professional Styling**: Enterprise-grade color scheme, typography, and spacing following telematics industry standards
- **Component Architecture**: Main App component managing navigation state with dedicated view components for each feature

## Data Management
- **Android**: Room database for local data persistence with Retrofit for API communication
- **Web Demo**: In-memory state management with React hooks, simulated real-time updates using intervals

## Mapping and Visualization
- **Android**: Google Maps SDK integration
- **Web Demo**: Leaflet with React-Leaflet for interactive mapping, OpenStreetMap tiles as default provider

## Video Streaming Architecture
- **Android**: ExoPlayer for video playback and streaming
- **Web Demo**: Simulated video interface with placeholder streams

## Dependency Management
- **Android**: Hilt for dependency injection
- **Web Demo**: Standard React component hierarchy with prop passing

# External Dependencies

## Core Technologies
- **React**: Frontend framework for web demo (v18.2.0)
- **Leaflet**: Open-source mapping library (v1.9.4)
- **React-Leaflet**: React bindings for Leaflet maps (v4.2.1)
- **React Scripts**: Build tooling and development server (v5.0.1)

## Android Dependencies (Specified)
- **Jetpack Compose**: Modern UI toolkit
- **ExoPlayer**: Video streaming and playback
- **Google Maps SDK**: Mapping services
- **Retrofit + OkHttp**: HTTP client and API communication
- **Room**: Local database management
- **Hilt**: Dependency injection framework

## External Services Integration
- **CMSV6/CNMS Systems**: Primary integration target for vehicle tracking data
- **OpenStreetMap**: Default tile provider for web demo mapping
- **CDN Resources**: Leaflet assets served from cdnjs.cloudflare.com

## Development Tools
- **Serve**: Static file serving for production builds (v14.2.5)
- **React Development Server**: Hot reloading and development environment
- **Build System**: Create React App toolchain for web demo compilation

## Recent Changes

**September 2025: NeatTelematics Layout Transformation**
- Completely redesigned interface from mobile-first to professional desktop telematics application
- Implemented enterprise-style header with branding, search bar, notifications, and user management
- Added sidebar navigation with professional styling and active states
- Created card-based dashboard with modern metrics display
- Enhanced user experience with tooltips, proper accessibility, and professional avatar system
- Maintained full functionality while upgrading visual design to enterprise standards

The architecture supports both immediate web-based demonstration and future Android development, with the web demo now serving as a professional-grade telematics platform prototype suitable for enterprise fleet management presentations.