import { TableCell } from '@mui/material';

interface TableRowDateProps {
  value: string;
  format?: string;
  alignment?: 'left' | 'right' | 'center';
}

function TableRowDate({ value, format = 'MM/DD/YYYY', alignment = 'left' }: TableRowDateProps) {
  const date = new Date(value);

  const formattedDate = format
    .replace('YYYY', date.getFullYear().toString())
    .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
    .replace('DD', date.getDate().toString().padStart(2, '0'));

  return <TableCell align={alignment}>{formattedDate}</TableCell>;
}

export default TableRowDate;
