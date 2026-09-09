import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

function getSalesItemColumns(status: string): Column[] {
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
      columName: 'price',
      columnType: ColumnType.CURRENCY,
      label: 'Price',
      alignment: 'Right',
      flex: 1.5,
    },
    {
      columName: 'quantity',
      columnType: ColumnType.TEXT,
      label: 'Quantity',
      alignment: 'Right',
      flex: 1,
    },
    {
      columName: 'discount',
      columnType: ColumnType.CURRENCY,
      label: 'Discount',
      alignment: 'Right',
      flex: 1.5,
    },
    {
      columName: 'totalPrice',
      columnType: ColumnType.CURRENCY,
      label: 'Total Price',
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

export default getSalesItemColumns;
