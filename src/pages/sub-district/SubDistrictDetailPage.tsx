import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimeInformation from '../../commons/TimeInformation';
import Title from '../../commons/Title';
import RoutePath from '../../constants/RoutePath';
import { API_DISTRICT, API_SUB_DISTRICT } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface SubDistrictDetail {
  id: number;
  districtId: number;
  postCode: string | null;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

function SubDistrictDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subDistrict, setSubDistrict] = useState<SubDistrictDetail | null>(null);
  const [districtName, setDistrictName] = useState('-');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(`${API_SUB_DISTRICT}/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.SUB_DISTRICT);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setSubDistrict(data.subDistrict);
          fetchWithAuth(`${API_DISTRICT}/${data.subDistrict.districtId}`)
            .then((response) => response.json())
            .then((districtData) => setDistrictName(districtData.district?.name ?? '-'))
            .catch(() => {});
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.SUB_DISTRICT);
      });
  }, [id, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Sub District Detail" />
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
              {subDistrict?.name}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              District
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {districtName}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Post Code
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {subDistrict?.postCode || '-'}
            </Typography>

            <TimeInformation
              createdAt={subDistrict?.createdAt ?? ''}
              updatedAt={subDistrict?.updatedAt ?? null}
            />
          </>
        )}
      </Box>
    </Box>
  );
}

export default SubDistrictDetailPage;
