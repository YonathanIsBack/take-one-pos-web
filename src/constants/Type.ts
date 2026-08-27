export interface Item {
  [key: string]: unknown;
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ColumnOption {
  detail?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export interface Column {
  columName: string;
  columnType: 'TEXT' | 'DATE' | 'ACTION';
  label: string;
  alignment?: 'Left' | 'Right' | 'Center';
  option?: ColumnOption;
}
