import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Item', path: '/item', icon: <Inventory2Icon /> },
  { label: 'User', path: '/user', icon: <PeopleIcon /> },
];

function Sidebar() {
  return (
    <Box
      sx={{
        width: '20%',
        height: '100vh',
        bgcolor: 'var(--color-primary)',
        color: 'var(--color-white)',
      }}
    >
      <Toolbar />
      <List>
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
    </Box>
  );
}

export default Sidebar;
