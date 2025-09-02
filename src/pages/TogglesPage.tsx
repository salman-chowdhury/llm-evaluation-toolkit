import LayerToggles from '../components/LayerToggles';
import { useSettings } from '../hooks/useSettings';

const TogglesPage = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Layer Controls</h1>
        <p>Toggle map layers and filters</p>
      </div>
      <div className="page-content">
        <LayerToggles
          settings={settings}
          onSettingChange={updateSetting}
          trafficAvailable={false}
        />
      </div>
    </div>
  );
};

export default TogglesPage;