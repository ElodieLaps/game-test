import { Equipment, EquipmentBase } from "../../../types";

const SWORD: EquipmentBase = {
  type: "EQUIPMENT",
  slot: "WEAPON",
  typeName: "SWORD",
};

export const WOODEN_SPOON: Equipment = {
  ...SWORD,
  name: "WOODEN_SPOON",
  statistics: [
    { name: "STRENGTH", value: 2 },
    { name: "VELOCITY", value: 1 },
  ],
};

export const WOODEN_SWORD: Equipment = {
  ...SWORD,
  name: "WOODEN_SWORD",
  statistics: [{ name: "STRENGTH", value: 4 }],
};

export default [WOODEN_SPOON, WOODEN_SWORD];
