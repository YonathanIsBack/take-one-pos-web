import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { Category } from '../../constants/Type';
import { API_CATEGORY } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';
import CategoryColumn from '../../table-columns/CategoryColumns';

function CategoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const handleDetail = (item: Category) => {
    navigate(RoutePath.CATEGORY_DETAIL(item.id));
  };

  const handleEdit = (item: Category) => {
    navigate(RoutePath.CATEGORY_EDIT(item.id));
  };

  const handleNewCategory = () => {
    navigate(RoutePath.CATEGORY_NEW);
  };

  const handleDelete = async (item: Category) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_CATEGORY}/${item.id}`, {
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
      <Title titleText="Category Management" />
      <Box sx={{ px: 3, pt: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewCategory}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}>
          New Category
        </Button>
      </Box>
      <Box sx={{ flex: 1, mt: 2, mx: 3, mb: 3, minHeight: 0 }}>
        <TableData<Category>
          url={API_CATEGORY}
          columns={CategoryColumn}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          dataKey="id"
          disabled={loading}
          refreshKey={refreshKey}
          responseKey='categories'
        />
      </Box>
      <DialogModal open={successModal.open} onClose={() => setSuccessModal({ open: false, message: '' })}
        title="Success" message={successModal.message} />
      <DialogModal open={errorModal.open} onClose={() => setErrorModal({ open: false, message: '' })}
        title="Error" message={errorModal.message} />
    </Box>
  );
}

export default CategoryPage;
