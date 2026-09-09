import SaveIcon from '@mui/icons-material/Save';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
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
import TimeInformation from '../../commons/TimeInformation';
import Title from '../../commons/Title';
import { API_SALES, API_ITEM, BASE_API_URL } from '../../constants/Url';
import getSalesItemColumns from '../../table-columns/SalesItemColumn';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface SaleDetail {
  id: number;
  orderDate: string;
  paymentDate: string;
  deliveryDate: string;
  customerName: string;
  address: string;
  status: string;
  rowversion: number;
  createdAt: string;
  updatedAt: string | null;
}

interface SaleOperation {
  operationName: string;
  operationDisplayName: string;
}

interface ItemOption {
  id: number;
  name: string;
}

interface SaleItem {
  [key: string]: unknown;
  id: number;
  saleId: number;
  itemId: number;
  price: number;
  quantity: number;
  discount: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string | null;
  item: {
    name: string;
  };
}

function SalesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<SaleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [operations, setOperations] = useState<SaleOperation[]>([]);
  const [confirmOperation, setConfirmOperation] = useState<SaleOperation | null>(null);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [tabValue, setTabValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemOption | null>(null);
  const [itemForm, setItemForm] = useState({ price: '', quantity: '1', discount: '0' });
  const [editingDetailId, setEditingDetailId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<SaleItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const totalPrice = (parseFloat(itemForm.price || '0') * parseInt(itemForm.quantity || '0')) - parseFloat(itemForm.discount || '0');

  useEffect(() => {
    fetchWithAuth(`${API_SALES}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setSale(data.sales);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch sale:', error);
        setLoading(false);
      });
  }, [id, refreshKey]);

  useEffect(() => {
    fetchWithAuth(`${API_SALES}/${id}/operation`)
      .then((response) => response.json())
      .then((data) => {
        setOperations(data.operations);
      })
      .catch((error) => {
        console.error('Failed to fetch operations:', error);
      });
  }, [id, refreshKey]);

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

  useEffect(() => {
    if (selectedItem) {
      fetchWithAuth(`${API_ITEM}/${selectedItem.id}`)
        .then((response) => response.json())
        .then((data) => {
          setItemForm((prev) => ({ ...prev, price: String(data.item.price?.sellingPrice ?? 0) }));
        })
        .catch((error) => {
          console.error('Failed to fetch item price:', error);
        });
    }
  }, [selectedItem]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  };

  const handleEdit = async (saleItem: SaleItem) => {
    setSelectedItem({ id: saleItem.itemId, name: saleItem.item.name });
    setItemForm({
      price: String(saleItem.price),
      quantity: String(saleItem.quantity),
      discount: String(saleItem.discount),
    });
    setEditingDetailId(saleItem.id);
    setShowForm(true);
  };

  const handleDelete = async (saleItem: SaleItem) => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_SALES}/${id}/item/${saleItem.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessModal({ open: true, message: data.message });
        setRefreshKey((prev) => prev + 1);
      } else {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
      }
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDetail = async (saleItem: SaleItem) => {
    setDetailLoading(true);
    try {
      const response = await fetchWithAuth(`${API_SALES}/${id}/item/${saleItem.id}`);
      const data = await response.json();
      setSelectedDetail(data.salesItem);
    } catch (error) {
      console.error('Failed to fetch sales item detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSubmitItem = async () => {
    setSubmitting(true);
    try {
      const url = editingDetailId
        ? `${API_SALES}/${id}/item/${editingDetailId}`
        : `${API_SALES}/${id}/item`;
      const response = await fetchWithAuth(url, {
        method: editingDetailId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: selectedItem?.id,
          price: parseFloat(itemForm.price),
          quantity: parseInt(itemForm.quantity),
          discount: parseFloat(itemForm.discount),
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }

      setShowForm(false);
      setSelectedItem(null);
      setItemForm({ price: '', quantity: '1', discount: '0' });
      setEditingDetailId(null);
      setRefreshKey((prev) => prev + 1);
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOperation = async (operationName: string) => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_SALES}/${id}/operation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowversion: sale?.rowversion, operationName }),
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
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Sales Detail" />
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
                Customer Name
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {sale?.customerName ?? '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Address
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {sale?.address ?? '-'}
              </Typography>

              <Divider sx={{ my: 3 }}>
                <Typography variant="overline" sx={{ px: 1, color: 'grey.600' }}>
                  Sales Information
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                    Order Date
                  </Typography>
                  <Typography variant="body1">
                    {sale?.orderDate ? new Date(sale.orderDate).toLocaleDateString() : '-'}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                    Payment Date
                  </Typography>
                  <Typography variant="body1">
                    {sale?.paymentDate ? new Date(sale.paymentDate).toLocaleDateString() : '-'}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                    Delivery Date
                  </Typography>
                  <Typography variant="body1">
                    {sale?.deliveryDate ? new Date(sale.deliveryDate).toLocaleDateString() : '-'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                    Total Item
                  </Typography>
                  <Typography variant="body1">0</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                    Total Discount
                  </Typography>
                  <Typography variant="body1">0</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                    Total Price
                  </Typography>
                  <Typography variant="body1">0</Typography>
                </Box>
              </Box>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Status
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {sale?.status ?? '-'}
              </Typography>

              <TimeInformation
                createdAt={sale?.createdAt ?? ''}
                updatedAt={sale?.updatedAt ?? null}
              />

              {operations.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Operations
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {operations.map((operation) => (
                      <Button
                        key={operation.operationName}
                        variant="contained"
                        onClick={() => setConfirmOperation(operation)}
                        disabled={submitting}
                        sx={{ bgcolor: 'var(--color-primary)', '&:hover': { bgcolor: 'var(--color-primary-hover)' } }}
                      >
                        {operation.operationDisplayName}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
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
                      Price
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {selectedDetail.price ?? '-'}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                      Quantity
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {selectedDetail.quantity}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                      Discount
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {selectedDetail.discount ?? 0}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                      Total Price
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {selectedDetail.totalPrice ?? 0}
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
            ) : showForm ? (
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
                  label="Price"
                  name="price"
                  type="number"
                  value={itemForm.price}
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
                    label="Discount"
                    name="discount"
                    type="number"
                    value={itemForm.discount}
                    onChange={handleFormChange}
                    disabled={submitting}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Total Price"
                    value={totalPrice}
                    disabled
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSubmitItem}
                      disabled={submitting}
                      sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedItem(null);
                      setItemForm({ price: '', quantity: '1', discount: '0' });
                      setEditingDetailId(null);
                    }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  {sale?.status === 'CREATED' && (
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() => {
                          setEditingDetailId(null);
                          setShowForm(true);
                        }}
                        sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
                      >
                        New Item
                      </Button>
                    </Box>
                  )}
                  <TableData<SaleItem>
                    url={`${API_SALES}/${id}/item`}
                    columns={getSalesItemColumns(sale?.status ?? '')}
                    dataKey="id"
                    responseKey="salesItem"
                    onDetail={handleDetail}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    refreshKey={refreshKey}
                  />
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      <Dialog open={confirmOperation !== null} onClose={() => setConfirmOperation(null)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirmOperation?.operationDisplayName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setConfirmOperation(null)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (confirmOperation) {
                handleOperation(confirmOperation.operationName);
                setConfirmOperation(null);
              }
            }}
            disabled={submitting}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <DialogModal
        open={errorModal.open}
        onClose={() => setErrorModal({ open: false, message: '' })}
        title="Error"
        message={errorModal.message}
      />

      <DialogModal
        open={successModal.open}
        onClose={() => setSuccessModal({ open: false, message: '' })}
        title="Success"
        message={successModal.message}
      />
    </Box>
  );
}

export default SalesDetailPage;
