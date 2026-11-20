import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const CustomerColumn: Column[] = [
  { columName: 'fullName', columnType: ColumnType.TEXT, label: 'Full Name', alignment: 'Left', flex: 3 },
  {
    columName: 'phoneNumber',
    columnType: ColumnType.TEXT,
    label: 'Phone Number',
    alignment: 'Left',
    flex: 2,
  },
  { columName: 'email', columnType: ColumnType.TEXT, label: 'Email', alignment: 'Left', flex: 3 },
  {
    columName: 'fullTextAddress',
    columnType: ColumnType.TEXT,
    label: 'Address',
    alignment: 'Left',
    flex: 4,
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
    option: { detail: true, edit: true, delete: true },
  },
];

export default CustomerColumn;
