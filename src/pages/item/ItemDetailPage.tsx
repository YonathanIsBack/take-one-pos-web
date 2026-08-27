import { Box, Skeleton, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TableData from '../../commons/TableData';
import Title from '../../commons/Title';
import { BASE_API_URL } from '../../constants/Url';
import PriceHistoryColumn from '../../table-columns/PriceHistoryColumn';

interface ItemDetail {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
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

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetch(`${BASE_API_URL}/items/${id}`)
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Item Detail" />
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
            <Typography variant="h6" gutterBottom>
              Name
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {item?.name}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Created At
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
            </Typography>

            <Typography variant="h6" gutterBottom>
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
          <Tab label="Price History" />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {tabValue === 0 && (
          <TableData<PriceHistory>
            url={`${BASE_API_URL}/items/${id}/price/history`}
            columns={PriceHistoryColumn}
            dataKey="id"
            responseKey="price_history"
          />
        )}
      </Box>
    </Box>
  );
}

export default ItemDetailPage;
