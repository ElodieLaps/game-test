import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Character } from '@characters/character.entity';
import { CharacterService } from '@characters/characters.service';
import { Repository } from 'typeorm';

describe('CharacterService', () => {
  let service: CharacterService;
  let repo: Repository<Character>;

  const mockCharacters = [
    {
      id: 'd0ee8d51-f6e1-4f26-97ff-1dabc1afbbc1',
      name: 'Hugo',
      gender: 'MALE' as const,
      userId: '649683eb-f0d5-4fc4-a105-728443325a7c',
      teamId: 'aa48f96b-e4ea-4b9f-b360-f8c175499a5f',
      level: 1,
      race: 'HUMAN' as const,
      role: 'PRIEST' as const,
      statuses: [],
      statistics: {
        HEALTH: { value: 100, currentValue: 100, progressIndex: 5 },
      },
      equipments: {
        WEAPON: {
          name: 'Wooden Staff',
          slot: 'WEAPON',
          typeName: 'STAFF',
          statistics: [{ name: 'POWER', value: 3 }],
        },
      },
      user: { id: '649683eb-f0d5-4fc4-a105-728443325a7c' },
      team: { id: 'aa48f96b-e4ea-4b9f-b360-f8c175499a5f' },
    },
    {
      id: '65568877-2763-45de-9465-4fb46cd0a2cd',
      name: 'Lily',
      gender: 'FEMALE' as const,
      userId: '649683eb-f0d5-4fc4-a105-728443325a7c',
      teamId: 'aa48f96b-e4ea-4b9f-b360-f8c175499a5f',
      level: 1,
      race: 'KIRIN' as const,
      role: 'MAGE' as const,
      statuses: [],
      statistics: { HEALTH: { value: 85, currentValue: 85, progressIndex: 4 } },
      equipments: {
        WEAPON: {
          name: 'Wooden Staff',
          slot: 'WEAPON',
          typeName: 'STAFF',
          statistics: [{ name: 'POWER', value: 3 }],
        },
      },
      user: { id: '649683eb-f0d5-4fc4-a105-728443325a7c' },
      team: { id: 'aa48f96b-e4ea-4b9f-b360-f8c175499a5f' },
    },
  ];

  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        { provide: getRepositoryToken(Character), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
    repo = module.get<Repository<Character>>(getRepositoryToken(Character));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCharacters', () => {
    it('should return all characters for a user', async () => {
      const userId = 'user-1';
      mockRepo.find.mockResolvedValue(
        mockCharacters.filter((c) => c.userId === userId),
      );

      const result = await service.getAllCharacters(userId);
      expect(result).toEqual(mockCharacters.filter((c) => c.userId === userId));
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('getCharacterById', () => {
    it('should return a character if found', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockCharacters[0]);

      const result = await service.getCharacterById(mockCharacters[0].id);
      expect(result).toEqual(mockCharacters[0]);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({
        id: mockCharacters[0].id,
      });
    });

    it('should throw an error if character not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.getCharacterById('unknown-id')).rejects.toThrow();
    });
  });
});
