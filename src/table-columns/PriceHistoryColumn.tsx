import { Column } from '../constants/Type';

const PriceHistoryColumn: Column[] = [
  {
    columName: 'cogs',
    columnType: 'TEXT',
    label: 'COGS',
    alignment: 'Right',
  },
  {
    columName: 'selling_price',
    columnType: 'TEXT',
    label: 'Selling Price',
    alignment: 'Right',
  },
  {
    columName: 'valid_from',
    columnType: 'DATE',
    label: 'Valid From',
    alignment: 'Left',
  },
  {
    columName: 'valid_to',
    columnType: 'DATE',
    label: 'Valid To',
    alignment: 'Left',
  },
];

export default PriceHistoryColumn;
