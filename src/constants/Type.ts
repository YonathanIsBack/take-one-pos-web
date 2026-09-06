export interface Item {
  [key: string]: unknown;
  id: number;
  name: string;
  quantityOnHand: number;
  quantityOnHold: number;
  quantitySellable: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface StockPurchase {
  [key: string]: unknown;
  id: number;
  purchaseDate: string;
  status: string;
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
  columnType: string;
  label: string;
  alignment?: 'Left' | 'Right' | 'Center';
  option?: ColumnOption;
  parentKey?: string;
}
