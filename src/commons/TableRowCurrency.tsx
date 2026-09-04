import { TableCell } from '@mui/material';
import formatToCurrency from '../utils/formatToCurrency';

interface TableRowCurrencyProps {
  value: string | number;
}

function TableRowCurrency({ value }: TableRowCurrencyProps) {
  return <TableCell align="right">{formatToCurrency(value)}</TableCell>;
}

export default TableRowCurrency;
