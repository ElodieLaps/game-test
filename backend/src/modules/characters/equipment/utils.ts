import { RoleName } from '../roles/types';
import { magicalStarterEquipment } from './magicalStarterEquipment';
import { physicalStarterEquipment } from './physicalStarterEquipment';

export const getStarterEquipment = (role: RoleName) => {
  switch (role) {
    case 'WARRIOR':
    case 'ROGUE':
      return physicalStarterEquipment;
    case 'MAGE':
    case 'PRIEST':
      return magicalStarterEquipment;
    default:
      throw new Error('Invalid role');
  }
};
