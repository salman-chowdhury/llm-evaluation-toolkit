import SavedRoutes from '../components/SavedRoutes';
import { useRoutes } from '../hooks/useRoutes';

const RoutesPage = () => {
  const { routes, addRoute, removeRoute } = useRoutes();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Saved Routes</h1>
        <p>Manage your frequent routes</p>
      </div>
      <div className="page-content">
        <SavedRoutes
          routes={routes}
          onAddRoute={addRoute}
          onRemoveRoute={removeRoute}
          defaultExpanded={true}
        />
      </div>
    </div>
  );
};

export default RoutesPage;