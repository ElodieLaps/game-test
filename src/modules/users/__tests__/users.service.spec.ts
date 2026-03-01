import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@users/users.service';
import { TeamService } from '@teams/teams.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@users/user.entity';
import { Repository } from 'typeorm';
import { UserBodyDto } from '@users/userBodyDto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;
  let teamService: TeamService;

  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTeamService = {
    createTeam: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: TeamService, useValue: mockTeamService },
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    teamService = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: '1',
          name: 'Alice',
          email: 'a@b.com',
          password: 'hashed',
          teams: [],
        },
      ];
      mockRepo.find.mockResolvedValue(users);

      const result = await service.getAllUsers();
      expect(result).toEqual(users);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const user = {
        id: '1',
        name: 'Alice',
        email: 'a@b.com',
        password: 'hashed',
        teams: [],
      };
      mockRepo.findOneBy.mockResolvedValue(user);

      const result = await service.getUserById('1');
      expect(result).toEqual(user);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw error if user not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.getUserById('1')).rejects.toThrow(
        'Error getting user by id',
      );
    });
  });

  describe('getUserByName', () => {
    it('should return user if found', async () => {
      const user = {
        id: '1',
        name: 'Alice',
        email: 'a@b.com',
        password: 'hashed',
        teams: [],
      };
      mockRepo.findOneBy.mockResolvedValue(user);

      const result = await service.getUserByName('Alice');
      expect(result).toEqual(user);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ name: 'Alice' });
    });

    it('should throw error if user not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.getUserByName('Alice')).rejects.toThrow(
        'Error getting user by name',
      );
    });
  });

  describe('createUser', () => {
    it('should hash password, save user and create a team', async () => {
      const dto: UserBodyDto = {
        name: 'Alice',
        email: 'a@b.com',
        password: 'secret',
      };
      const user = { ...dto, password: 'hashed', id: '1', teams: [] };

      mockRepo.create.mockReturnValue(user);
      mockRepo.save.mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      await service.createUser(dto);

      expect(mockRepo.create).toHaveBeenCalledWith({
        ...dto,
        password: 'hashed',
      });
      expect(mockRepo.save).toHaveBeenCalledWith(user);
      expect(mockTeamService.createTeam).toHaveBeenCalledWith({
        name: 'My Team',
        userId: '1',
      });
    });
  });
});
