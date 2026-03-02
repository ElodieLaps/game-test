export const weaponTypeNames = ['SWORD', 'STAFF', 'DAGGER', 'MACE'] as const;
export type WeaponTypeName = (typeof weaponTypeNames)[number];
export const WeaponTypeNames = Object.fromEntries(
  weaponTypeNames.map((w) => [w, w]),
);
