import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const StockPurchaseItemColumn: Column[] = [
  {
    columName: 'item_id',
    columnType: ColumnType.TEXT,
    label: 'Item ID',
    alignment: 'Left',
  },
  {
    columName: 'quantity',
    columnType: ColumnType.TEXT,
    label: 'Quantity',
    alignment: 'Right',
  },
  {
    columName: 'price',
    columnType: ColumnType.CURRENCY,
    label: 'Price',
    alignment: 'Right',
  },
  {
    columName: 'created_at',
    columnType: ColumnType.DATE,
    label: 'Created At',
    alignment: 'Left',
  },
];

export default StockPurchaseItemColumn;
