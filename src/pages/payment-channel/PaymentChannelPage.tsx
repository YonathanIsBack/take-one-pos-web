import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { PaymentChannel } from '../../constants/Type';
import { API_PAYMENT_CHANNEL } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';
import PaymentChannelColumn from '../../table-columns/PaymentChannelColumns';

function PaymentChannelPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleDetail = (item: PaymentChannel) => {
    navigate(RoutePath.PAYMENT_CHANNEL_DETAIL(item.id));
  };

  const handleEdit = (item: PaymentChannel) => {
    navigate(RoutePath.PAYMENT_CHANNEL_EDIT(item.id));
  };

  const handleNewPaymentChannel = () => {
    navigate(RoutePath.PAYMENT_CHANNEL_NEW);
  };

  const handleDelete = async (item: PaymentChannel) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_PAYMENT_CHANNEL}/${item.id}`, {
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
      <Title titleText="Payment Channel Management" />
      <Box sx={{ px: 3, pt: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewPaymentChannel}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}>
          New Payment Channel
        </Button>
      </Box>
      <Box sx={{ flex: 1, mt: 2, mx: 3, mb: 3, minHeight: 0 }}>
        <TableData<PaymentChannel>
          url={API_PAYMENT_CHANNEL}
          columns={PaymentChannelColumn}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          dataKey="id"
          disabled={loading}
          refreshKey={refreshKey}
          responseKey="paymentChannels"
        />
      </Box>
      <DialogModal open={successModal.open} onClose={() => setSuccessModal({ open: false, message: '' })}
        title="Success" message={successModal.message} />
      <DialogModal open={errorModal.open} onClose={() => setErrorModal({ open: false, message: '' })}
        title="Error" message={errorModal.message} />
    </Box>
  );
}

export default PaymentChannelPage;
