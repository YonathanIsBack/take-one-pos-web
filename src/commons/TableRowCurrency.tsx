import { TableCell } from '@mui/material';

interface TableRowCurrencyProps {
  value: string | number;
}

function TableRowCurrency({ value }: TableRowCurrencyProps) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return <TableCell align="right">-</TableCell>;
  }

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(numericValue);

  return <TableCell align="right">{formatted}</TableCell>;
}

export default TableRowCurrency;
