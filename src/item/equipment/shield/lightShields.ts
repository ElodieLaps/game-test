import { equipmentSlotName } from '@src/modules/characters/equipment/types';
import { StatisticNames } from '@src/modules/characters/statistics/types';
import { Equipment } from '../type';
import { ShieldTypeNames } from './types';

export const WOODEN_SHIELD: Equipment = {
  slot: equipmentSlotName.SHIELD,
  typeName: ShieldTypeNames.LIGHT_SHIELD,
  name: 'Wooden Shield',
  statistics: [{ name: StatisticNames.STRENGTH, value: 3 }],
};
