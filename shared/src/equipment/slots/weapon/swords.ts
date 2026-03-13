
import { StatisticNames } from "../../../statistic/constants";
import { EquipmentSlotNames, WeaponTypeNames } from "../../constants";
import { Equipment } from "../../types";

export const WOODEN_SWORD: Equipment = {
  slot: EquipmentSlotNames.WEAPON,
  typeName: WeaponTypeNames.SWORD,
  name: "Wooden Sword",
  statistics: [{ name: StatisticNames.STRENGTH, value: 3 }],
};
