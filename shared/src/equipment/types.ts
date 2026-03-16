import { Statistic } from "../statistic";
import {
  EquipmentSlotName,
  HeadTypeName,
  ShieldTypeName,
  WeaponTypeName,
} from "./constants";
import { HelmetName } from "./slots";
import { TiaraName } from "./slots/head/tiara/constants";
import { LightShieldName } from "./slots/shield/lightShield/constants";
import { StaffName } from "./slots/weapon/staff";
import { SwordName } from "./slots/weapon/sword/constants";

export interface EquipmentBase {
  type: "EQUIPMENT";
  slot: EquipmentSlotName;
  typeName: HeadTypeName | WeaponTypeName | ShieldTypeName;
}

export type EquipmentName =
  | HelmetName
  | TiaraName
  | LightShieldName
  | SwordName
  | StaffName;

export type Equipment = EquipmentBase & {
  name: EquipmentName;
  statistics: Omit<Statistic, "progressIndex" | "currentValue">[];
};
