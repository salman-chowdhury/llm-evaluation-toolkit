import RouteInsights from '../components/RouteInsights';
import { useRoutes } from '../hooks/useRoutes';
import { useTrafficData } from '../hooks/useTrafficData';
import { useRouteInsights } from '../hooks/useRouteInsights';

const InsightsPage = () => {
  const { routes } = useRoutes();
  const { data: trafficData, isDemo } = useTrafficData();
  const { insights, refreshInsights, isGenerating } = useRouteInsights(routes, trafficData);

  return (
    <div className="page">
      <div className="page-header">
        <h1>AI Route Insights</h1>
        <p>Smart analysis of your routes</p>
        {isDemo && trafficData && (
          <div className="demo-indicator">
            <span>⚠️ Demo data active</span>
          </div>
        )}
      </div>
      <div className="page-content">
        <RouteInsights
          insights={insights}
          routes={routes}
          onRefresh={refreshInsights}
          isGenerating={isGenerating}
          defaultExpanded={true}
        />
      </div>
    </div>
  );
};

export default InsightsPage;