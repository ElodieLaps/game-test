import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CharacterService } from '@characters/characters.service';
import { Character } from '@characters/character.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TeamController } from '@src/modules/teams/teams.controller';

describe('CharacterService', () => {
  let service: CharacterService;
  let repo: jest.Mocked<Repository<Character>>;

  const mockCharacter = {
    id: 'char-1',
    userId: 'user-1',
    teamId: null,
    equipments: {},
    statistics: {
      STRENGTH: { value: 10, currentValue: 10 },
    },
  } as any;

  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        {
          provide: getRepositoryToken(Character),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
    repo = module.get(getRepositoryToken(Character));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // =========================
  // GET ALL
  // =========================

  it('should return all characters for user', async () => {
    repo.find.mockResolvedValue([mockCharacter]);

    const result = await service.getAllCharacters('user-1');

    expect(repo.find).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    });
    expect(result).toEqual([mockCharacter]);
  });

  // =========================
  // GET BY ID
  // =========================

  it('should return character by id', async () => {
    repo.findOneBy.mockResolvedValue(mockCharacter);

    const result = await service.getCharacterById('char-1');

    expect(result).toEqual(mockCharacter);
  });

  it('should throw if character not found (getById)', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.getCharacterById('char-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  // =========================
  // CREATE
  // =========================

  it('should create character', async () => {
    repo.count.mockResolvedValue(0);
    repo.create.mockReturnValue(mockCharacter);
    repo.save.mockResolvedValue(mockCharacter);

    const result = await service.createCharacter('user-1', {
      name: 'Hugo',
    } as any);

    expect(repo.count).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockCharacter);
  });

  it('should throw if user has 12 characters', async () => {
    repo.count.mockResolvedValue(12);

    await expect(service.createCharacter('user-1', {} as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  // =========================
  // DELETE
  // =========================

  it('should delete character', async () => {
    repo.findOneBy.mockResolvedValue(mockCharacter);

    await service.deleteCharacter('user-1', 'char-1');

    expect(repo.remove).toHaveBeenCalledWith(mockCharacter);
  });

  it('should throw if character not found (delete)', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.deleteCharacter('user-1', 'char-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  // =========================
  // ADD EQUIPMENTS
  // =========================

  it('should add equipment and apply bonuses', async () => {
    const equipment = {
      slot: 'HEAD',
      statistics: [{ name: 'STRENGTH', value: 5 }],
    };

    repo.findOneBy.mockResolvedValue({
      ...mockCharacter,
      equipments: {},
    });

    repo.save.mockResolvedValue(mockCharacter);

    await service.addEquipments('user-1', 'char-1', [equipment as any]);

    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if character not found (addEquipments)', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.addEquipments('user-1', 'char-1', [])).rejects.toThrow(
      NotFoundException,
    );
  });

  // =========================
  // REMOVE EQUIPMENTS
  // =========================

  it('should remove equipment and remove bonuses', async () => {
    const characterWithEquip = {
      ...mockCharacter,
      equipments: {
        HEAD: {
          slot: 'HEAD',
          statistics: [{ name: 'STRENGTH', value: 5 }],
        },
      },
    };

    repo.findOneBy.mockResolvedValue(characterWithEquip);
    repo.save.mockResolvedValue(characterWithEquip);

    await service.removeEquipments('user-1', 'char-1', ['HEAD'] as any);

    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if character not found (removeEquipments)', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(
      service.removeEquipments('user-1', 'char-1', [] as any),
    ).rejects.toThrow(NotFoundException);
  });
});
