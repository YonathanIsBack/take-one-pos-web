import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const PaymentChannelColumn: Column[] = [
  { columName: 'channelName', columnType: ColumnType.TEXT, label: 'Channel Name', alignment: 'Left', flex: 2 },
  { columName: 'accountNumber', columnType: ColumnType.TEXT, label: 'Account Number', alignment: 'Left', flex: 2 },
  { columName: 'accountHolderName', columnType: ColumnType.TEXT, label: 'Account Holder Name', alignment: 'Left', flex: 3 },
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

export default PaymentChannelColumn;
