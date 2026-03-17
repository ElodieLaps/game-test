import { Equipment, EquipmentBase } from "../../../types";

const TIARA: EquipmentBase = {
  type: "EQUIPMENT",
  slot: "HEAD",
  typeName: "TIARA",
};

export const PANTY_ELASTIC: Equipment = {
  ...TIARA,
  name: "PANTY_ELASTIC",
  statistics: [
    { name: "POWER", value: 1 },
    { name: "BENEDICTION", value: 1 },
  ],
};

export const SILVER_TIARA: Equipment = {
  ...TIARA,
  name: "SILVER_TIARA",
  statistics: [
    { name: "POWER", value: 2 },
    { name: "BENEDICTION", value: 2 },
  ],
};

export const GOLDEN_TIARA: Equipment = {
  ...TIARA,
  name: "GOLDEN_TIARA",
  statistics: [
    { name: "POWER", value: 4 },
    { name: "BENEDICTION", value: 4 },
  ],
};

export default [PANTY_ELASTIC, SILVER_TIARA, GOLDEN_TIARA];
