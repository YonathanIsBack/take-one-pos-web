import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../constants/RoutePath';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
        404
      </Typography>
      <Typography variant="h5">Page Not Found</Typography>
      <Typography variant="body1" sx={{ color: 'grey.600' }}>
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate(RoutePath.ITEM)}>
        Back to Home
      </Button>
    </Box>
  );
}

export default NotFoundPage;
