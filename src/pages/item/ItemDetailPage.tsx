import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../../commons/Title';
import { BASE_API_URL } from '../../constants/Url';

interface ItemDetail {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);

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
    </Box>
  );
}

export default ItemDetailPage;
