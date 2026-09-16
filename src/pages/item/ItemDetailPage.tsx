import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DialogModal from '../../commons/DialogModal';
import TableData from '../../commons/TableData';
import TimeInformation from '../../commons/TimeInformation';
import Title from '../../commons/Title';
import { BASE_API_URL } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';
import formatToCurrency from '../../utils/formatToCurrency';
import PriceHistoryColumn from '../../table-columns/PriceHistoryColumn';
import ItemImageColumn from '../../table-columns/ItemImageColumn';

interface ItemDetail {
  id: number;
  name: string;
  category: { id: number; name: string } | Record<string, never>;
  quantityOnHand: number;
  quantityOnHold: number;
  quantitySellable: number;
  createdAt: string;
  updatedAt: string | null;
  price: {
    cogs: number;
    sellingPrice: number;
  };
}

interface PriceHistory {
  [key: string]: unknown;
  id: number;
  itemId: number;
  cogs: string;
  sellingPrice: string;
  validFrom: string;
  validTo: string;
  createdAt: string;
  updatedAt: string | null;
}

interface ItemImageDetail {
  id: number;
  itemId: number;
  filename: string;
  originalFilename: string;
  mimeType: string;
  imageSize: number;
  path: string;
  createdAt: string;
  updatedAt: string | null;
}

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });
  const [priceHistoryForm, setPriceHistoryForm] = useState({
    cogs: '',
    sellingPrice: '',
    validFrom: null as dayjs.Dayjs | null,
    validTo: null as dayjs.Dayjs | null,
  });
  const [showImageForm, setShowImageForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  const [selectedImageDetail, setSelectedImageDetail] = useState<ItemImageDetail | null>(null);
  const [imageDetailLoading, setImageDetailLoading] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);

  useEffect(() => {
    fetchWithAuth(`${BASE_API_URL}/items/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setItem(data.item);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch item:', error);
        setLoading(false);
      });
  }, [id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceHistoryForm({ ...priceHistoryForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${BASE_API_URL}/items/${id}/price/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cogs: priceHistoryForm.cogs,
          sellingPrice: priceHistoryForm.sellingPrice,
          validFrom: priceHistoryForm.validFrom?.toISOString(),
          validTo: priceHistoryForm.validTo?.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }

      setShowForm(false);
      setPriceHistoryForm({ cogs: '', sellingPrice: '', validFrom: null, validTo: null });
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (image: { id: number }) => {
    try {
      const response = await fetchWithAuth(`${BASE_API_URL}/items/${id}/image/${image.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      setImageRefreshKey((prev) => prev + 1);
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    }
  };

  const handleDetailImage = async (image: { id: number }) => {
    setImageDetailLoading(true);
    try {
      const response = await fetchWithAuth(`${BASE_API_URL}/items/${id}/image/${image.id}`);
      const data = await response.json();
      setSelectedImageDetail(data.image ?? data);
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setImageDetailLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
      const response = await fetchWithAuth(`${BASE_API_URL}/items/${id}/image`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorModal({ open: true, message: data.message || 'Something went wrong!' });
        return;
      }
      setShowImageForm(false);
      setSelectedFiles([]);
      setImageRefreshKey((prev) => prev + 1);
    } catch {
      setErrorModal({ open: true, message: 'Something went wrong!' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Item Detail" />
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
                Name
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {item?.name}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Category
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {item?.category?.name || '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Quantity On Hand
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {item?.quantityOnHand ?? '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Quantity On Hold
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {item?.quantityOnHold ?? '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Quantity Sellable
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {item?.quantitySellable ?? '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                COGS
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {formatToCurrency(item?.price?.cogs ?? 0)}
              </Typography>

              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                Selling Price
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {formatToCurrency(item?.price?.sellingPrice ?? 0)}
              </Typography>

              <TimeInformation
                createdAt={item?.createdAt ?? ''}
                updatedAt={item?.updatedAt ?? null}
              />
            </>
          )}
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Price History" />
            <Tab label="Images" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {tabValue === 0 && (
            <>
              {!showForm && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => setShowForm(true)}
                    sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
                  >
                    New Data
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
                  <TextField
                    fullWidth
                    label="Cogs"
                    name="cogs"
                    value={priceHistoryForm.cogs}
                    onChange={handleFormChange}
                    disabled={submitting}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Selling Price"
                    name="sellingPrice"
                    value={priceHistoryForm.sellingPrice}
                    onChange={handleFormChange}
                    disabled={submitting}
                    sx={{ mb: 2 }}
                  />
                  <DatePicker
                    label="Valid From"
                    value={priceHistoryForm.validFrom}
                    onChange={(newValue) =>
                      setPriceHistoryForm({ ...priceHistoryForm, validFrom: newValue })
                    }
                    disabled={submitting}
                    sx={{ mb: 2, width: '100%' }}
                  />
                  <DatePicker
                    label="Valid To"
                    value={priceHistoryForm.validTo}
                    onChange={(newValue) =>
                      setPriceHistoryForm({ ...priceHistoryForm, validTo: newValue })
                    }
                    disabled={submitting}
                    sx={{ mb: 2, width: '100%' }}
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
                <TableData<PriceHistory>
                  url={`${BASE_API_URL}/items/${id}/price/history`}
                  columns={PriceHistoryColumn}
                  dataKey="id"
                   responseKey="priceHistory"
                />
              )}
            </>
          )}
          {tabValue === 1 && (
            <>
              {selectedImageDetail ? (
                <Box>
                  {imageDetailLoading ? (
                    <CircularProgress />
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedImageDetail(null)}
                        sx={{ mb: 2 }}
                      >
                        Back to List
                      </Button>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Filename
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedImageDetail.originalFilename}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        MIME Type
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedImageDetail.mimeType}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
                        Size
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedImageDetail.imageSize} bytes
                      </Typography>

                      <Box
                        component="img"
                        src={`${BASE_API_URL}/${selectedImageDetail.path}`}
                        onClick={() => setImagePopupOpen(true)}
                        sx={{
                          maxWidth: 300,
                          maxHeight: 300,
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': { opacity: 0.8 },
                        }}
                      />

                      <TimeInformation
                        createdAt={selectedImageDetail.createdAt}
                        updatedAt={selectedImageDetail.updatedAt}
                      />
                    </>
                  )}
                </Box>
              ) : (
                <>
                  {!showImageForm && (
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={() => setShowImageForm(true)}
                        sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
                      >
                        New Image
                      </Button>
                    </Box>
                  )}

                  {showImageForm ? (
                    <Box sx={{ position: 'relative' }}>
                      {uploading && (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          bgcolor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center',
                          alignItems: 'center', zIndex: 10 }}>
                          <CircularProgress />
                        </Box>
                      )}
                      <Button variant="outlined" component="label" disabled={uploading} sx={{ mb: 2 }}>
                        Select Images
                        <input
                          type="file"
                          hidden
                          multiple
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
                        />
                      </Button>
                      {selectedFiles.length > 0 && (
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {selectedFiles.length} file(s) selected
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleImageUpload}
                          disabled={uploading || selectedFiles.length === 0}
                          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
                        >
                          Upload
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => { setShowImageForm(false); setSelectedFiles([]); }}
                          disabled={uploading}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <TableData
                      url={`${BASE_API_URL}/items/${id}/image`}
                      columns={ItemImageColumn}
                      dataKey="id"
                      responseKey="images"
                      refreshKey={imageRefreshKey}
                      onDetail={handleDetailImage}
                      onDelete={handleDeleteImage}
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

      <Dialog open={imagePopupOpen} onClose={() => setImagePopupOpen(false)} maxWidth="lg">
        <Box
          component="img"
          src={selectedImageDetail ? `${BASE_API_URL}/${selectedImageDetail.path}` : ''}
          sx={{ maxWidth: '100%', maxHeight: '80vh' }}
        />
      </Dialog>
    </Box>
  );
}

export default ItemDetailPage;
