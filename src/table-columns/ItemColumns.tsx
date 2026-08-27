import { Column } from '../constants/Type';

const ItemColumn: Column[] = [
  {
    columName: 'name',
    columnType: 'TEXT',
    label: 'Name',
    alignment: 'Left',
  },
  {
    columName: 'created_at',
    columnType: 'DATE',
    label: 'Created At',
    alignment: 'Left',
  },
  {
    columName: 'action',
    columnType: 'ACTION',
    label: 'Action',
    alignment: 'Right',
    option: {
      detail: true,
      edit: true,
      delete: true,
    },
  },
];

export default ItemColumn;
