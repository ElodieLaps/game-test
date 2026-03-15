import { Shield, Weapon } from "../equipment";
import { Head } from "../equipment/slots/head";
import { StatisticName } from "../statistic";

export type PersonalStats = Partial<Record<StatisticName, number>>;

export type Equipments = {
  HEAD: Head | null;
  CHEST: null;
  LEGS: null;
  FEET: null;
  HANDS: null;
  WEAPON: Weapon | null;
  SHIELD: Shield | null;
  ACCESSORY: null;
};
