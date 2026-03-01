import { equipmentSlotName } from '@app/character/equipment/type';
import { StatisticNames } from '@app/character/statistic/type';
import { Equipment } from '../type';
import { WeaponTypeNames } from './type';

export const WOODEN_STAFF: Equipment = {
  slot: equipmentSlotName.WEAPON,
  typeName: WeaponTypeNames.STAFF,
  name: 'Wooden Staff',
  statistics: [{ name: StatisticNames.POWER, value: 3 }],
};
