import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePickerField from '../../commons/DatePickerField';
import DialogModal from '../../commons/DialogModal';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_ITEM_ADJUSTMENT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

function ItemAdjustmentFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    adjustmentDate: dayjs() as dayjs.Dayjs | null,
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(API_ITEM_ADJUSTMENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adjustmentDate: form.adjustmentDate?.toISOString(),
          reason: form.reason,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      navigate(RoutePath.ITEM_ADJUSTMENT_DETAIL(data.itemAdjustment.id));
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="New Item Adjustment" />
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
        <DatePickerField
          label="Adjustment Date"
          format="DD/MM/YYYY"
          value={form.adjustmentDate}
          onChange={(newValue) => setForm({ ...form, adjustmentDate: newValue })}
          disabled={loading}
          sx={{ mb: 2, width: '100%' }}
        />
        <TextField
          fullWidth
          label="Reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
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

export default ItemAdjustmentFormPage;
