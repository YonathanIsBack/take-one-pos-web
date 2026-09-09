import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, SxProps, TableCell, Tooltip } from '@mui/material';

interface TableRowActionProps {
  detail?: boolean;
  edit?: boolean;
  delete?: boolean;
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  alignment?: 'left' | 'right' | 'center';
  sx?: SxProps;
}

function TableRowAction({
  detail,
  edit,
  delete: deleteAction,
  onDetail,
  onEdit,
  onDelete,
  alignment = 'right',
  sx,
}: TableRowActionProps) {
  return (
    <TableCell align={alignment} sx={sx}>
      {detail && (
        <Tooltip title="Detail">
          <IconButton size="small" onClick={onDetail} sx={{ color: 'grey.600' }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {edit && (
        <Tooltip title="Edit">
          <IconButton size="small" onClick={onEdit} sx={{ color: 'grey.600' }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {deleteAction && (
        <Tooltip title="Delete">
          <IconButton size="small" onClick={onDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </TableCell>
  );
}

export default TableRowAction;
