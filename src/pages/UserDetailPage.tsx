import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimeInformation from '../commons/TimeInformation';
import Title from '../commons/Title';
import RoutePath from '../constants/RoutePath';
import { API_USER } from '../constants/Url';
import fetchWithAuth from '../utils/fetchWithAuth';

interface UserDetail {
  id: number;
  displayName: string;
  username: string;
  isActive: number;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string | null;
}

function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(`${API_USER}/${id}`)
      .then((response) => {
        if (response.status === 404) {
          navigate(RoutePath.USER);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setUser(data.user ?? data);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate(RoutePath.USER);
      });
  }, [id, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="User Detail" />
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
              Display Name
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {user?.displayName}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Username
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {user?.username}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Is Active
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {user?.isActive === 1 ? 'Active' : 'Inactive'}
            </Typography>

            <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
              Last Login
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}
            </Typography>

            <TimeInformation
              createdAt={user?.createdAt ?? ''}
              updatedAt={user?.updatedAt ?? null}
            />
          </>
        )}
      </Box>
    </Box>
  );
}

export default UserDetailPage;
