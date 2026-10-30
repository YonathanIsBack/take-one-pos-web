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

export interface Sale {
  [key: string]: unknown;
  id: number;
  transactionCode: string | null;
  orderDate: string;
  paymentDate: string;
  deliveryDate: string;
  customerName: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  rowversion: number;
}

export interface Category {
  [key: string]: unknown;
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  rowversion: number;
}

export interface User {
  [key: string]: unknown;
  id: number;
  displayName: string;
  username: string;
  isActive: number;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string | null;
  rowversion: number;
}

export interface PaymentChannel {
  [key: string]: unknown;
  id: number;
  channelName: string;
  accountNumber: string;
  accountHolderName: string;
  createdAt: string;
  updatedAt: string | null;
  rowversion: number;
}

export interface SalesPayment {
  [key: string]: unknown;
  id: number;
  salesId: number;
  referenceNo: string;
  paymentDate: string | null;
  paymentChannel: string;
  accountNumber: string;
  accountHolderName: string;
  createdAt: string;
  updatedAt: string | null;
  rowversion: number;
}

export interface ColumnOption {  detail?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export interface Column {
  columName: string;
  columnType: string;
  label: string;
  alignment?: 'Left' | 'Right' | 'Center';
  option?: ColumnOption | ((item: Record<string, unknown>) => ColumnOption);
  parentKey?: string;
  flex?: number;
}
