import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress, Skeleton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_PAYMENT_CHANNEL } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

function PaymentChannelEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    channelName: '',
    accountNumber: '',
    accountHolderName: '',
  });
  const [rowversion, setRowversion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchWithAuth(`${API_PAYMENT_CHANNEL}/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.PAYMENT_CHANNEL);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          const channel = data.paymentChannel ?? data;
          setForm({
            channelName: channel.channelName,
            accountNumber: channel.accountNumber,
            accountHolderName: channel.accountHolderName,
          });
          setRowversion(channel.rowversion);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.PAYMENT_CHANNEL);
      });
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_PAYMENT_CHANNEL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rowversion }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      navigate(RoutePath.PAYMENT_CHANNEL_DETAIL(id!));
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Payment Channel Edit" />
      <Box sx={{ p: 3, position: 'relative' }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
          </>
        ) : (
          <>
            {submitting && (
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                bgcolor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center',
                alignItems: 'center', zIndex: 10 }}>
                <CircularProgress />
              </Box>
            )}
            <TextField fullWidth label="Channel Name" name="channelName" value={form.channelName}
              onChange={handleChange} disabled={submitting} sx={{ mb: 2 }} />
            <TextField fullWidth label="Account Number" name="accountNumber" value={form.accountNumber}
              onChange={handleChange} disabled={submitting} sx={{ mb: 2 }} />
            <TextField fullWidth label="Account Holder Name" name="accountHolderName" value={form.accountHolderName}
              onChange={handleChange} disabled={submitting} sx={{ mb: 2 }} />
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSubmit}
              disabled={submitting} sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}>
              Save
            </Button>
          </>
        )}
      </Box>
      <DialogModal open={errorModal.open} onClose={() => setErrorModal({ open: false, message: '' })}
        title="Error" message={errorModal.message} />
    </Box>
  );
}

export default PaymentChannelEditPage;
