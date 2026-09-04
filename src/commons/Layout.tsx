import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ width: '80%', height: '100vh', overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
