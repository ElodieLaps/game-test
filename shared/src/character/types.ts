import { EquipmentSlotName } from "../equipment/constants";
import { Equipment } from "../equipment/types";
import { StatisticName, Statistic } from "../statistic";

export type Statistics = Record<StatisticName, Omit<Statistic, "name">>;
export type Equipments = Record<EquipmentSlotName, Equipment | null>;
