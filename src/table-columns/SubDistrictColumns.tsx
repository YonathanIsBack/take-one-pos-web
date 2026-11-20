import ColumnType from '../constants/ColumnType';
import { Column } from '../constants/Type';

function getSubDistrictColumns(districts: { id: number; name: string }[]): Column[] {
  const districtNameById = new Map(districts.map((district) => [district.id, district.name]));

  return [
    {
      columName: 'name',
      columnType: ColumnType.TEXT,
      label: 'Name',
      alignment: 'Left',
      flex: 3,
    },
    {
      columName: 'districtId',
      columnType: ColumnType.TEXT,
      label: 'District',
      alignment: 'Left',
      flex: 2,
      formatter: (value) => districtNameById.get(Number(value)) ?? String(value ?? ''),
    },
    {
      columName: 'postCode',
      columnType: ColumnType.TEXT,
      label: 'Post Code',
      alignment: 'Left',
      flex: 1.5,
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
      option: { detail: true, edit: true, delete: true },
    },
  ];
}

export default getSubDistrictColumns;
