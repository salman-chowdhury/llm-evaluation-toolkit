import Legend from '../components/Legend';

const LegendPage = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Legend</h1>
        <p>Understanding map symbols</p>
      </div>
      <div className="page-content legend-page-content">
        <Legend isOpen={true} onClose={() => {}} isPage={true} />
      </div>
    </div>
  );
};

export default LegendPage;