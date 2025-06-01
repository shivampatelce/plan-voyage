export const MENU_ITEMS = {
  HOME: 'Home',
  TRIPS: 'Trips',
  LOGOUT: 'Logout',
} as const;

export type MENU_ITEM_KEYS = keyof typeof MENU_ITEMS;
export type MENU_ITEM_VALUES = (typeof MENU_ITEMS)[MENU_ITEM_KEYS];
