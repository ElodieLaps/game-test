import { Character } from '@characters/character.entity';
import { InventoryService } from '@inventories/inventories.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeamService } from '@src/modules/teams/teams.service';
import { User } from '@src/modules/users/user.entity';
import { Team } from '@teams/team.entity';
import { Repository } from 'typeorm';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepo: Repository<Team>;
  let charRepo: Repository<Character>;

  const mockUser: Omit<
    User,
    | 'isVerified'
    | 'verificationToken'
    | 'verificationTokenExpiresAt'
    | 'inventory'
  > = {
    id: 'user-1',
    name: 'John',
    email: 'test@example.com',
    password: 'hashed',
    teams: [],
    characters: [],
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
    remove: jest.fn(),
  };

  const mockCharRepo = {
    findBy: jest.fn(),
    save: jest.fn(),
  };

  const mockInventoryService = {
    getInventory: jest.fn(),
    transfer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        { provide: getRepositoryToken(Team), useValue: mockTeamRepo },
        { provide: getRepositoryToken(Character), useValue: mockCharRepo },
        { provide: InventoryService, useValue: mockInventoryService },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    teamRepo = module.get(getRepositoryToken(Team));
    charRepo = module.get(getRepositoryToken(Character));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTeam', () => {
    it('should create and save a team', async () => {
      mockTeamRepo.create.mockReturnValue(mockTeam);
      mockTeamRepo.save.mockResolvedValue(mockTeam);
      mockInventoryService.getInventory.mockResolvedValue(null);

      const result = await service.createTeam(mockUser.id, { name: 'My Team' });

      expect(mockTeamRepo.create).toHaveBeenCalledWith({
        name: 'My Team',
        userId: 'user-1',
        characters: [],
      });
      expect(mockInventoryService.getInventory).toHaveBeenCalledWith(
        mockTeam.id,
      );
      expect(mockTeamRepo.save).toHaveBeenCalledWith(mockTeam);
      expect(result).toEqual(mockTeam);
    });

    it('should throw if an error occurs', async () => {
      mockTeamRepo.create.mockReturnValue(mockTeam);
      mockInventoryService.getInventory.mockRejectedValue(new Error('fail'));

      await expect(
        service.createTeam(mockUser.id, { name: 'My Team' }),
      ).rejects.toThrow('Error creating team');
    });
  });

  describe('deleteTeam', () => {
    it('should transfer inventory and delete the team', async () => {
      const mockInventory = { items: ['item-1'] };
      mockTeamRepo.findOne.mockResolvedValue(mockTeam);
      mockInventoryService.getInventory.mockResolvedValue(mockInventory);
      mockInventoryService.transfer.mockResolvedValue(undefined);
      mockTeamRepo.remove.mockResolvedValue(undefined);

      await service.deleteTeam(mockUser.id, 'team-1');

      expect(mockTeamRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'team-1', userId: 'user-1' },
        relations: ['characters'],
      });
      expect(mockInventoryService.getInventory).toHaveBeenCalledWith('team-1');
      expect(mockInventoryService.transfer).toHaveBeenCalledWith(
        'team-1',
        'user-1',
        mockInventory.items,
      );
      expect(mockTeamRepo.remove).toHaveBeenCalledWith(mockTeam);
    });

    it('should delete the team even if no inventory', async () => {
      mockTeamRepo.findOne.mockResolvedValue(mockTeam);
      mockInventoryService.getInventory.mockResolvedValue(null);
      mockTeamRepo.remove.mockResolvedValue(undefined);

      await service.deleteTeam(mockUser.id, 'team-1');

      expect(mockInventoryService.transfer).not.toHaveBeenCalled();
      expect(mockTeamRepo.remove).toHaveBeenCalledWith(mockTeam);
    });

    it('should throw NotFoundException if team not found', async () => {
      mockTeamRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteTeam(mockUser.id, 'team-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTeams', () => {
    it('should return all teams for a user', async () => {
      mockTeamRepo.find.mockResolvedValue([mockTeam]);

      const result = await service.getTeams('user-1');

      expect(result).toEqual([mockTeam]);
      expect(mockTeamRepo.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        relations: ['characters'],
      });
    });

    it('should throw if an error occurs', async () => {
      mockTeamRepo.find.mockRejectedValue(new Error('db error'));

      await expect(service.getTeams('user-1')).rejects.toThrow(
        'Error getting user teams',
      );
    });
  });

  describe('getTeamById', () => {
    it('should return a team by id', async () => {
      mockTeamRepo.findOne.mockResolvedValue(mockTeam);

      const result = await service.getTeamById('user-1', 'team-1');

      expect(result).toEqual(mockTeam);
      expect(mockTeamRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'team-1', userId: 'user-1' },
        relations: ['characters'],
      });
    });

    it('should throw NotFoundException if team not found', async () => {
      mockTeamRepo.findOne.mockResolvedValue(null);

      await expect(service.getTeamById('user-1', 'team-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addCharacters', () => {
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
      mockCharRepo.findBy.mockResolvedValue([mockCharacters[0]]);

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

  describe('removeCharacters', () => {
    it('should remove characters from a team', async () => {
      const charsInTeam = [
        { ...mockCharacters[0], teamId: 'team-1' },
        { ...mockCharacters[1], teamId: 'team-1' },
      ];
      mockTeamRepo.findOne.mockResolvedValue(mockTeam);
      mockCharRepo.findBy.mockResolvedValue(charsInTeam);
      mockCharRepo.save.mockResolvedValue(charsInTeam);

      await service.removeCharacters(mockUser.id, 'team-1', [
        'char-1',
        'char-2',
      ]);

      expect(mockCharRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          { ...mockCharacters[0], teamId: null },
          { ...mockCharacters[1], teamId: null },
        ]),
      );
    });

    it('should throw NotFoundException if team not found', async () => {
      mockTeamRepo.findOne.mockResolvedValue(null);

      await expect(
        service.removeCharacters(mockUser.id, 'team-1', ['char-1']),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
