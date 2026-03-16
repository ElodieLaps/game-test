import { Equipment, EquipmentName, EquipmentSlotName } from ".";
import helmets from "./slots/head/helmet/helmets";
import tiaras from "./slots/head/tiara/tiaras";
import lightShields from "./slots/shield/lightShield/lightShields";
import staffs from "./slots/weapon/staff/staffs";
import swords from "./slots/weapon/sword/swords";

export const allEquipments: Equipment[] = [
  ...helmets,
  ...tiaras,
  ...lightShields,
  ...staffs,
  ...swords,
];

export const getEquipmentByName = (name: EquipmentName): Equipment => {
  const equipment = allEquipments.find((e) => e.name === name);
  if (!equipment) throw new Error(`Equipment ${name} not found`);
  return equipment;
};

export const getEquipmentsBySlot = (slot: EquipmentSlotName): Equipment[] => {
  return allEquipments.filter((e) => e.slot === slot);
};
