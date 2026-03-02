import { LEATHER_HELMET } from '@src/item/equipment/head/helmets';
import { WOODEN_SHIELD } from '@src/item/equipment/shield/lightShields';
import { WOODEN_SWORD } from '@src/item/equipment/weapon/swords';
import { Equipments } from './types';

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
