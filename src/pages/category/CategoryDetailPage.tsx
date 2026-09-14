import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimeInformation from '../../commons/TimeInformation';
import Title from '../../commons/Title';
import { BASE_API_URL } from '../../constants/Url';
import fetchWithAuth from '../../utils/fetchWithAuth';

interface CategoryDetail {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(`${BASE_API_URL}/category/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate('/category');
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setCategory(data.category ?? data);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate('/category');
      });
  }, [id, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Category Detail" />
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
              {category?.name}
            </Typography>

            <TimeInformation
              createdAt={category?.createdAt ?? ''}
              updatedAt={category?.updatedAt ?? null}
            />
          </>
        )}
      </Box>
    </Box>
  );
}

export default CategoryDetailPage;
