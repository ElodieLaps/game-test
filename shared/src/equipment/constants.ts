export const equipmentSlotNames = [
  "HEAD",
  "CHEST",
  "LEGS",
  "FEET",
  "HANDS",
  "WEAPON",
  "SHIELD",
  "ACCESSORY",
] as const;
export type EquipmentSlotName = (typeof equipmentSlotNames)[number];
export const EquipmentSlotNames = Object.fromEntries(
  equipmentSlotNames.map((s) => [s, s]),
);

export const headTypeNames = ["HELMET"] as const;
export type HeadTypeName = (typeof headTypeNames)[number];
export const HeadTypeNames = Object.fromEntries(
  headTypeNames.map((w) => [w, w]),
);

export const shieldTypeNames = ["HEAVY_SHIELD", "LIGHT_SHIELD"] as const;
export type ShieldTypeName = (typeof shieldTypeNames)[number];
export const ShieldTypeNames = Object.fromEntries(
  shieldTypeNames.map((w) => [w, w]),
);

export const weaponTypeNames = ["SWORD", "STAFF", "DAGGER", "MACE"] as const;
export type WeaponTypeName = (typeof weaponTypeNames)[number];
export const WeaponTypeNames = Object.fromEntries(
  weaponTypeNames.map((w) => [w, w]),
);
