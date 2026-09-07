import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_SALES } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

function SalesFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    orderDate: dayjs(),
    customerName: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(API_SALES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderDate: form.orderDate?.toISOString(),
          customerName: form.customerName,
          address: form.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }

      navigate(RoutePath.SALES);
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="New Sales" />
      <Box sx={{ p: 3, position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <DatePicker
          label="Order Date"
          value={form.orderDate}
          onChange={(newValue) => setForm({ ...form, orderDate: newValue })}
          disabled={loading}
          sx={{ mb: 2, width: '100%' }}
        />
        <TextField
          fullWidth
          label="Customer Name"
          name="customerName"
          value={form.customerName}
          onChange={handleTextChange}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={form.address}
          onChange={handleTextChange}
          disabled={loading}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={loading}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
        >
          Save
        </Button>
      </Box>

      <DialogModal
        open={errorModal.open}
        onClose={() => setErrorModal({ open: false, message: '' })}
        title="Error"
        message={errorModal.message}
      />
    </Box>
  );
}

export default SalesFormPage;
