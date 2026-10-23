import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimeInformation from '../../commons/TimeInformation';
import Title from '../../commons/Title';
import { BASE_API_URL } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface PaymentChannelDetail {
  id: number;
  channelName: string;
  accountNumber: string;
  accountHolderName: string;
  createdAt: string;
  updatedAt: string | null;
}

function PaymentChannelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<PaymentChannelDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(`${BASE_API_URL}/payment-channel/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate('/payment-channel');
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setChannel(data.paymentChannel ?? data);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate('/payment-channel');
      });
  }, [id, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Payment Channel Detail" />
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
              Channel Name
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {channel?.channelName}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Account Number
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {channel?.accountNumber}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Account Holder Name
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {channel?.accountHolderName}
            </Typography>

            <TimeInformation
              createdAt={channel?.createdAt ?? ''}
              updatedAt={channel?.updatedAt ?? null}
            />
          </>
        )}
      </Box>
    </Box>
  );
}

export default PaymentChannelDetailPage;
