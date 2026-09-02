const RoutePath = {
  LOGIN: '/login',
  ITEM: '/item',
  ITEM_NEW: '/item/form',
  ITEM_DETAIL: (id: string | number) => `/item/${id}`,
  ITEM_EDIT: (id: string | number) => `/item/${id}/edit`,
  USER: '/user',
} as const;

export default RoutePath;
