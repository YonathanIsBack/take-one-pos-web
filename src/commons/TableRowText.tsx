import { SxProps, TableCell } from '@mui/material';

interface TableRowTextProps {
  value: string;
  alignment?: 'left' | 'right' | 'center';
  sx?: SxProps;
}

function TableRowText({ value, alignment = 'left', sx }: TableRowTextProps) {
  return <TableCell align={alignment} sx={sx}>{value}</TableCell>;
}

export default TableRowText;
