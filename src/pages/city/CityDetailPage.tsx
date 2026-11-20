import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimeInformation from '../../commons/TimeInformation';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_CITY } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface CityDetail {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

function CityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [city, setCity] = useState<CityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(`${API_CITY}/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.CITY);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setCity(data.city);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.CITY);
      });
  }, [id, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="City Detail" />
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
              {city?.name}
            </Typography>

            <TimeInformation createdAt={city?.createdAt ?? ''} updatedAt={city?.updatedAt ?? null} />
          </>
        )}
      </Box>
    </Box>
  );
}

export default CityDetailPage;
