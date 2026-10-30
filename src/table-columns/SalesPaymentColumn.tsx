import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const SalesPaymentColumn: Column[] = [
  {
    columName: 'paymentDate',
    columnType: ColumnType.DATE,
    label: 'Payment Date',
    alignment: 'Left',
    flex: 1.5,
  },
  {
    columName: 'paymentChannel',
    columnType: ColumnType.TEXT,
    label: 'Payment Channel',
    alignment: 'Left',
    flex: 1.5,
  },
  {
    columName: 'accountNumber',
    columnType: ColumnType.TEXT,
    label: 'Account Number',
    alignment: 'Left',
    flex: 2,
  },
  {
    columName: 'accountHolderName',
    columnType: ColumnType.TEXT,
    label: 'Account Holder Name',
    alignment: 'Left',
    flex: 2.5,
  },
  {
    columName: 'createdAt',
    columnType: ColumnType.DATE,
    label: 'Created At',
    alignment: 'Left',
    flex: 1.5,
  },
];

export default SalesPaymentColumn;
