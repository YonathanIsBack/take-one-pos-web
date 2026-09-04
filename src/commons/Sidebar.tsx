import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalculateIcon from '@mui/icons-material/Calculate';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { Box, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Toolbar } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import RoutePath from '../constants/RoutePath';

const menuSections = [
  {
    title: 'Inventory',
    items: [
      { label: 'Item', path: RoutePath.ITEM, icon: <Inventory2Icon /> },
      { label: 'Stock Purchase', path: RoutePath.STOCK_PURCHASE, icon: <WarehouseIcon /> },
    ],
  },
  {
    title: 'Sales',
    items: [
      { label: 'Sales', path: RoutePath.SALES, icon: <PointOfSaleIcon /> },
      { label: 'Report', path: RoutePath.REPORT, icon: <AssessmentIcon /> },
      { label: 'HPP Calculator', path: RoutePath.HPP_CALCULATOR, icon: <CalculateIcon /> },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'User', path: RoutePath.USER, icon: <PeopleIcon /> },
    ],
  },
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
      <List
        sx={{ flex: 1, overflow: 'auto' }}
        subheader={<li />}
      >
        {menuSections.map((section) => (
          <li key={section.title}>
            <ul style={{ padding: 0, margin: 0 }}>
              <ListSubheader
                sx={{
                  bgcolor: 'var(--color-primary)',
                  color: 'var(--color-secondary)',
                  fontWeight: 'bold',
                  lineHeight: '40px',
                }}
              >
                {section.title}
              </ListSubheader>
              {section.items.map((item) => (
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
            </ul>
          </li>
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
