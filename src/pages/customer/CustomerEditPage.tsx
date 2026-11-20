import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_CITY, API_CUSTOMER, API_DISTRICT, API_SUB_DISTRICT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';
import CustomerFormFields, { CustomerForm } from './CustomerFormFields';

function CustomerEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<CustomerForm>({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    fullTextAddress: '',
    cityId: null,
    districtId: null,
    subDistrictId: null,
  });
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [subDistricts, setSubDistricts] = useState<
    { id: number; name: string; postCode: string | null }[]
  >([]);
  const [rowversion, setRowversion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchWithAuth(`${API_CUSTOMER}/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.CUSTOMER);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          const customer = data.customer;
          setForm({
            firstName: customer.firstName,
            middleName: customer.middleName ?? '',
            lastName: customer.lastName ?? '',
            phoneNumber: customer.phoneNumber ?? '',
            email: customer.email ?? '',
            fullTextAddress: customer.fullTextAddress ?? '',
            cityId: customer.cityId,
            districtId: customer.districtId,
            subDistrictId: customer.subDistrictId,
          });
          setRowversion(customer.rowversion);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.CUSTOMER);
      });
  }, [id, navigate]);

  useEffect(() => {
    fetchWithAuth(`${API_CITY}?limit=100`)
      .then((response) => response.json())
      .then((data) => setCities(data.cities ?? []))
      .catch(() => {});
    fetchWithAuth(`${API_DISTRICT}?limit=100`)
      .then((response) => response.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(() => {});
    fetchWithAuth(`${API_SUB_DISTRICT}?limit=100`)
      .then((response) => response.json())
      .then((data) => setSubDistricts(data.subDistricts ?? []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_CUSTOMER}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          middleName: form.middleName || null,
          lastName: form.lastName || null,
          phoneNumber: form.phoneNumber || null,
          email: form.email || null,
          fullTextAddress: form.fullTextAddress || null,
          cityId: form.cityId,
          districtId: form.districtId,
          subDistrictId: form.subDistrictId,
          rowversion,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      navigate(RoutePath.CUSTOMER_DETAIL(id!));
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Customer Edit" />
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
            <CustomerFormFields
              form={form}
              setForm={setForm}
              cities={cities}
              districts={districts}
              subDistricts={subDistricts}
              disabled={submitting}
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

export default CustomerEditPage;
