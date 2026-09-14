import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const CategoryColumn: Column[] = [
  { columName: 'name', columnType: ColumnType.TEXT, label: 'Name', alignment: 'Left', flex: 4 },
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
    option: { detail: true, edit: true, delete: true },
  },
];

export default CategoryColumn;
