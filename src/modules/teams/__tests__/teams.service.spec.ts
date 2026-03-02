import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from '@teams/team.entity';
import { Character } from '@characters/character.entity';
import { TeamService } from '@teams/teams.service';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CharacterService } from '@src/modules/characters/characters.service';
import { User } from '@src/modules/users/user.entity';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepo: Repository<Team>;
  let charRepo: Repository<Character>;

  const mockUser: User = {
    id: 'user-1',
    name: 'John',
    email: 'test@example.com',
    password: 'hashed',
    teams: [],
  };

  const mockTeam = {
    id: 'team-1',
    name: 'My Team',
    userId: 'user-1',
    characters: [],
  };

  const mockCharacters = [
    { id: 'char-1', name: 'Hugo', teamId: null },
    { id: 'char-2', name: 'Lily', teamId: null },
  ];

  const mockTeamRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCharRepo = {
    findBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        CharacterService,
        { provide: getRepositoryToken(Team), useValue: mockTeamRepo },
        { provide: getRepositoryToken(Character), useValue: mockCharRepo },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    teamRepo = module.get(getRepositoryToken(Team));
    charRepo = module.get(getRepositoryToken(Character));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTeam', () => {
    it('should create and save a team', async () => {
      mockTeamRepo.create.mockReturnValue(mockTeam);
      mockTeamRepo.save.mockResolvedValue(mockTeam);

      const result = await service.createTeam(mockUser.id, {
        name: 'My Team',
      });
      expect(result).toBeUndefined();
      expect(mockTeamRepo.create).toHaveBeenCalledWith({
        name: 'My Team',
        userId: 'user-1',
        characters: [],
      });
      expect(mockTeamRepo.save).toHaveBeenCalledWith(mockTeam);
    });
  });

  describe('getUserTeams', () => {
    it('should return all teams for a user', async () => {
      mockTeamRepo.find.mockResolvedValue([mockTeam]);
      const result = await service.getTeams('user-1');
      expect(result).toEqual([mockTeam]);
      expect(mockTeamRepo.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        relations: ['characters'],
      });
    });
  });

  describe('addCharactersToTeam', () => {
    it('should add characters to a team', async () => {
      mockTeamRepo.findOne.mockResolvedValue(mockTeam);
      mockCharRepo.findBy.mockResolvedValue(mockCharacters);
      mockCharRepo.save.mockResolvedValue(mockCharacters);

      await service.addCharacters(mockUser.id, 'team-1', ['char-1', 'char-2']);

      expect(mockCharRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          { ...mockCharacters[0], teamId: 'team-1' },
          { ...mockCharacters[1], teamId: 'team-1' },
        ]),
      );
    });

    it('should throw NotFoundException if team not found', async () => {
      mockTeamRepo.findOne.mockResolvedValue(null);

      await expect(
        service.addCharacters(mockUser.id, 'team-1', ['char-1']),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if some characters not found', async () => {
      mockTeamRepo.findOne.mockResolvedValue(mockTeam);
      mockCharRepo.findBy.mockResolvedValue([mockCharacters[0]]); // un seul trouvé

      await expect(
        service.addCharacters(mockUser.id, 'team-1', ['char-1', 'char-2']),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if character already in another team', async () => {
      mockTeamRepo.findOne.mockResolvedValue(mockTeam);
      mockCharRepo.findBy.mockResolvedValue([
        { ...mockCharacters[0], teamId: 'other-team' },
      ]);

      await expect(
        service.addCharacters(mockUser.id, 'team-1', ['char-1']),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
