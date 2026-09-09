import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const ItemColumn: Column[] = [
  {
    columName: 'name',
    columnType: ColumnType.TEXT,
    label: 'Name',
    alignment: 'Left',
    flex: 3,
  },
  {
    columName: 'quantityOnHand',
    columnType: ColumnType.TEXT,
    label: 'On Hand',
    alignment: 'Right',
    flex: 1,
  },
  {
    columName: 'quantityOnHold',
    columnType: ColumnType.TEXT,
    label: 'On Hold',
    alignment: 'Right',
    flex: 1,
  },
  {
    columName: 'quantitySellable',
    columnType: ColumnType.TEXT,
    label: 'Sellable',
    alignment: 'Right',
    flex: 1,
  },
  {
    columName: 'createdAt',
    columnType: ColumnType.DATE,
    label: 'Created At',
    alignment: 'Left',
    flex: 1.5,
  },
  {
    columName: 'action',
    columnType: ColumnType.ACTION,
    label: 'Action',
    alignment: 'Right',
    flex: 1,
    option: {
      detail: true,
      edit: true,
      delete: true,
    },
  },
];

export default ItemColumn;
