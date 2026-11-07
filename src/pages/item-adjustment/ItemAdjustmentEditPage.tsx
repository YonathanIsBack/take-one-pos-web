import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress, Skeleton, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePickerField from '../../commons/DatePickerField';
import DialogModal from '../../commons/DialogModal';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_ITEM_ADJUSTMENT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

function ItemAdjustmentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    adjustmentDate: null as dayjs.Dayjs | null,
    reason: '',
  });
  const [rowversion, setRowversion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchWithAuth(`${API_ITEM_ADJUSTMENT}/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.ITEM_ADJUSTMENT);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          const itemAdjustment = data.itemAdjustment;
          setForm({
            adjustmentDate: itemAdjustment.adjustmentDate
              ? dayjs(itemAdjustment.adjustmentDate)
              : null,
            reason: itemAdjustment.reason,
          });
          setRowversion(itemAdjustment.rowversion);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.ITEM_ADJUSTMENT);
      });
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_ITEM_ADJUSTMENT}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adjustmentDate: form.adjustmentDate?.toISOString(),
          reason: form.reason,
          rowversion,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      navigate(RoutePath.ITEM_ADJUSTMENT_DETAIL(id!));
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Item Adjustment Edit" />
      <Box sx={{ p: 3, position: 'relative' }}>
        {loading ? (
          <>
            <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
          </>
        ) : (
          <>
            {submitting && (
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
              disabled={submitting}
              sx={{ mb: 2, width: '100%' }}
            />
            <TextField
              fullWidth
              label="Reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              disabled={submitting}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
            >
              Save
            </Button>
          </>
        )}
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

export default ItemAdjustmentEditPage;
