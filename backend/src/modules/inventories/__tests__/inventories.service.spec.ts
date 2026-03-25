import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from '@inventories/inventories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from '@inventories/inventory.entity';
import { User } from '@users/user.entity';
import { NotFoundException } from '@nestjs/common';
import { InventoryConsumable, InventoryEquipment } from '@shared';

const mockUser: User = {
  id: 'user-uuid',
  name: 'John',
  email: 'john@example.com',
} as User;

const mockInventory: Inventory = {
  id: 'inventory-uuid',
  user: mockUser,
  items: {
    equipments: [{ name: 'SAUCEPAN', quantity: 2 }],
    consumables: [{ name: 'HEALING_POTION', quantity: 1 }],
  },
} as Inventory;

const mockInventoryRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── getInventory ─────────────────────────────────────────────────────────

  describe('getInventory', () => {
    it('should return the inventory of a user', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(mockInventory);

      const result = await service.getInventory(mockUser.id);

      expect(mockInventoryRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
      });
      expect(result).toEqual(mockInventory);
    });

    it('should throw NotFoundException if inventory does not exist', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(null);

      await expect(service.getInventory(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── CreateInventory ─────────────────────────────────────────────────

  describe('createInventory', () => {
    it('should create a new inventory', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(null);
      mockInventoryRepository.create.mockReturnValue(mockInventory);
      mockInventoryRepository.save.mockResolvedValue(mockInventory);

      const result = await service.createInventory(mockUser);

      expect(mockInventoryRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        items: { equipments: [], consumables: [] },
      });
      expect(mockInventoryRepository.save).toHaveBeenCalledWith(mockInventory);
      expect(result).toEqual(mockInventory);
    });
  });

  // ─── addItems ─────────────────────────────────────────────────────────────

  describe('addItems', () => {
    it('should stack quantity on existing equipment', async () => {
      const inventory = {
        ...mockInventory,
        items: {
          equipments: [{ name: 'SAUCEPAN', quantity: 1 }],
          consumables: [],
        },
      };
      mockInventoryRepository.findOne.mockResolvedValue(inventory);
      mockInventoryRepository.save.mockResolvedValue(inventory);

      await service.addItems(mockUser.id, {
        equipments: [{ name: 'SAUCEPAN', quantity: 2 }] as InventoryEquipment[],
      });

      expect(inventory.items.equipments[0].quantity).toBe(3);
    });

    it('should add new equipment if it does not exist', async () => {
      const inventory = {
        ...mockInventory,
        items: { equipments: [], consumables: [] },
      };
      mockInventoryRepository.findOne.mockResolvedValue(inventory);
      mockInventoryRepository.save.mockResolvedValue(inventory);

      await service.addItems(mockUser.id, {
        equipments: [
          { name: 'GOLDEN_TIARA', quantity: 1 },
        ] as InventoryEquipment[],
      });

      expect(inventory.items.equipments).toContainEqual({
        name: 'GOLDEN_TIARA',
        quantity: 1,
      });
    });

    it('should stack quantity on existing consumable', async () => {
      const inventory = {
        ...mockInventory,
        items: {
          equipments: [],
          consumables: [{ name: 'HEALING_POTION', quantity: 2 }],
        },
      };
      mockInventoryRepository.findOne.mockResolvedValue(inventory);
      mockInventoryRepository.save.mockResolvedValue(inventory);

      await service.addItems(mockUser.id, {
        consumables: [
          { name: 'HEALING_POTION', quantity: 3 },
        ] as InventoryConsumable[],
      });

      expect(inventory.items.consumables[0].quantity).toBe(5);
    });

    it('should add new consumable if it does not exist', async () => {
      const inventory = {
        ...mockInventory,
        items: { equipments: [], consumables: [] },
      };
      mockInventoryRepository.findOne.mockResolvedValue(inventory);
      mockInventoryRepository.save.mockResolvedValue(inventory);

      await service.addItems(mockUser.id, {
        consumables: [
          { name: 'MANA_POTION', quantity: 1 },
        ] as InventoryConsumable[],
      });

      expect(inventory.items.consumables).toContainEqual({
        name: 'MANA_POTION',
        quantity: 1,
      });
    });
  });

  // ─── removeItems ──────────────────────────────────────────────────────────

  describe('removeItems', () => {
    it('should decrease equipment quantity', async () => {
      const inventory = {
        ...mockInventory,
        items: {
          equipments: [{ name: 'SAUCEPAN', quantity: 3 }],
          consumables: [],
        },
      };
      mockInventoryRepository.findOne.mockResolvedValue(inventory);
      mockInventoryRepository.save.mockResolvedValue(inventory);

      await service.removeItems(mockUser.id, {
        equipments: [{ name: 'SAUCEPAN', quantity: 1 }] as InventoryEquipment[],
      });

      expect(inventory.items.equipments[0].quantity).toBe(2);
    });

    it('should remove equipment when quantity reaches 0', async () => {
      const inventory = {
        ...mockInventory,
        items: {
          equipments: [{ name: 'SAUCEPAN', quantity: 1 }],
          consumables: [],
        },
      };
      mockInventoryRepository.findOne.mockResolvedValue(inventory);
      mockInventoryRepository.save.mockResolvedValue(inventory);

      await service.removeItems(mockUser.id, {
        equipments: [{ name: 'SAUCEPAN', quantity: 1 }] as InventoryEquipment[],
      });

      expect(inventory.items.equipments).toHaveLength(0);
    });

    it('should throw NotFoundException if equipment does not exist', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(mockInventory);

      await expect(
        service.removeItems(mockUser.id, {
          equipments: [
            { name: 'Unknown', quantity: 1 },
          ] as unknown as InventoryEquipment[],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if consumable does not exist', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(mockInventory);

      await expect(
        service.removeItems(mockUser.id, {
          consumables: [
            { name: 'Unknown', quantity: 1 },
          ] as unknown as InventoryConsumable[],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── transfer ─────────────────────────────────────────────────────────────

  describe('transfer', () => {
    it('should remove items from sender and add to receiver', async () => {
      const toUser = { id: 'other-uuid', name: 'Jane' } as User;
      const items = {
        equipments: [{ name: 'SAUCEPAN', quantity: 1 }] as InventoryEquipment[],
      };

      jest.spyOn(service, 'removeItems').mockResolvedValue(mockInventory);
      jest.spyOn(service, 'addItems').mockResolvedValue(mockInventory);

      await service.transfer(mockUser.id, toUser.id, items);

      expect(service.removeItems).toHaveBeenCalledWith(mockUser.id, items);
      expect(service.addItems).toHaveBeenCalledWith(toUser.id, items);
    });
  });
});
