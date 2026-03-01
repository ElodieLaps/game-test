import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from '@teams/team.entity';
import { Character } from '@characters/character.entity';
import { TeamService } from '@teams/teams.service';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepo: Repository<Team>;
  let charRepo: Repository<Character>;

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

      const result = await service.createTeam({
        name: 'My Team',
        userId: 'user-1',
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
      const result = await service.getUserTeams('user-1');
      expect(result).toEqual([mockTeam]);
      expect(mockTeamRepo.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        relations: ['characters'],
      });
    });
  });

  describe('addCharactersToTeam', () => {
    it('should add characters to a team', async () => {
      // mock team exists
      mockTeamRepo.findOne.mockResolvedValue(mockTeam);
      // mock characters exist
      mockCharRepo.findBy.mockResolvedValue(mockCharacters);
      // mock save resolves
      mockCharRepo.save.mockResolvedValue(mockCharacters);

      await service.addCharactersToTeam('team-1', ['char-1', 'char-2']);

      // vérifier que les personnages ont bien été mis à jour
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
        service.addCharactersToTeam('team-1', ['char-1']),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if some characters not found', async () => {
      mockTeamRepo.findOne.mockResolvedValue(mockTeam);
      mockCharRepo.findBy.mockResolvedValue([mockCharacters[0]]); // un seul trouvé

      await expect(
        service.addCharactersToTeam('team-1', ['char-1', 'char-2']),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if character already in another team', async () => {
      mockTeamRepo.findOne.mockResolvedValue(mockTeam);
      mockCharRepo.findBy.mockResolvedValue([
        { ...mockCharacters[0], teamId: 'other-team' },
      ]);

      await expect(
        service.addCharactersToTeam('team-1', ['char-1']),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
