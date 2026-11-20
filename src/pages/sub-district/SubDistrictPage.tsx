import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { SubDistrict } from '../../constants/Type';
import { API_DISTRICT, API_SUB_DISTRICT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';
import getSubDistrictColumns from '../../table-columns/SubDistrictColumns';

interface DistrictOption {
  id: number;
  name: string;
}

function SubDistrictPage() {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchWithAuth(API_DISTRICT)
      .then((response) => response.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(() => {});
  }, []);

  const handleDetail = (subDistrict: SubDistrict) => {
    navigate(RoutePath.SUB_DISTRICT_DETAIL(subDistrict.id));
  };

  const handleEdit = (subDistrict: SubDistrict) => {
    navigate(RoutePath.SUB_DISTRICT_EDIT(subDistrict.id));
  };

  const handleNewSubDistrict = () => {
    navigate(RoutePath.SUB_DISTRICT_NEW);
  };

  const handleDelete = async (subDistrict: SubDistrict) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_SUB_DISTRICT}/${subDistrict.id}`, {
        method: 'DELETE',
      });
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
      <Title titleText="Sub District Management" />
      <Box sx={{ px: 3, pt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewSubDistrict}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
        >
          New Sub District
        </Button>
      </Box>
      <Box sx={{ flex: 1, mt: 2, mx: 3, mb: 3, minHeight: 0 }}>
        <TableData<SubDistrict>
          url={API_SUB_DISTRICT}
          columns={getSubDistrictColumns(districts)}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          auditTrailUrl={(subDistrict) => `${API_SUB_DISTRICT}/${subDistrict.id}/audit-trail`}
          dataKey="id"
          disabled={loading}
          refreshKey={refreshKey}
          responseKey="subDistricts"
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

export default SubDistrictPage;
