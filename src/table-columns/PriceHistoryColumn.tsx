import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const PriceHistoryColumn: Column[] = [
  {
    columName: 'cogs',
    columnType: ColumnType.CURRENCY,
    label: 'COGS',
    alignment: 'Right',
    flex: 1.5,
  },
  {
    columName: 'sellingPrice',
    columnType: ColumnType.CURRENCY,
    label: 'Selling Price',
    alignment: 'Right',
    flex: 1.5,
  },
  {
    columName: 'validFrom',
    columnType: ColumnType.DATE,
    label: 'Valid From',
    alignment: 'Left',
    flex: 1.5,
  },
  {
    columName: 'validTo',
    columnType: ColumnType.DATE,
    label: 'Valid To',
    alignment: 'Left',
    flex: 1.5,
  },
];

export default PriceHistoryColumn;
