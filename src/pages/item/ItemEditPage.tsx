import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_ITEM, BASE_API_URL } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

function ItemEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState({ name: '' });
  const [rowversion, setRowversion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchWithAuth(`${BASE_API_URL}/items/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.ITEM);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setItem({ name: data.item.name });
          setRowversion(data.item.rowversion);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.ITEM);
      });
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_ITEM}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: item.name, rowversion }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }

      navigate(RoutePath.ITEM_DETAIL(id));
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Item Edit" />
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
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={item.name}
              onChange={handleChange}
              disabled={submitting}
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

export default ItemEditPage;
