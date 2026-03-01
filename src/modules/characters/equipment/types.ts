import { Equipment } from '@src/item/equipment/type';

export const equipmentSlotNames = [
  'HEAD',
  'CHEST',
  'LEGS',
  'FEET',
  'HANDS',
  'WEAPON',
  'SHIELD',
  'ACCESSORY',
] as const;
export const equipmentSlotName = Object.fromEntries(
  equipmentSlotNames.map((s) => [s, s]),
);
export type EquipmentSlotName = (typeof equipmentSlotNames)[number];

export type Equipments = Record<EquipmentSlotName, Equipment | null>;
