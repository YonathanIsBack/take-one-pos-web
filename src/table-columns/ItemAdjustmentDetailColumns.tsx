import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

function getItemAdjustmentDetailColumns(status: string): Column[] {
  const isCreated = status === 'CREATED';

  return [
    {
      columName: 'name',
      columnType: ColumnType.TEXT,
      label: 'Item Name',
      alignment: 'Left',
      parentKey: 'item',
      flex: 3,
    },
    {
      columName: 'adjustmentType',
      columnType: ColumnType.TEXT,
      label: 'Type',
      alignment: 'Left',
      flex: 1.5,
      formatter: (value) => (value === 1 ? 'ADD' : 'SUBTRACT'),
    },
    {
      columName: 'quantity',
      columnType: ColumnType.TEXT,
      label: 'Quantity',
      alignment: 'Right',
      flex: 1,
    },
    {
      columName: 'snapshotQuantity',
      columnType: ColumnType.TEXT,
      label: 'Snapshot Quantity',
      alignment: 'Right',
      flex: 1.5,
    },
    {
      columName: 'finalQuantity',
      columnType: ColumnType.TEXT,
      label: 'Final Quantity',
      alignment: 'Right',
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
        edit: isCreated,
        delete: isCreated,
      },
    },
  ];
}

export default getItemAdjustmentDetailColumns;
