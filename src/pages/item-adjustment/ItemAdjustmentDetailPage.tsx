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
  MenuItem,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuditTrailTable from '../../commons/AuditTrailTable';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import TimeInformation from '../../commons/TimeInformation';
import Title from '../../commons/Title';
import { API_ITEM, API_ITEM_ADJUSTMENT } from '../../constants/Url';
import { ItemAdjustmentDetail } from '../../constants/Type';
import getItemAdjustmentDetailColumns from '../../table-columns/ItemAdjustmentDetailColumns';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface ItemAdjustmentHeader {
  id: number;
  adjustmentDate: string;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  rowversion: number;
}

interface ItemOption {
  id: number;
  name: string;
}

interface ItemAdjustmentOperation {
  operationName: string;
  operationDisplayName: string;
}

function ItemAdjustmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [itemAdjustment, setItemAdjustment] = useState<ItemAdjustmentHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemOption | null>(null);
  const [itemForm, setItemForm] = useState({ adjustmentType: '1', quantity: '1' });
  const [selectedDetail, setSelectedDetail] = useState<ItemAdjustmentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingDetailId, setEditingDetailId] = useState<number | null>(null);
  const [editingRowVersion, setEditingRowVersion] = useState<number | null>(null);
  const [operations, setOperations] = useState<ItemAdjustmentOperation[]>([]);
  const [confirmOperation, setConfirmOperation] = useState<ItemAdjustmentOperation | null>(null);
  const [approveReason, setApproveReason] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const isCreated = itemAdjustment?.status === 'CREATED';

  useEffect(() => {
    fetchWithAuth(`${API_ITEM_ADJUSTMENT}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setItemAdjustment(data.itemAdjustment);
        setApproveReason(data.itemAdjustment?.reason ?? '');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch item adjustment:', error);
        setLoading(false);
      });
  }, [id, refreshKey]);

  useEffect(() => {
    fetchWithAuth(`${API_ITEM_ADJUSTMENT}/${id}/operation`)
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
      fetchWithAuth(API_ITEM)
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  };

  const handleOperation = async (operationName: string, reason: string) => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_ITEM_ADJUSTMENT}/${id}/operation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rowversion: itemAdjustment?.rowversion,
          operationName,
          additionalInformation: { reason },
        }),
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

  const handleDetail = async (detail: ItemAdjustmentDetail) => {
    setDetailLoading(true);
    try {
      const response = await fetchWithAuth(`${API_ITEM_ADJUSTMENT}/${id}/detail/${detail.id}`);
      const data = await response.json();
      setSelectedDetail(data.detail);
    } catch (error) {
      console.error('Failed to fetch item adjustment detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEdit = (detail: ItemAdjustmentDetail) => {
    setSelectedItem({ id: detail.itemId, name: detail.item?.name ?? '' });
    setItemForm({
      adjustmentType: String(detail.adjustmentType),
      quantity: String(detail.quantity),
    });
    setEditingDetailId(detail.id);
    setEditingRowVersion(detail.rowversion);
    setShowForm(true);
  };

  const handleDelete = async (detail: ItemAdjustmentDetail) => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_ITEM_ADJUSTMENT}/${id}/detail/${detail.id}`, {
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
      setSubmitting(false);
    }
  };

  const handleSubmitItem = async () => {
    setSubmitting(true);
    try {
      const url = editingDetailId
        ? `${API_ITEM_ADJUSTMENT}/${id}/detail/${editingDetailId}`
        : `${API_ITEM_ADJUSTMENT}/${id}/detail`;
      const response = await fetchWithAuth(url, {
        method: editingDetailId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: selectedItem?.id,
          adjustmentType: Number(itemForm.adjustmentType),
          quantity: parseInt(itemForm.quantity),
          rowversion: editingRowVersion,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      setShowForm(false);
      setSelectedItem(null);
      setItemForm({ adjustmentType: '1', quantity: '1' });
      setEditingDetailId(null);
      setEditingRowVersion(null);
      setRefreshKey((prev) => prev + 1);
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Item Adjustment Detail" />
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
                Adjustment Date
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {itemAdjustment?.adjustmentDate
                  ? new Date(itemAdjustment.adjustmentDate).toLocaleDateString()
                  : '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Reason
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
                {itemAdjustment?.reason || '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Status
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {itemAdjustment?.status ?? '-'}
              </Typography>

              <TimeInformation
                createdAt={itemAdjustment?.createdAt ?? ''}
                updatedAt={itemAdjustment?.updatedAt ?? null}
              />
            </>
          )}
        </Box>

        {operations.length > 0 && (
          <Box sx={{ p: 3 }}>
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

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Items" />
            <Tab label="Audit Trail" />
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
                        Adjustment Type
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedDetail.adjustmentType === 1 ? 'ADD' : 'SUBTRACT'}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Quantity
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedDetail.quantity}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Snapshot Quantity
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedDetail.snapshotQuantity ?? '-'}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Final Quantity
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedDetail.finalQuantity ?? '-'}
                      </Typography>

                      <TimeInformation
                        createdAt={selectedDetail.createdAt}
                        updatedAt={selectedDetail.updatedAt}
                      />
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
                    select
                    label="Adjustment Type"
                    name="adjustmentType"
                    value={itemForm.adjustmentType}
                    onChange={handleFormChange}
                    disabled={submitting}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="1">ADD</MenuItem>
                    <MenuItem value="2">SUBTRACT</MenuItem>
                  </TextField>
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
                        setItemForm({ adjustmentType: '1', quantity: '1' });
                        setEditingDetailId(null);
                        setEditingRowVersion(null);
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  {isCreated && (
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() => {
                          setEditingDetailId(null);
                          setEditingRowVersion(null);
                          setShowForm(true);
                        }}
                        sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
                      >
                        New Item
                      </Button>
                    </Box>
                  )}
                  <TableData<ItemAdjustmentDetail>
                    url={`${API_ITEM_ADJUSTMENT}/${id}/detail`}
                    columns={getItemAdjustmentDetailColumns(itemAdjustment?.status ?? '')}
                    dataKey="id"
                    responseKey="details"
                    onDetail={handleDetail}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    refreshKey={refreshKey}
                  />
                </>
              )}
            </>
          )}
          {tabValue === 1 && (
            <AuditTrailTable url={`${API_ITEM_ADJUSTMENT}/${id}/audit-trail`} />
          )}
        </Box>
      </Box>

      <Dialog open={confirmOperation !== null} onClose={() => setConfirmOperation(null)} fullWidth maxWidth="sm">
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to {confirmOperation?.operationDisplayName}?
          </DialogContentText>
          <TextField
            fullWidth
            label="Reason"
            value={approveReason}
            onChange={(e) => setApproveReason(e.target.value)}
            disabled={submitting}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setConfirmOperation(null)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (confirmOperation) {
                handleOperation(confirmOperation.operationName, approveReason);
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

export default ItemAdjustmentDetailPage;
