import { useParams, useSearchParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import Title from '../commons/Title'

function ItemEditPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const action = searchParams.get('action')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Item Edit" />
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography>Item ID: {id}</Typography>
        <Typography>Action: {action}</Typography>
      </Box>
    </Box>
  )
}

export default ItemEditPage
