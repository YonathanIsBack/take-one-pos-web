import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { BASE_API_URL } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

function StockPurchaseEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [purchaseDate, setPurchaseDate] = useState<dayjs.Dayjs | null>(null);
  const [rowversion, setRowversion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchWithAuth(`${BASE_API_URL}/stock-purchase/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.STOCK_PURCHASE);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setPurchaseDate(
            data.stockPurchase.purchaseDate ? dayjs(data.stockPurchase.purchaseDate) : null,
          );
          setRowversion(data.stockPurchase.rowversion);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.STOCK_PURCHASE);
      });
  }, [id, navigate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${BASE_API_URL}/stock-purchase/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseDate: purchaseDate?.toISOString(),
          rowversion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }

      navigate(RoutePath.STOCK_PURCHASE_DETAIL(id!));
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Stock Purchase Edit" />
      <Box sx={{ p: 3, position: 'relative' }}>
        {loading ? (
          <CircularProgress />
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
            <DatePicker
              label="Purchase Date"
              value={purchaseDate}
              onChange={(newValue) => setPurchaseDate(newValue)}
              disabled={submitting}
              sx={{ mb: 2, width: '100%' }}
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

export default StockPurchaseEditPage;
