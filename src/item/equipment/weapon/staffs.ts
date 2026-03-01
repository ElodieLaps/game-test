import { equipmentSlotName } from '@src/modules/characters/equipment/types';
import { StatisticNames } from '@characters/statistic/type';
import { Equipment } from '../type';
import { WeaponTypeNames } from './types';

export const WOODEN_STAFF: Equipment = {
  slot: equipmentSlotName.WEAPON,
  typeName: WeaponTypeNames.STAFF,
  name: 'Wooden Staff',
  statistics: [{ name: StatisticNames.POWER, value: 3 }],
};
