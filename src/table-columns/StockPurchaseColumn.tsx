import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const StockPurchaseColumn: Column[] = [
  {
    columName: 'purchase_date',
    columnType: ColumnType.DATE,
    label: 'Purchase Date',
    alignment: 'Left',
  },
  {
    columName: 'status',
    columnType: ColumnType.TEXT,
    label: 'Status',
    alignment: 'Left',
  },
  {
    columName: 'created_at',
    columnType: ColumnType.DATE,
    label: 'Created At',
    alignment: 'Left',
  },
  {
    columName: 'action',
    columnType: ColumnType.ACTION,
    label: 'Action',
    alignment: 'Right',
    option: {
      detail: true,
      edit: true,
      delete: true,
    },
  },
];

export default StockPurchaseColumn;
