import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const SalesColumn: Column[] = [
  {
    columName: 'orderDate',
    columnType: ColumnType.DATE,
    label: 'Order Date',
    alignment: 'Left',
    flex: 1.5,
  },
  {
    columName: 'customerName',
    columnType: ColumnType.TEXT,
    label: 'Customer Name',
    alignment: 'Left',
    flex: 2,
  },
  {
    columName: 'paymentDate',
    columnType: ColumnType.DATE,
    label: 'Payment Date',
    alignment: 'Left',
    flex: 1.5,
  },
  {
    columName: 'deliveryDate',
    columnType: ColumnType.DATE,
    label: 'Delivery Date',
    alignment: 'Left',
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

export default SalesColumn;
