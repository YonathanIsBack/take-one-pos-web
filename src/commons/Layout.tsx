import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ width: '75%', p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
