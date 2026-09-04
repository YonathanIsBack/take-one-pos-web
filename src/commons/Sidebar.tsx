import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import { Box, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import RoutePath from '../constants/RoutePath';

const menuItems = [
  { label: 'Item', path: '/item', icon: <Inventory2Icon /> },
  { label: 'User', path: '/user', icon: <PeopleIcon /> },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('displayName');
    navigate(RoutePath.LOGIN);
  };

  return (
    <Box
      sx={{
        width: '20%',
        height: '100vh',
        bgcolor: 'var(--color-primary)',
        color: 'var(--color-white)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar />
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              '&.active': { bgcolor: 'var(--color-primary-hover)' },
              '&:hover': { bgcolor: 'var(--color-primary-hover)' },
            }}
          >
            <ListItemIcon sx={{ color: 'var(--color-secondary)' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ borderColor: 'var(--color-primary-hover)' }} />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton sx={{ color: 'var(--color-secondary)' }}>
          <SettingsIcon />
        </IconButton>
        <IconButton onClick={handleLogout} sx={{ color: 'var(--color-secondary)' }}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Sidebar;
