
import { StatisticNames } from "../../../statistic/constants";
import { EquipmentSlotNames, ShieldTypeNames } from "../../constants";
import { Equipment } from "../../types";

export const WOODEN_SHIELD: Equipment = {
  slot: EquipmentSlotNames.SHIELD,
  typeName: ShieldTypeNames.LIGHT_SHIELD,
  name: "Wooden Shield",
  statistics: [{ name: StatisticNames.STRENGTH, value: 3 }],
};
