import { Checkbox, SxProps, TableCell } from '@mui/material';

interface TableRowChecklistProps {
  checked: boolean;
  onChange: () => void;
  sx?: SxProps;
}

function TableRowChecklist({ checked, onChange, sx }: TableRowChecklistProps) {
  return (
    <TableCell sx={sx}>
      <Checkbox checked={checked} onChange={onChange} size="small" />
    </TableCell>
  );
}

export default TableRowChecklist;
