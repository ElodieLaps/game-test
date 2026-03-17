export const consumableNames = ["HEALING_POTION", "MANA_POTION"] as const;
export type ConsumableName = (typeof consumableNames)[number];
export const ConsumableNames = Object.fromEntries(
  consumableNames.map((h) => [h, h]),
);
