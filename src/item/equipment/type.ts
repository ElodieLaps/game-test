import { EquipmentSlotName } from '@src/modules/characters/equipment/types';
import { Statistic } from '@characters/statistic/type';
import { HeadTypeName } from './head/types';
import { ShieldTypeName } from './shield/types';
import { WeaponTypeName } from './weapon/types';

export type Equipment = {
  slot: EquipmentSlotName;
  typeName: HeadTypeName | WeaponTypeName | ShieldTypeName;
  name: string;
  statistics: Omit<Statistic, 'progressIndex' | 'currentValue'>[];
};
