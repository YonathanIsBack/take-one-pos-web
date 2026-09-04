import { SxProps, TableCell } from '@mui/material';

interface TableRowDateProps {
  value: string;
  format?: string;
  alignment?: 'left' | 'right' | 'center';
  sx?: SxProps;
}

function TableRowDate({ value, format = 'MM/DD/YYYY', alignment = 'left', sx }: TableRowDateProps) {
  const date = new Date(value);

  const formattedDate = format
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
    .replace('DD', date.getDate().toString().padStart(2, '0'));

  return <TableCell align={alignment} sx={sx}>{formattedDate}</TableCell>;
}

export default TableRowDate;
