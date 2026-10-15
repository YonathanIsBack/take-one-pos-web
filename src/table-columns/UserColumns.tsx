import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const UserColumn: Column[] = [
  { columName: 'displayName', columnType: ColumnType.TEXT, label: 'Display Name', alignment: 'Left', flex: 2 },
  { columName: 'username', columnType: ColumnType.TEXT, label: 'Username', alignment: 'Left', flex: 2 },
  { columName: 'isActive', columnType: ColumnType.CHECKLIST, label: 'Is Active', alignment: 'Center', flex: 1 },
  { columName: 'action', columnType: ColumnType.ACTION, label: 'Action', alignment: 'Right', flex: 1,
    option: { detail: true } },
];

export default UserColumn;
