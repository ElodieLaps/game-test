import { StatisticNames } from "../../../statistic/constants";
import { EquipmentSlotNames, HeadTypeNames } from "../../constants";
import { Equipment } from "../../types";

export const LEATHER_HELMET: Equipment = {
  slot: EquipmentSlotNames.HEAD,
  typeName: HeadTypeNames.HELMET,
  name: "Leather Helmet",
  statistics: [{ name: StatisticNames.STRENGTH, value: 2 }],
};
