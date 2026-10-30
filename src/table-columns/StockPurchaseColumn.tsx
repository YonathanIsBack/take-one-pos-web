import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const StockPurchaseColumn: Column[] = [
  {
    columName: 'purchaseDate',
    columnType: ColumnType.DATE,
    label: 'Purchase Date',
    alignment: 'Left',
    flex: 2,
  },
  {
    columName: 'status',
    columnType: ColumnType.TEXT,
    label: 'Status',
    alignment: 'Left',
    flex: 2,
  },
  {
    columName: 'createdAt',
    columnType: ColumnType.DATE,
    label: 'Created At',
    alignment: 'Left',
    flex: 2,
  },
  {
    columName: 'action',
    columnType: ColumnType.ACTION,
    label: 'Action',
    alignment: 'Right',
    flex: 1,
    option: (stockPurchase) => ({
      detail: true,
      edit: stockPurchase.status === 'CREATED',
      delete: stockPurchase.status === 'CREATED',
    }),
  },
];

export default StockPurchaseColumn;
