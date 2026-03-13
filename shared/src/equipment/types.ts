import { Statistic } from "../statistic";
import {
  EquipmentSlotName,
  HeadTypeName,
  ShieldTypeName,
  WeaponTypeName,
} from "./constants";

export type Equipment = {
  slot: EquipmentSlotName;
  typeName: HeadTypeName | WeaponTypeName | ShieldTypeName;
  name: string;
  statistics: Omit<Statistic, "progressIndex" | "currentValue">[];
};
