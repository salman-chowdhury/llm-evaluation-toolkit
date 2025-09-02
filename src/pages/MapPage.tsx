import MapView from '../components/MapView';
import { useTrafficData } from '../hooks/useTrafficData';
import { useSettings } from '../hooks/useSettings';
import { useRoutes } from '../hooks/useRoutes';
import { useReports } from '../hooks/useReports';

const MapPage = () => {
  const { data: trafficData } = useTrafficData();
  const { settings, updateSetting } = useSettings();
  const { routes, addRoute, removeRoute } = useRoutes();
  const { submitReport } = useReports();

  return (
    <div className="page">
      <MapView 
        trafficData={trafficData} 
        settings={settings}
        onSettingChange={updateSetting}
        routes={routes}
        onAddRoute={addRoute}
        onRemoveRoute={removeRoute}
        onSubmitReport={submitReport}
      />
    </div>
  );
};

export default MapPage;