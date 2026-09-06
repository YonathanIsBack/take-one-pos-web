import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const ItemColumn: Column[] = [
  {
    columName: 'name',
    columnType: ColumnType.TEXT,
    label: 'Name',
    alignment: 'Left',
  },
  {
    columName: 'quantityOnHand',
    columnType: ColumnType.TEXT,
    label: 'On Hand',
    alignment: 'Right',
  },
  {
    columName: 'quantityOnHold',
    columnType: ColumnType.TEXT,
    label: 'On Hold',
    alignment: 'Right',
  },
  {
    columName: 'quantitySellable',
    columnType: ColumnType.TEXT,
    label: 'Sellable',
    alignment: 'Right',
  },
  {
    columName: 'createdAt',
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

export default ItemColumn;
