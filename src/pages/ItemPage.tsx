import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import TableData from '../commons/TableData'
import Title from '../commons/Title'
import { Item } from '../constants/Type'
import { API_ITEM } from '../constants/Url'
import ItemColumn from '../table-columns/ItemColumns'

function ItemPage() {
  const navigate = useNavigate()

  const handleDetail = (item: Item) => {
    navigate(`/item/${item.id}`)
  }

  const handleEdit = (item: Item) => {
    navigate(`/item/${item.id}?action=EDIT`)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title titleText="Item Management" />
      <TableData<Item>
        url={API_ITEM}
        columns={ItemColumn}
        onDetail={handleDetail}
        onEdit={handleEdit}
        dataKey="id"
      />
    </Box>
  )
}

export default ItemPage
