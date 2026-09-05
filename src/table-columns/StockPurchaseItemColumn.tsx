import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const StockPurchaseItemColumn: Column[] = [
  {
    columName: 'name',
    columnType: ColumnType.TEXT,
    label: 'Item Name',
    alignment: 'Left',
    parentKey: 'item',
  },
  {
    columName: 'buyingPrice',
    columnType: ColumnType.CURRENCY,
    label: 'Buying Price',
    alignment: 'Right',
  },
  {
    columName: 'additionalCost',
    columnType: ColumnType.CURRENCY,
    label: 'Additional Cost',
    alignment: 'Right',
  },
  {
    columName: 'cogs',
    columnType: ColumnType.CURRENCY,
    label: 'COGS',
    alignment: 'Right',
  },
  {
    columName: 'quantity',
    columnType: ColumnType.TEXT,
    label: 'Quantity',
    alignment: 'Right',
  },
  {
    columName: 'total',
    columnType: ColumnType.CURRENCY,
    label: 'Total',
    alignment: 'Right',
  },
  {
    columName: 'createdAt',
    columnType: ColumnType.DATE,
    label: 'Created At',
    alignment: 'Left',
  },
  {
    columName: 'updatedAt',
    columnType: ColumnType.DATE,
    label: 'Updated At',
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

export default StockPurchaseItemColumn;
