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
    columName: 'sellingPrice',
    columnType: ColumnType.CURRENCY,
    label: 'Selling Price',
    alignment: 'Right',
  },
  {
    columName: 'validFrom',
    columnType: ColumnType.DATE,
    label: 'Valid From',
    alignment: 'Left',
  },
  {
    columName: 'validTo',
    columnType: ColumnType.DATE,
    label: 'Valid To',
    alignment: 'Left',
  },
];

export default PriceHistoryColumn;
