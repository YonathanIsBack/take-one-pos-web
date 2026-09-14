const RoutePath = {
  LOGIN: '/login',
  ITEM: '/item',
  ITEM_NEW: '/item/form',
  ITEM_DETAIL: (id: string | number) => `/item/${id}`,
  ITEM_EDIT: (id: string | number) => `/item/${id}/edit`,
  STOCK_PURCHASE: '/stock-purchase',
  STOCK_PURCHASE_NEW: '/stock-purchase/form',
  STOCK_PURCHASE_DETAIL: (id: string | number) => `/stock-purchase/${id}`,
  STOCK_PURCHASE_EDIT: (id: string | number) => `/stock-purchase/${id}/edit`,
  CATEGORY: '/category',
  CATEGORY_NEW: '/category/form',
  CATEGORY_DETAIL: (id: string | number) => `/category/${id}`,
  CATEGORY_EDIT: (id: string | number) => `/category/${id}/edit`,
  SALES: '/sales',
  SALES_NEW: '/sales/form',
  SALES_DETAIL: (id: string | number) => `/sales/${id}`,
  SALES_EDIT: (id: string | number) => `/sales/${id}/edit`,
  REPORT: '/report',
  HPP_CALCULATOR: '/hpp-calculator',
  USER: '/user',
} as const;

export default RoutePath;
