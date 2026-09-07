import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const SalesColumn: Column[] = [
  {
    columName: 'orderDate',
    columnType: ColumnType.DATE,
    label: 'Order Date',
    alignment: 'Left',
  },
  {
    columName: 'customerName',
    columnType: ColumnType.TEXT,
    label: 'Customer Name',
    alignment: 'Left',
  },
  {
    columName: 'paymentDate',
    columnType: ColumnType.DATE,
    label: 'Payment Date',
    alignment: 'Left',
  },
  {
    columName: 'deliveryDate',
    columnType: ColumnType.DATE,
    label: 'Delivery Date',
    alignment: 'Left',
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

export default SalesColumn;
