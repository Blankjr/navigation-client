# Indoor Navigation Client

A React Native application providing accessible indoor navigation for people with visual impairments, developed for the Hochschule Düsseldorf.

## Features

- **Dual Navigation Modes**:
  - Visual mode with high-contrast color guidance
  - Tactile mode with audio descriptions
- **Accessibility Features**:
  - Voice input for destination selection
  - Adjustable speech rate for audio guidance
  - High contrast visual elements
- **Smart Positioning**:
  - Indoor positioning
  - Optional WLAN fingerprinting
- **Room Finding**:
  - Support for finding rooms, facilities, and staff offices
  - Smart speech recognition for complex names
  - Visual and tactile room signage integration

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Zustand for state management
- React Native Paper for UI components
- Various Expo modules for device features

## Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo CLI

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Install Expo Go on your test device or set up an emulator/simulator

## Development

Start the development server:

```bash
# Start with development configuration
npm run dev

# Start on Android device
npm run android

# Start on iOS device (requires macOS)
npm run ios
```

## Building

To create an APK build:

```bash
# Important: Clean build folders before switching between build variants
rm -rf android/  # On Unix-based systems
# or
rd /s /q android # On Windows
```
```bash
# For development build
npm run dev

# For preview build
npm run build-preview

# For production build
npm run build-production
```
> **Important**: It's recommended to delete the local android folder before switching between different build variants (dev/preview/production). This prevents package name issues caused by Expo caching the previous build configuration. For example, without cleaning, you might end up with a production build using the preview package name (com.blankjr.navigationclient.preview).

## Project Structure

- `/app` - Main application screens and navigation
- `/components` - Reusable React components
- `/data` - Data models and static content
- `/stores` - Global state management with Zustand
- `/constants` - Configuration and constants

## Accessibility Features

### Visual Mode
- High contrast colors for navigation elements
- Large touch targets
- Clear visual hierarchy
- Visual feedback for all interactions
- Voice support

### Tactile Mode
- Voice-guided navigation
- Audio descriptions of surroundings
- Haptic feedback support

## Configuration

Key settings can be adjusted in the app's settings screen:
- Speech rate
- Navigation mode (Visual/Tactile)
- WLAN fingerprinting mode