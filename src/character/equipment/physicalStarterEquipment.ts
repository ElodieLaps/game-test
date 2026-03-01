import { LEATHER_HELMET } from '@app/item/equipment/head/helmet';
import { WOODEN_SHIELD } from '@app/item/equipment/shield/lightShield';
import { WOODEN_SWORD } from '@app/item/equipment/weapon/sword';
import { Equipments } from './type';

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
