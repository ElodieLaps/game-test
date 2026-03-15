export const itemTypeNames = ["EQUIPMENT", "CONSUMABLE"] as const;
export type ItemTypeName = (typeof itemTypeNames)[number];
export const ItemTypeNames = Object.fromEntries(
  itemTypeNames.map((i) => [i, i]),
);
