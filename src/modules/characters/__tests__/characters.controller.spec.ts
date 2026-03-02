import { Test, TestingModule } from '@nestjs/testing';
import { CharacterController } from '@characters/characters.controller';
import { CharacterService } from '@characters/characters.service';
import { AuthGuard } from '@src/modules/auth/auth.guard';

describe('CharacterController', () => {
  let controller: CharacterController;
  let service: CharacterService;

  const mockCharacterService = {
    getAllCharacters: jest.fn(),
    getCharacterById: jest.fn(),
    createCharacter: jest.fn(),
    deleteCharacter: jest.fn(),
    addEquipments: jest.fn(),
    removeEquipments: jest.fn(),
  };

  const mockUser = { id: 'user-1' } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [
        {
          provide: CharacterService,
          useValue: mockCharacterService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CharacterController>(CharacterController);
    service = module.get<CharacterService>(CharacterService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCharacters', () => {
    it('should call service.getAllCharacters with user id', async () => {
      mockCharacterService.getAllCharacters.mockResolvedValue([]);

      await controller.getAllCharacters(mockUser);

      expect(service.getAllCharacters).toHaveBeenCalledWith('user-1');
    });
  });

  describe('getCharacterById', () => {
    it('should call service.getCharacterById', async () => {
      mockCharacterService.getCharacterById.mockResolvedValue({});

      await controller.getCharacterById('char-1');

      expect(service.getCharacterById).toHaveBeenCalledWith('char-1');
    });
  });

  describe('createCharacter', () => {
    it('should call service.createCharacter', async () => {
      const dto = { name: 'Hugo' } as any;
      mockCharacterService.createCharacter.mockResolvedValue({});

      await controller.createCharacter(mockUser, dto);

      expect(service.createCharacter).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('deleteCharacter', () => {
    it('should call service.deleteCharacter', async () => {
      mockCharacterService.deleteCharacter.mockResolvedValue(undefined);

      await controller.deleteCharacter('char-1', mockUser);

      expect(service.deleteCharacter).toHaveBeenCalledWith('user-1', 'char-1');
    });
  });

  describe('setEquipment', () => {
    it('should call service.addEquipments', async () => {
      const equipments = [{ slot: 'HEAD' }] as any;
      mockCharacterService.addEquipments.mockResolvedValue({});

      await controller.setEquipment('char-1', mockUser, equipments);

      expect(service.addEquipments).toHaveBeenCalledWith(
        'user-1',
        'char-1',
        equipments,
      );
    });
  });

  describe('removeEquipment', () => {
    it('should call service.removeEquipments', async () => {
      const slots = ['HEAD'] as any;
      mockCharacterService.removeEquipments.mockResolvedValue({});

      await controller.removeEquipment('char-1', mockUser, slots);

      expect(service.removeEquipments).toHaveBeenCalledWith(
        'user-1',
        'char-1',
        slots,
      );
    });
  });

  describe('removeAllEquipment', () => {
    it('should call service.removeEquipments with all slots', async () => {
      mockCharacterService.removeEquipments.mockResolvedValue({});

      await controller.removeAllEquipment('char-1', mockUser);

      expect(service.removeEquipments).toHaveBeenCalled();
    });
  });
});
