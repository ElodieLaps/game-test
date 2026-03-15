import { Equipment, EquipmentBase } from "../../../types";

const HELMET: EquipmentBase = {
  type: "EQUIPMENT",
  slot: "HEAD",
  typeName: "HELMET",
};

export const SAUCEPAN: Equipment = {
  ...HELMET,
  name: "SAUCEPAN",
  statistics: [
    { name: "STRENGTH", value: 2 },
    { name: "DODGE", value: 1 },
  ],
};

export const WOODEN_HELMET: Equipment = {
  ...HELMET,
  name: "WOODEN_HELMET",
  statistics: [{ name: "STRENGTH", value: 3 }],
};

export default [SAUCEPAN, WOODEN_HELMET];
