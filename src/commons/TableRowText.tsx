import { TableCell } from '@mui/material';

interface TableRowTextProps {
  value: string;
  alignment?: 'left' | 'right' | 'center';
}

function TableRowText({ value, alignment = 'left' }: TableRowTextProps) {
  return <TableCell align={alignment}>{value}</TableCell>;
}

export default TableRowText;
