import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_DISTRICT, API_SUB_DISTRICT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface DistrictOption {
  id: number;
  name: string;
}

function SubDistrictFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', postCode: '' });
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchWithAuth(API_DISTRICT)
      .then((response) => response.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(API_SUB_DISTRICT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          districtId: selectedDistrict?.id ?? null,
          postCode: form.postCode || null,
          name: form.name,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      navigate(RoutePath.SUB_DISTRICT_DETAIL(data.subDistrict.id));
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="New Sub District" />
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
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        <Autocomplete
          options={districts}
          getOptionLabel={(option) => option.name}
          value={selectedDistrict}
          onChange={(_event, newValue) => setSelectedDistrict(newValue)}
          disabled={loading}
          sx={{ mb: 2 }}
          renderInput={(params) => <TextField {...params} label="District" />}
        />
        <TextField
          fullWidth
          label="Post Code"
          name="postCode"
          value={form.postCode}
          onChange={handleChange}
          disabled={loading}
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

export default SubDistrictFormPage;
