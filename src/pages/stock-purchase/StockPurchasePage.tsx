import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { StockPurchase } from '../../constants/Type';
import { BASE_API_URL } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';
import StockPurchaseColumn from '../../table-columns/StockPurchaseColumn';

function StockPurchasePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleDetail = (item: StockPurchase) => {
    navigate(RoutePath.STOCK_PURCHASE_DETAIL(item.id));
  };

  const handleEdit = (item: StockPurchase) => {
    navigate(RoutePath.STOCK_PURCHASE_EDIT(item.id));
  };

  const handleNewStockPurchase = () => {
    navigate(RoutePath.STOCK_PURCHASE_NEW);
  };

  const handleDelete = async (item: StockPurchase) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${BASE_API_URL}/stock-purchase/${item.id}`, {
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
      <Title titleText="Stock Purchase" />
      <Box sx={{ px: 3, pt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewStockPurchase}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
        >
          New Stock Purchase
        </Button>
      </Box>
      <Box sx={{ flex: 1, mt: 2, mx: 3, mb: 3, minHeight: 0 }}>
        <TableData<StockPurchase>
          url={`${BASE_API_URL}/stock-purchase`}
          columns={StockPurchaseColumn}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          dataKey="id"
          disabled={loading}
          refreshKey={refreshKey}
          responseKey="stockPurchases"
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

export default StockPurchasePage;
