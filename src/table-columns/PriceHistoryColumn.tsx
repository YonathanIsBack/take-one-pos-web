import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const PriceHistoryColumn: Column[] = [
  {
    columName: 'cogs',
    columnType: ColumnType.CURRENCY,
    label: 'COGS',
    alignment: 'Right',
  },
  {
    columName: 'selling_price',
    columnType: ColumnType.CURRENCY,
    label: 'Selling Price',
    alignment: 'Right',
  },
  {
    columName: 'valid_from',
    columnType: ColumnType.DATE,
    label: 'Valid From',
    alignment: 'Left',
  },
  {
    columName: 'valid_to',
    columnType: ColumnType.DATE,
    label: 'Valid To',
    alignment: 'Left',
  },
];

export default PriceHistoryColumn;
