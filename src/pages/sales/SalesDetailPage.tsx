import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TimeInformation from '../../commons/TimeInformation';
import Title from '../../commons/Title';
import { API_SALES } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface SaleDetail {
  id: number;
  orderDate: string;
  paymentDate: string;
  deliveryDate: string;
  customerName: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

function SalesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<SaleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(`${API_SALES}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setSale(data.sale);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch sale:', error);
        setLoading(false);
      });
  }, [id]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Sales Detail" />
      <Box sx={{ p: 3, overflow: 'auto' }}>
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
              Order Date
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {sale?.orderDate ? new Date(sale.orderDate).toLocaleDateString() : '-'}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Customer Name
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {sale?.customerName ?? '-'}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Payment Date
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {sale?.paymentDate ? new Date(sale.paymentDate).toLocaleDateString() : '-'}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Delivery Date
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {sale?.deliveryDate ? new Date(sale.deliveryDate).toLocaleDateString() : '-'}
            </Typography>

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
          </>
        )}
      </Box>
    </Box>
  );
}

export default SalesDetailPage;
