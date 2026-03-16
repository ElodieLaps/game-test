import { WeaponTypeName, ShieldTypeName, HeadTypeName } from "../equipment";
import { RoleName } from "../character";

export const ROLE_ALLOWED_EQUIPMENT: Record<
  RoleName,
  {
    weapon: WeaponTypeName[];
    shield: ShieldTypeName[];
    head: HeadTypeName[];
  }
> = {
  WARRIOR: {
    weapon: ["SWORD"],
    shield: ["LIGHT_SHIELD"],
    head: ["HELMET"],
  },
  MAGE: {
    weapon: ["STAFF"],
    shield: [],
    head: ["HELMET"],
  },
  ROGUE: {
    weapon: ["SWORD"],
    shield: ["LIGHT_SHIELD"],
    head: ["HELMET"],
  },
  PRIEST: {
    weapon: ["STAFF"],
    shield: ["LIGHT_SHIELD"],
    head: ["HELMET"],
  },
};
