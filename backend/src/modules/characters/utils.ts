import {
  magicalStarterEquipment,
  physicalStarterEquipment,
  RoleName,
} from '@shared';

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
