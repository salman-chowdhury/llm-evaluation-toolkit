import ReportModal from '../components/ReportModal';
import { useReports } from '../hooks/useReports';
import { useNavigate } from 'react-router-dom';

const ReportPage = () => {
  const { submitReport } = useReports();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="page">
      <ReportModal 
        isOpen={true}
        onClose={handleClose}
        onSubmitReport={submitReport}
      />
    </div>
  );
};

export default ReportPage;