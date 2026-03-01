import { equipmentSlotName } from '@app/character/equipment/type';
import { StatisticNames } from '@app/character/statistic/type';
import { Equipment } from '../type';
import { ShieldTypeNames } from './type';

export const WOODEN_SHIELD: Equipment = {
  slot: equipmentSlotName.SHIELD,
  typeName: ShieldTypeNames.LIGHT_SHIELD,
  name: 'Wooden Shield',
  statistics: [{ name: StatisticNames.STRENGTH, value: 3 }],
};
