import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { Customer } from '../../constants/Type';
import { API_CUSTOMER } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';
import CustomerColumn from '../../table-columns/CustomerColumns';

function CustomerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleDetail = (customer: Customer) => {
    navigate(RoutePath.CUSTOMER_DETAIL(customer.id));
  };

  const handleEdit = (customer: Customer) => {
    navigate(RoutePath.CUSTOMER_EDIT(customer.id));
  };

  const handleNewCustomer = () => {
    navigate(RoutePath.CUSTOMER_NEW);
  };

  const handleDelete = async (customer: Customer) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_CUSTOMER}/${customer.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      setSuccessModal({ open: true, message: data.message });
      setRefreshKey((prev) => prev + 1);
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Customer Management" />
      <Box sx={{ px: 3, pt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewCustomer}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
        >
          New Customer
        </Button>
      </Box>
      <Box sx={{ flex: 1, mt: 2, mx: 3, mb: 3, minHeight: 0 }}>
        <TableData<Customer>
          url={API_CUSTOMER}
          columns={CustomerColumn}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          auditTrailUrl={(customer) => `${API_CUSTOMER}/${customer.id}/audit-trail`}
          dataKey="id"
          disabled={loading}
          refreshKey={refreshKey}
          responseKey="customers"
        />
      </Box>

      <DialogModal
        open={successModal.open}
        onClose={() => setSuccessModal({ open: false, message: '' })}
        title="Success"
        message={successModal.message}
      />

      <DialogModal
        open={errorModal.open}
        onClose={() => setErrorModal({ open: false, message: '' })}
        title="Error"
        message={errorModal.message}
      />
    </Box>
  );
}

export default CustomerPage;
