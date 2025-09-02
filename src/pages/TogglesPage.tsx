import LayerToggles from '../components/LayerToggles';
import { useSettings } from '../hooks/useSettings';
import { useTrafficData } from '../hooks/useTrafficData';

const TogglesPage = () => {
  const { settings, updateSetting } = useSettings();
  const { data: trafficData, isDemo, error } = useTrafficData();
  
  // Traffic is considered available if we have data and it's not due to an error
  // Demo data still counts as available for the toggle functionality
  const trafficAvailable = !!trafficData && !error;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Layer Controls</h1>
        <p>Toggle map layers and filters</p>
        {isDemo && trafficAvailable && (
          <div className="demo-indicator">
            <span>⚠️ Demo data active</span>
          </div>
        )}
      </div>
      <div className="page-content">
        <LayerToggles
          settings={settings}
          onSettingChange={updateSetting}
          trafficAvailable={trafficAvailable}
        />
      </div>
    </div>
  );
};

export default TogglesPage;