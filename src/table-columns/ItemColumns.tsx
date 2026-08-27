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

export default ItemColumn;
