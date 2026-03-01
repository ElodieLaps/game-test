import { EquipmentSlotName } from '@app/character/equipment/type';
import { Statistic } from '@app/character/statistic/type';
import { HeadTypeName } from './head/type';
import { ShieldTypeName } from './shield/type';
import { WeaponTypeName } from './weapon/type';

export type Equipment = {
  slot: EquipmentSlotName;
  typeName: HeadTypeName | WeaponTypeName | ShieldTypeName;
  name: string;
  statistics: Omit<Statistic, 'progressIndex' | 'currentValue'>[];
};
