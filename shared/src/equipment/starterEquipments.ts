import { Equipments } from "../character";
import { LEATHER_HELMET } from "./slots/head/helmets";
import { WOODEN_SHIELD } from "./slots/shield/lightShields";
import { WOODEN_STAFF } from "./slots/weapon/staffs";
import { WOODEN_SWORD } from "./slots/weapon/swords";

export const magicalStarterEquipment: Equipments = {
  HEAD: LEATHER_HELMET,
  CHEST: null,
  LEGS: null,
  FEET: null,
  HANDS: null,
  WEAPON: WOODEN_STAFF,
  SHIELD: null,
  ACCESSORY: null,
};

export const physicalStarterEquipment: Equipments = {
  HEAD: LEATHER_HELMET,
  CHEST: null,
  LEGS: null,
  FEET: null,
  HANDS: null,
  WEAPON: WOODEN_SWORD,
  SHIELD: WOODEN_SHIELD,
  ACCESSORY: null,
};
