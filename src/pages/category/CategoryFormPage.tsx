import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_CATEGORY } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

function CategoryFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(API_CATEGORY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      navigate(RoutePath.CATEGORY);
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="New Category" />
      <Box sx={{ p: 3, position: 'relative' }}>
        {loading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 10 }}>
            <CircularProgress />
          </Box>
        )}
        <TextField fullWidth label="Name" name="name" value={form.name}
          onChange={handleChange} disabled={loading} sx={{ mb: 2 }} />
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSubmit}
          disabled={loading} sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}>
          Save
        </Button>
      </Box>
      <DialogModal open={errorModal.open} onClose={() => setErrorModal({ open: false, message: '' })}
        title="Error" message={errorModal.message} />
    </Box>
  );
}

export default CategoryFormPage;
