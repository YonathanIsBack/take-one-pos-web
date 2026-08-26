const ItemColumn = [
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
    alignment: 'right',
    option: {
        detail: true,
        edit: true,
        delete: true
    }
  },
]

export default ItemColumn
