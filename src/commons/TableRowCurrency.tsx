import { SxProps, TableCell } from '@mui/material';
import formatToCurrency from '../utils/formatToCurrency';

interface TableRowCurrencyProps {
  value: string | number;
  sx?: SxProps;
}

function TableRowCurrency({ value, sx }: TableRowCurrencyProps) {
  return <TableCell align="right" sx={sx}>{formatToCurrency(value)}</TableCell>;
}

export default TableRowCurrency;
