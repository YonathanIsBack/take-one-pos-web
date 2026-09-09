import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { Sale } from '../../constants/Type';
import { API_SALES } from '../../constants/Url';
import SalesColumn from '../../table-columns/SalesColumns';

function SalesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleDetail = (sale: Sale) => {
    navigate(RoutePath.SALES_DETAIL(sale.id));
  };

  const handleEdit = (sale: Sale) => {
    navigate(RoutePath.SALES_EDIT(sale.id));
  };

  const handleNewSales = () => {
    navigate(RoutePath.SALES_NEW);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Sales" />
      <Box sx={{ px: 3, pt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewSales}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
        >
          New Sales
        </Button>
      </Box>
      <Box sx={{ flex: 1, mt: 2, mx: 3, mb: 3, minHeight: 0 }}>
        <TableData<Sale>
          url={API_SALES}
          columns={SalesColumn}
          onDetail={handleDetail}
          onEdit={handleEdit}
          dataKey="id"
          disabled={loading}
          refreshKey={refreshKey}
          responseKey="sales"
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

export default SalesPage;
