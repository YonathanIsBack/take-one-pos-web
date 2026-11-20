import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { District } from '../../constants/Type';
import { API_DISTRICT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';
import DistrictColumn from '../../table-columns/DistrictColumns';

function DistrictPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleDetail = (district: District) => {
    navigate(RoutePath.DISTRICT_DETAIL(district.id));
  };

  const handleEdit = (district: District) => {
    navigate(RoutePath.DISTRICT_EDIT(district.id));
  };

  const handleNewDistrict = () => {
    navigate(RoutePath.DISTRICT_NEW);
  };

  const handleDelete = async (district: District) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_DISTRICT}/${district.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      setSuccessModal({ open: true, message: data.message });
      setRefreshKey((prev) => prev + 1);
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="District Management" />
      <Box sx={{ px: 3, pt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewDistrict}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
        >
          New District
        </Button>
      </Box>
      <Box sx={{ flex: 1, mt: 2, mx: 3, mb: 3, minHeight: 0 }}>
        <TableData<District>
          url={API_DISTRICT}
          columns={DistrictColumn}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          auditTrailUrl={(district) => `${API_DISTRICT}/${district.id}/audit-trail`}
          dataKey="id"
          disabled={loading}
          refreshKey={refreshKey}
          responseKey="districts"
        />
      </Box>

      <DialogModal
        open={successModal.open}
        onClose={() => setSuccessModal({ open: false, message: '' })}
        title="Success"
        message={successModal.message}
      />

      <DialogModal
        open={errorModal.open}
        onClose={() => setErrorModal({ open: false, message: '' })}
        title="Error"
        message={errorModal.message}
      />
    </Box>
  );
}

export default DistrictPage;
