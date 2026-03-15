import { Equipment, EquipmentBase } from "../../../types";

const LIGHT_SHIELD: EquipmentBase = {
  type: "EQUIPMENT",
  slot: "SHIELD",
  typeName: "LIGHT_SHIELD",
};

export const SAUCEPAN_LID: Equipment = {
  ...LIGHT_SHIELD,
  name: "SAUCEPAN_LID",
  statistics: [
    { name: "STRENGTH", value: 2 },
    { name: "DODGE", value: 1 },
  ],
};

export const WOODEN_SHIELD: Equipment = {
  ...LIGHT_SHIELD,
  name: "WOODEN_SHIELD",
  statistics: [{ name: "STRENGTH", value: 3 }],
};

export default [SAUCEPAN_LID, WOODEN_SHIELD];
