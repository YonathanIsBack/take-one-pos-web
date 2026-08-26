import { useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import Title from '../commons/Title'

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Item Detail" />
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography>Item ID: {id}</Typography>
      </Box>
    </Box>
  )
}

export default ItemDetailPage
