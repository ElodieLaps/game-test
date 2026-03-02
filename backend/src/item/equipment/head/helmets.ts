import { equipmentSlotName } from '@src/modules/characters/equipment/types';
import { StatisticNames } from '@src/modules/characters/statistics/types';
import { Equipment } from '../type';
import { HeadTypeNames } from './types';

export const LEATHER_HELMET: Equipment = {
  slot: equipmentSlotName.HEAD,
  typeName: HeadTypeNames.HELMET,
  name: 'Leather Helmet',
  statistics: [{ name: StatisticNames.STRENGTH, value: 2 }],
};
