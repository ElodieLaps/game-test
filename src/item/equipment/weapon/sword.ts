import { equipmentSlotName } from '@app/character/equipment/type';
import { StatisticNames } from '@app/character/statistic/type';
import { Equipment } from '../type';
import { WeaponTypeNames } from './type';

export const WOODEN_SWORD: Equipment = {
  slot: equipmentSlotName.WEAPON,
  typeName: WeaponTypeNames.SWORD,
  name: 'Wooden Sword',
  statistics: [{ name: StatisticNames.STRENGTH, value: 3 }],
};
