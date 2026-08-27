import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import Title from '../../commons/Title';
import { API_ITEM } from '../../constants/Url';

function ItemFormPage() {
  const [item, setItem] = useState({ name: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await fetch(API_ITEM, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: item.name }),
      });
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Item Form" />
      <Box sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={item.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' } }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default ItemFormPage;
