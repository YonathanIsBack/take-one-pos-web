import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { Item } from '../../constants/Type';
import { API_ITEM } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';
import ItemColumn from '../../table-columns/ItemColumns';

function ItemPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleDetail = (item: Item) => {
    navigate(RoutePath.ITEM_DETAIL(item.id));
  };

  const handleEdit = (item: Item) => {
    navigate(RoutePath.ITEM_EDIT(item.id));
  };

  const handleNewItem = () => {
    navigate(RoutePath.ITEM_NEW);
  };

  const handleDelete = async (item: Item) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_ITEM}/${item.id}`, {
        method: 'DELETE',
      });

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
      <Title titleText="Item Management" />
      <Box sx={{ px: 3, py: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewItem}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
        >
          New Item
        </Button>
      </Box>
      <TableData<Item>
        url={API_ITEM}
        columns={ItemColumn}
        onDetail={handleDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        dataKey="id"
        disabled={loading}
        refreshKey={refreshKey}
      />

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

export default ItemPage;
