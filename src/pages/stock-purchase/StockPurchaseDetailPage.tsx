import SaveIcon from '@mui/icons-material/Save';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import { BASE_API_URL } from '../../constants/Url';
import StockPurchaseItemColumn from '../../table-columns/StockPurchaseItemColumn';
import fetchWithAuth from '../../utils/fetchWithAuth';
import formatToCurrency from '../../utils/formatToCurrency';

interface StockPurchaseDetail {
  id: number;
  purchaseDate: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

interface StockPurchaseItem {
  [key: string]: unknown;
  id: number;
  stockPurchaseId: number;
  itemId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string | null;
}

interface ItemOption {
  id: number;
  name: string;
}

interface StockPurchaseItemDetail {
  buyingPrice: string;
  additionalCost: string;
  cogs: string;
  quantity: number;
  total: string;
  createdAt: string;
  updatedAt: string | null;
  item: {
    name: string;
  };
}

function StockPurchaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<StockPurchaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemOption | null>(null);
  const [itemForm, setItemForm] = useState({
    buyingPrice: '',
    additionalCost: '',
    quantity: '',
  });
  const [selectedDetail, setSelectedDetail] = useState<StockPurchaseItemDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const cogs = parseFloat(itemForm.buyingPrice || '0') + parseFloat(itemForm.additionalCost || '0');
  const total = cogs * parseInt(itemForm.quantity || '0');

  useEffect(() => {
    fetchWithAuth(`${BASE_API_URL}/stock-purchase/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setItem(data.stockPurchase);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch stock purchase:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (showForm) {
      fetchWithAuth(`${BASE_API_URL}/items`)
        .then((response) => response.json())
        .then((data) => {
          setItems(data.items);
        })
        .catch((error) => {
          console.error('Failed to fetch items:', error);
        });
    }
  }, [showForm]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDetail = async (stockPurchaseItem: StockPurchaseItem) => {
    setDetailLoading(true);
    try {
      const response = await fetchWithAuth(
        `${BASE_API_URL}/stock-purchase/${id}/detail/${stockPurchaseItem.id}`
      );
      const data = await response.json();
      setSelectedDetail(data.stockPurchaseDetail);
    } catch (error) {
      console.error('Failed to fetch stock purchase item detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${BASE_API_URL}/stock-purchase/${id}/detail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: selectedItem?.id,
          buyingPrice: parseFloat(itemForm.buyingPrice),
          additionalCost: parseFloat(itemForm.additionalCost),
          cogs,
          quantity: parseInt(itemForm.quantity),
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }

      setShowForm(false);
      setSelectedItem(null);
      setItemForm({ buyingPrice: '', additionalCost: '', quantity: '' });
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Stock Purchase Detail" />
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 3 }}>
          {loading ? (
            <>
              <Skeleton variant="text" width="30%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="25%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={30} />
            </>
          ) : (
            <>
              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Purchase Date
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {item?.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Status
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {item?.status ?? '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Created At
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Updated At
              </Typography>
              <Typography variant="body1">
                {item?.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '-'}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Items" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {tabValue === 0 && (
            <>
              {selectedDetail ? (
                <Box>
                  {detailLoading ? (
                    <CircularProgress />
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedDetail(null)}
                        sx={{ mb: 2 }}
                      >
                        Back to List
                      </Button>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Item Name
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedDetail.item?.name ?? '-'}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Buying Price
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {formatToCurrency(parseFloat(selectedDetail.buyingPrice))}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Additional Cost
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {formatToCurrency(parseFloat(selectedDetail.additionalCost))}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        COGS
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {formatToCurrency(parseFloat(selectedDetail.cogs))}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Quantity
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedDetail.quantity}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Total
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {formatToCurrency(parseFloat(selectedDetail.total))}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Created At
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedDetail.createdAt
                          ? new Date(selectedDetail.createdAt).toLocaleDateString()
                          : '-'}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Updated At
                      </Typography>
                      <Typography variant="body1">
                        {selectedDetail.updatedAt
                          ? new Date(selectedDetail.updatedAt).toLocaleDateString()
                          : '-'}
                      </Typography>
                    </>
                  )}
                </Box>
              ) : (
                <>
                  {!showForm && (
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() => setShowForm(true)}
                        sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
                      >
                        New Item
                      </Button>
                    </Box>
                  )}

                  {showForm ? (
                    <Box sx={{ position: 'relative' }}>
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
                      <Autocomplete
                        options={items}
                        getOptionLabel={(option) => option.name}
                        value={selectedItem}
                        onChange={(_event, newValue) => setSelectedItem(newValue)}
                        disabled={submitting}
                        sx={{ mb: 2 }}
                        renderInput={(params) => <TextField {...params} label="Item" />}
                      />
                      <TextField
                        fullWidth
                        label="Buying Price"
                        name="buyingPrice"
                        type="number"
                        value={itemForm.buyingPrice}
                        onChange={handleFormChange}
                        disabled={submitting}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Additional Cost"
                        name="additionalCost"
                        type="number"
                        value={itemForm.additionalCost}
                        onChange={handleFormChange}
                        disabled={submitting}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="COGS"
                        value={cogs}
                        disabled
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={itemForm.quantity}
                        onChange={handleFormChange}
                        disabled={submitting}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Total"
                        value={total}
                        disabled
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSubmit}
                          disabled={submitting}
                          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setShowForm(false)}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <TableData<StockPurchaseItem>
                      url={`${BASE_API_URL}/stock-purchase/${id}/detail`}
                      columns={StockPurchaseItemColumn}
                      dataKey="id"
                      responseKey="stockPurchaseDetail"
                      onDetail={handleDetail}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Box>
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

export default StockPurchaseDetailPage;
