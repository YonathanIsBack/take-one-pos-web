import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimeInformation from '../../commons/TimeInformation';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_DISTRICT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface DistrictDetail {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

function DistrictDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [district, setDistrict] = useState<DistrictDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(`${API_DISTRICT}/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.DISTRICT);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setDistrict(data.district);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.DISTRICT);
      });
  }, [id, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="District Detail" />
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
              {district?.name}
            </Typography>

            <TimeInformation
              createdAt={district?.createdAt ?? ''}
              updatedAt={district?.updatedAt ?? null}
            />
          </>
        )}
      </Box>
    </Box>
  );
}

export default DistrictDetailPage;
