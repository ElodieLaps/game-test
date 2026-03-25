import { InventoryController } from '@inventories/inventories.controller';
import { InventoryService } from '@inventories/inventories.service';
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryConsumable, InventoryEquipment } from '@shared';
import { AuthGuard } from '@src/modules/auth/auth.guard';
import { User } from '@users/user.entity';

const mockUser: User = {
  id: 'user-uuid',
  name: 'John',
  email: 'john@example.com',
} as User;

const mockInventory = {
  id: 'inventory-uuid',
  user: mockUser,
  items: { equipments: [], consumables: [] },
};

const mockInventoryService = {
  getInventory: jest.fn(),
  addItems: jest.fn(),
  removeItems: jest.fn(),
  transfer: jest.fn(),
};

describe('InventoryController', () => {
  let controller: InventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        { provide: InventoryService, useValue: mockInventoryService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<InventoryController>(InventoryController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getInventory', () => {
    it('should return the inventory of the current user', async () => {
      mockInventoryService.getInventory.mockResolvedValue(mockInventory);

      const result = await controller.getInventory(mockUser);

      expect(mockInventoryService.getInventory).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(result).toEqual(mockInventory);
    });
  });

  describe('addItems', () => {
    it('should add items to the current user inventory', async () => {
      const body = {
        equipments: [{ name: 'SAUCEPAN', quantity: 1 }] as InventoryEquipment[],
        consumables: [] as InventoryConsumable[],
      };
      mockInventoryService.addItems.mockResolvedValue(mockInventory);

      const result = await controller.addItems(mockUser, body);

      expect(mockInventoryService.addItems).toHaveBeenCalledWith(
        mockUser.id,
        body,
      );
      expect(result).toEqual(mockInventory);
    });
  });

  describe('removeItems', () => {
    it('should remove items from the current user inventory', async () => {
      const body = {
        equipments: [{ name: 'SAUCEPAN', quantity: 1 }] as InventoryEquipment[],
        consumables: [] as InventoryConsumable[],
      };
      mockInventoryService.removeItems.mockResolvedValue(mockInventory);

      const result = await controller.removeItems(mockUser, body);

      expect(mockInventoryService.removeItems).toHaveBeenCalledWith(
        mockUser.id,
        body,
      );
      expect(result).toEqual(mockInventory);
    });
  });

  describe('transfer', () => {
    it('should transfer items from current user to another user', async () => {
      const toUser = { id: 'other-uuid', name: 'Jane' } as User;
      const body = {
        toUserId: toUser.id,
        equipments: [{ name: 'SAUCEPAN', quantity: 1 }] as InventoryEquipment[],
        consumables: [] as InventoryConsumable[],
      };
      mockInventoryService.transfer.mockResolvedValue(undefined);

      await controller.transfer(mockUser, body);

      expect(mockInventoryService.transfer).toHaveBeenCalledWith(
        mockUser.id,
        toUser.id,
        body,
      );
    });
  });
});
