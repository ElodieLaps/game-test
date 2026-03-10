import { StatisticNames } from '@shared/types';
import { equipmentSlotName } from '@src/modules/characters/equipment/types';
import { Equipment } from '../type';
import { WeaponTypeNames } from './types';

export const WOODEN_SWORD: Equipment = {
  slot: equipmentSlotName.WEAPON,
  typeName: WeaponTypeNames.SWORD,
  name: 'Wooden Sword',
  statistics: [{ name: StatisticNames.STRENGTH, value: 3 }],
};
