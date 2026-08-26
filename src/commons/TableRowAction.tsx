import { Button, TableCell } from '@mui/material'

interface TableRowActionProps {
  detail?: boolean
  edit?: boolean
  delete?: boolean
  onDetail?: () => void
  onEdit?: () => void
  onDelete?: () => void
  alignment?: 'left' | 'right' | 'center'
}

function TableRowAction({
  detail,
  edit,
  delete: deleteAction,
  onDetail,
  onEdit,
  onDelete,
  alignment = 'right',
}: TableRowActionProps) {
  return (
    <TableCell align={alignment}>
      {detail && (
        <Button variant="contained" size="small" onClick={onDetail} sx={{ mr: 1 }}>
          Detail
        </Button>
      )}
      {edit && (
        <Button variant="outlined" size="small" onClick={onEdit} sx={{ mr: deleteAction ? 1 : 0 }}>
          Edit
        </Button>
      )}
      {deleteAction && (
        <Button variant="outlined" color="error" size="small" onClick={onDelete}>
          Delete
        </Button>
      )}
    </TableCell>
  )
}

export default TableRowAction
