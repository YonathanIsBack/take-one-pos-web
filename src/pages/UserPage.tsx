import { Box, Typography } from '@mui/material';
import Title from '../commons/Title';

function UserPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="User Management" />
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography>Content goes here</Typography>
      </Box>
    </Box>
  );
}

export default UserPage;
