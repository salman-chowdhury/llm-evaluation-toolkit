# Brisbane Traffic Navigator

A modern, mobile-first traffic navigation app for Brisbane's western suburbs. Features real-time traffic conditions, incident reporting, route planning, and AI-powered insights.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

The app will be available at `http://localhost:3000`

## 📱 Features

### iPhone-Style Mobile Navigation
- **Map (Home)**: Interactive Leaflet map centered on western suburbs
- **Layers**: Toggle traffic, cameras, and future events
- **Routes**: Save and manage frequent routes  
- **Insights**: AI-powered traffic analysis for your routes
- **Report**: Submit traffic issues with location selection
- **Legend**: Map symbols and status indicators

### Core Functionality
- **Western Suburbs Focus**: Optimized for Toowong, Indooroopilly, St Lucia area
- **Hotspot Navigation**: Quick access to key intersections
- **Demo Fallback**: Graceful degradation with sample data
- **Responsive Design**: Mobile-first with desktop support
- **Accessibility**: Screen reader support, keyboard navigation
- **Offline Storage**: Routes, reports, and settings persist locally

## 🗺️ Key Locations

The app focuses on Brisbane's western suburbs with hotspot chips for:
- **Moggill Rd / Coonan St** (-27.4936, 152.9766)
- **Toowong Roundabout** (-27.4857, 152.9921) 
- **Indooroopilly Roundabout** (-27.5045, 152.9750)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: Live traffic API endpoint
VITE_TRAFFIC_API_URL=https://your-traffic-api.com/data

# Optional: Custom map tiles
VITE_MAP_TILES_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

# Optional: Directions API key
VITE_DIRECTIONS_API_KEY=your_api_key_here
```

**Note**: All environment variables are optional. The app will fall back to demo data and OpenStreetMap tiles by default.

## 🎯 Demo Flow

### First-Time User Experience
1. **Map View**: App opens to western suburbs map with demo data banner
2. **Hotspot Navigation**: Click chips to zoom to key intersections
3. **Layer Controls**: Navigate to Layers page, toggle cameras/future events
4. **Save a Route**: Go to Routes page, add "Toowong to Indooroopilly"
5. **AI Insights**: Check Insights page for route analysis
6. **Report Issue**: Submit a congestion report with current location
7. **Legend Reference**: View Legend page for symbol meanings

### Testing Demo Data
The app automatically loads `public/demo_incidents.json` when live traffic data is unavailable. Demo incidents include:
- Active crash near Toowong Roundabout
- Planned night works at Moggill Rd
- Future road resurfacing at Indooroopilly

## 🏗️ Architecture

### Technology Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for page-based navigation
- **Leaflet** for interactive mapping
- **Lucide React** for consistent icons

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── MapView.tsx     # Main map container
│   ├── MobileNav.tsx   # Bottom navigation
│   ├── IncidentMarker.tsx
│   ├── HotspotChips.tsx
│   └── ...
├── pages/              # Route-based pages
│   ├── MapPage.tsx     # Home page with map
│   ├── TogglesPage.tsx # Layer controls
│   ├── RoutesPage.tsx  # Route management
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useTrafficData.ts
│   ├── useRoutes.ts    
│   └── ...
├── services/           # Data services and APIs
│   ├── trafficService.ts
│   └── insightsService.ts
├── utils/              # Helper functions
│   ├── constants.ts    # App constants
│   ├── geoUtils.ts     # Geographic calculations
│   └── ...
└── types/              # TypeScript definitions
```

### Key Design Decisions
- **Mobile-First**: Bottom navigation, touch-optimized components
- **Progressive Enhancement**: Works without live data or APIs
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Local storage for offline functionality, efficient re-renders

## 🎨 Design System

The app uses a consistent design system with:
- **Glassmorphism**: Translucent backgrounds with backdrop blur
- **CSS Custom Properties**: Centralized color and spacing tokens
- **Responsive Typography**: Scales appropriately across devices
- **Touch Targets**: Minimum 44px for mobile accessibility

## 🧪 Testing & Quality

- **TypeScript**: Full type safety with strict mode
- **Error Boundaries**: Graceful error handling
- **Console Clean**: No warnings or errors in development
- **Responsive Testing**: Tested on mobile, tablet, and desktop

## 🚦 Performance

- **Lazy Loading**: Code splitting for optimal bundle size
- **Efficient Rendering**: Memoized components and optimized re-renders
- **Caching**: 5-minute cache for traffic data
- **Local Storage**: Persisted state for offline functionality

## 📚 Presentation Walkthrough

### Live Demo Script (5 minutes)

1. **Opening** (30s)
   - "Brisbane Traffic Navigator - modern mobile-first traffic app"
   - Show responsive design on different screen sizes

2. **Core Navigation** (1 min)
   - Demonstrate iPhone-style bottom navigation
   - Quick tour of all 6 pages
   - Highlight western suburbs focus

3. **Map Features** (1.5 min)
   - Hotspot chip navigation to key intersections
   - Incident markers with detailed popovers
   - Legend modal and layer toggles
   - Demo data banner and graceful fallback

4. **Route Management** (1 min)
   - Add new route "Toowong to Kenmore"
   - Show route chips on map
   - Demonstrate persistence across page reloads

5. **AI Insights** (1 min)
   - Show proximity-based analysis (500m threshold)
   - Explain 2-hour time window
   - Demonstrate refresh functionality

6. **Issue Reporting** (1 min)
   - Submit congestion report with location selection
   - Show success toast and persistence
   - Explain local storage approach

### Key Talking Points
- **Mobile-First Design**: Optimized for on-the-go usage
- **Brisbane Western Suburbs**: Specific geographic focus
- **Progressive Enhancement**: Works without external APIs
- **Accessibility**: Built for all users with assistive technology
- **Real-world Ready**: Robust error handling and offline functionality

## 🤝 Contributing

This project was built following modern React best practices with TypeScript. Key areas for future enhancement:

- **Live Data Integration**: Connect to real traffic APIs
- **Advanced Routing**: Turn-by-turn directions
- **Push Notifications**: Traffic alerts for saved routes
- **Social Features**: Community reporting and validation
- **Offline Maps**: Progressive Web App capabilities

## 📄 License

MIT License - See LICENSE file for details.