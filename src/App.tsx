import { useState } from 'react';
import MapView from './components/MapView';
import DemoBanner from './components/DemoBanner';
import { useTrafficData } from './hooks/useTrafficData';
import { useSettings } from './hooks/useSettings';
import { useRoutes } from './hooks/useRoutes';
import { useReports } from './hooks/useReports';
import './App.css';

function App() {
  const { data, isLoading, isDemo, error } = useTrafficData();
  const { settings, updateSetting, isLoaded: settingsLoaded } = useSettings();
  const { routes, addRoute, removeRoute, isLoaded: routesLoaded } = useRoutes();
  const { submitReport, isLoaded: reportsLoaded } = useReports();
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
    <div className="app">
      {isDemo && showDemoBanner && (
        <DemoBanner 
          isVisible={true} 
          onDismiss={() => setShowDemoBanner(false)} 
        />
      )}
      
      <header className="app-header" style={{ 
        marginTop: isDemo && showDemoBanner ? '40px' : '0' 
      }}>
        <h1>Brisbane Traffic Navigator</h1>
        <p>Western Suburbs Traffic & Navigation</p>
        {isLoading && (
          <div className="loading-indicator">
            Loading traffic data...
          </div>
        )}
      </header>
      
      <main className="app-main">
        <MapView 
          trafficData={data} 
          settings={settings}
          onSettingChange={updateSetting}
          routes={routes}
          onAddRoute={addRoute}
          onRemoveRoute={removeRoute}
          onSubmitReport={submitReport}
        />
      </main>
    </div>
  );
}

export default App;