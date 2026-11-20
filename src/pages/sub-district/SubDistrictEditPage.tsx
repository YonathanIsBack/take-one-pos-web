import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_DISTRICT, API_SUB_DISTRICT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface DistrictOption {
  id: number;
  name: string;
}

function SubDistrictEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', postCode: '' });
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictOption | null>(null);
  const [rowversion, setRowversion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchWithAuth(`${API_SUB_DISTRICT}/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.SUB_DISTRICT);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setForm({ name: data.subDistrict.name, postCode: data.subDistrict.postCode ?? '' });
          setRowversion(data.subDistrict.rowversion);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.SUB_DISTRICT);
      });
  }, [id, navigate]);

  useEffect(() => {
    fetchWithAuth(API_DISTRICT)
      .then((response) => response.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDistrict && districts.length > 0) {
      fetchWithAuth(`${API_SUB_DISTRICT}/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const districtId = data.subDistrict?.districtId;
          const match = districts.find((district) => district.id === districtId);
          if (match) {
            setSelectedDistrict(match);
          }
        })
        .catch(() => {});
    }
  }, [districts, selectedDistrict, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_SUB_DISTRICT}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          districtId: selectedDistrict?.id ?? null,
          postCode: form.postCode || null,
          name: form.name,
          rowversion,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      navigate(RoutePath.SUB_DISTRICT_DETAIL(id!));
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Sub District Edit" />
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
              value={form.name}
              onChange={handleChange}
              disabled={submitting}
              sx={{ mb: 2 }}
            />
            <Autocomplete
              options={districts}
              getOptionLabel={(option) => option.name}
              value={selectedDistrict}
              onChange={(_event, newValue) => setSelectedDistrict(newValue)}
              disabled={submitting}
              sx={{ mb: 2 }}
              renderInput={(params) => <TextField {...params} label="District" />}
            />
            <TextField
              fullWidth
              label="Post Code"
              name="postCode"
              value={form.postCode}
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

export default SubDistrictEditPage;
