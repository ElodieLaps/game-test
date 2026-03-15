import { Equipment, EquipmentBase } from "../../../types";

const STAFF: EquipmentBase = {
  type: "EQUIPMENT",
  slot: "WEAPON",
  typeName: "STAFF",
};

export const WALNUT_BRANCH: Equipment = {
  ...STAFF,
  name: "WALNUT_BRANCH",
  statistics: [
    { name: "STRENGTH", value: 1 },
    { name: "POWER", value: 2 },
  ],
};

export const WOODEN_STAFF: Equipment = {
  ...STAFF,
  name: "WOODEN_STAFF",
  statistics: [
    { name: "STRENGTH", value: 2 },
    { name: "POWER", value: 2 },
  ],
};

export default [WALNUT_BRANCH, WOODEN_STAFF];
