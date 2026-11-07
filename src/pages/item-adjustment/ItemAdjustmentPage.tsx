import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { ItemAdjustment } from '../../constants/Type';
import { API_ITEM_ADJUSTMENT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';
import ItemAdjustmentColumn from '../../table-columns/ItemAdjustmentColumns';

function ItemAdjustmentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleDetail = (itemAdjustment: ItemAdjustment) => {
    navigate(RoutePath.ITEM_ADJUSTMENT_DETAIL(itemAdjustment.id));
  };

  const handleEdit = (itemAdjustment: ItemAdjustment) => {
    navigate(RoutePath.ITEM_ADJUSTMENT_EDIT(itemAdjustment.id));
  };

  const handleNewItemAdjustment = () => {
    navigate(RoutePath.ITEM_ADJUSTMENT_NEW);
  };

  const handleDelete = async (itemAdjustment: ItemAdjustment) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_ITEM_ADJUSTMENT}/${itemAdjustment.id}`, {
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
      <Title titleText="Item Adjustment" />
      <Box sx={{ px: 3, pt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewItemAdjustment}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
        >
          New Adjustment
        </Button>
      </Box>
      <Box sx={{ flex: 1, mt: 2, mx: 3, mb: 3, minHeight: 0 }}>
        <TableData<ItemAdjustment>
          url={API_ITEM_ADJUSTMENT}
          columns={ItemAdjustmentColumn}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          auditTrailUrl={(itemAdjustment) =>
            `${API_ITEM_ADJUSTMENT}/${itemAdjustment.id}/audit-trail`
          }
          dataKey="id"
          disabled={loading}
          refreshKey={refreshKey}
          responseKey="itemAdjustments"
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

export default ItemAdjustmentPage;
