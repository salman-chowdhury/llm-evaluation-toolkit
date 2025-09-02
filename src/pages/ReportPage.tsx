import ReportModal from '../components/ReportModal';
import { useReports } from '../hooks/useReports';

const ReportPage = () => {
  const { submitReport } = useReports();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Report Issue</h1>
        <p>Help improve traffic conditions</p>
      </div>
      <div className="page-content">
        <ReportModal 
          isOpen={true}
          onClose={() => {}} // Will be handled by navigation
          onSubmitReport={submitReport}
        />
      </div>
    </div>
  );
};

export default ReportPage;