export const shieldTypeNames = ['HEAVY_SHIELD', 'LIGHT_SHIELD'] as const;
export type ShieldTypeName = (typeof shieldTypeNames)[number];
export const ShieldTypeNames = Object.fromEntries(
  shieldTypeNames.map((w) => [w, w]),
);
