import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const ItemAdjustmentColumn: Column[] = [
  {
    columName: 'adjustmentDate',
    columnType: ColumnType.DATE,
    label: 'Adjustment Date',
    alignment: 'Left',
    flex: 2,
  },
  {
    columName: 'reason',
    columnType: ColumnType.TEXT,
    label: 'Reason',
    alignment: 'Left',
    flex: 4,
  },
  {
    columName: 'status',
    columnType: ColumnType.TEXT,
    label: 'Status',
    alignment: 'Left',
    flex: 2,
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
    option: (itemAdjustment) => ({
      detail: true,
      edit: itemAdjustment.status === 'CREATED',
      delete: itemAdjustment.status === 'CREATED',
    }),
  },
];

export default ItemAdjustmentColumn;
