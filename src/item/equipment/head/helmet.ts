import { equipmentSlotName } from '@app/character/equipment/type';
import { StatisticNames } from '@app/character/statistic/type';
import { Equipment } from '../type';
import { HeadTypeNames } from './type';

export const LEATHER_HELMET: Equipment = {
  slot: equipmentSlotName.HEAD,
  typeName: HeadTypeNames.HELMET,
  name: 'Leather Helmet',
  statistics: [{ name: StatisticNames.STRENGTH, value: 2 }],
};
