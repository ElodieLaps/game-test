
import { StatisticNames } from "../../../statistic/constants";
import { EquipmentSlotNames, WeaponTypeNames } from "../../constants";
import { Equipment } from "../../types";

export const WOODEN_STAFF: Equipment = {
  slot: EquipmentSlotNames.WEAPON,
  typeName: WeaponTypeNames.STAFF,
  name: "Wooden Staff",
  statistics: [{ name: StatisticNames.POWER, value: 3 }],
};
