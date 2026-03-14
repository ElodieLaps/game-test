import { magicalStarterEquipment, physicalStarterEquipment } from '@shared';
import { getStarterEquipment } from '../utils';

jest.mock('@shared', () => ({
  physicalStarterEquipment: { type: 'physical', items: ['sword', 'shield'] },
  magicalStarterEquipment: { type: 'magical', items: ['staff', 'tome'] },
}));

describe('getStarterEquipment', () => {
  describe('physical roles', () => {
    it('should return physicalStarterEquipment for WARRIOR', () => {
      expect(getStarterEquipment('WARRIOR')).toBe(physicalStarterEquipment);
    });

    it('should return physicalStarterEquipment for ROGUE', () => {
      expect(getStarterEquipment('ROGUE')).toBe(physicalStarterEquipment);
    });
  });

  describe('magical roles', () => {
    it('should return magicalStarterEquipment for MAGE', () => {
      expect(getStarterEquipment('MAGE')).toBe(magicalStarterEquipment);
    });

    it('should return magicalStarterEquipment for PRIEST', () => {
      expect(getStarterEquipment('PRIEST')).toBe(magicalStarterEquipment);
    });
  });

  describe('invalid role', () => {
    it('should throw an error for an unknown role', () => {
      expect(() => getStarterEquipment('PALADIN' as any)).toThrow(
        'Invalid role',
      );
    });

    it('should throw an Error instance for an unknown role', () => {
      expect(() => getStarterEquipment('PALADIN' as any)).toThrow(Error);
    });
  });
});
