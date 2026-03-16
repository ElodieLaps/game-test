import { RoleName } from "../character";
import { allEquipments, Equipment, EquipmentSlotName } from "../equipment";
import { ROLE_ALLOWED_EQUIPMENT } from "./constants";

export const getEquipmentsBySlotAndRole = (
  slot: EquipmentSlotName,
  role: RoleName,
): Equipment[] => {
  const allowed = ROLE_ALLOWED_EQUIPMENT[role];

  return allEquipments.filter((e) => {
    if (e.slot !== slot) return false;

    const slotToAllowedTypes: Partial<Record<EquipmentSlotName, string[]>> = {
      WEAPON: allowed.weapon,
      SHIELD: allowed.shield,
      HEAD: allowed.head,
    };

    const allowedTypes = slotToAllowedTypes[slot];
    if (!allowedTypes) return true;
    return allowedTypes.includes(e.typeName);
  });
};
