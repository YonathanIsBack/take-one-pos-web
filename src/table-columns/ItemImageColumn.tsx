import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

const ItemImageColumn: Column[] = [
  { columName: 'mimeType', columnType: ColumnType.TEXT, label: 'MIME Type', alignment: 'Left', flex: 2 },
  { columName: 'imageSize', columnType: ColumnType.TEXT, label: 'Size', alignment: 'Right', flex: 1 },
  { columName: 'path', columnType: ColumnType.IMAGE, label: 'Preview', alignment: 'Left', flex: 1 },
  { columName: 'action', columnType: ColumnType.ACTION, label: 'Action', alignment: 'Right', flex: 1,
    option: { delete: true } },
];

export default ItemImageColumn;
