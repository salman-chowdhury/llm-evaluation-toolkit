import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MobileNav from './components/MobileNav';
import DemoBanner from './components/DemoBanner';
import { useTrafficData } from './hooks/useTrafficData';
import { useSettings } from './hooks/useSettings';
import { useRoutes } from './hooks/useRoutes';
import { useReports } from './hooks/useReports';

// Pages
import MapPage from './pages/MapPage';
import TogglesPage from './pages/TogglesPage';
import RoutesPage from './pages/RoutesPage';
import InsightsPage from './pages/InsightsPage';
import ReportPage from './pages/ReportPage';
import LegendPage from './pages/LegendPage';

import './App.css';
import './styles/pages.css';

function App() {
  const { isDemo, error } = useTrafficData();
  const { isLoaded: settingsLoaded } = useSettings();
  const { isLoaded: routesLoaded } = useRoutes();
  const { isLoaded: reportsLoaded } = useReports();
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  if (error) {
    return (
      <div className="app-error">
        <h1>Error Loading Traffic Data</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!settingsLoaded || !routesLoaded || !reportsLoaded) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <h1>Brisbane Traffic Navigator</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        {isDemo && showDemoBanner && (
          <DemoBanner 
            isVisible={true} 
            onDismiss={() => setShowDemoBanner(false)} 
          />
        )}
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/toggles" element={<TogglesPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/legend" element={<LegendPage />} />
          </Routes>
        </main>
        
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}

export default App;