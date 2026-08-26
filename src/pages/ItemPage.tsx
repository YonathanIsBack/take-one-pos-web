import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { API_ITEM } from '../constants/Url'
import { Item } from '../constants/Type'

function ItemPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(API_ITEM)
      .then((response) => response.json())
      .then((data) => {
        setItems(data.items)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to fetch items:', error)
        setLoading(false)
      })
  }, [])

  const handleDetail = (id: number) => {
    navigate(`/item/${id}`)
  }

  const handleEdit = (id: number) => {
    navigate(`/item/${id}?action=EDIT`)
  }

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Item Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleDetail(item.id)}
                    sx={{ mr: 1 }}
                  >
                    Detail
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ItemPage
