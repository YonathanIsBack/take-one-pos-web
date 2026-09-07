import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const StockPurchaseItemColumn: Column[] = [
  {
    columName: 'name',
    columnType: ColumnType.TEXT,
    label: 'Item Name',
    alignment: 'Left',
    parentKey: 'item',
    flex: 3,
  },
  {
    columName: 'buyingPrice',
    columnType: ColumnType.CURRENCY,
    label: 'Buying Price',
    alignment: 'Right',
    flex: 1.5,
  },
  {
    columName: 'additionalCost',
    columnType: ColumnType.CURRENCY,
    label: 'Additional Cost',
    alignment: 'Right',
    flex: 1.5,
  },
  {
    columName: 'cogs',
    columnType: ColumnType.CURRENCY,
    label: 'COGS',
    alignment: 'Right',
    flex: 1.5,
  },
  {
    columName: 'quantity',
    columnType: ColumnType.TEXT,
    label: 'Quantity',
    alignment: 'Right',
    flex: 1,
  },
  {
    columName: 'total',
    columnType: ColumnType.CURRENCY,
    label: 'Total',
    alignment: 'Right',
    flex: 1.5,
  },
  {
    columName: 'createdAt',
    columnType: ColumnType.DATE,
    label: 'Created At',
    alignment: 'Left',
    flex: 1.5,
  },
  {
    columName: 'updatedAt',
    columnType: ColumnType.DATE,
    label: 'Updated At',
    alignment: 'Left',
    flex: 1.5,
  },
  {
    columName: 'action',
    columnType: ColumnType.ACTION,
    label: 'Action',
    alignment: 'Right',
    flex: 2,
    option: {
      detail: true,
      edit: true,
      delete: true,
    },
  },
];

export default StockPurchaseItemColumn;
