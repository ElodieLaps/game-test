import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@src/modules/users/user.entity';
import { Team } from '@teams/team.entity';
import { TeamService } from '@src/modules/teams/teams.service';
import { TeamController } from '../teams.controller';
import { TeamBodyDto } from '../team.body.dto';
import { AuthGuard } from '@src/modules/auth/auth.guard';
import { Inventory } from '@src/modules/inventories/inventory.entity';

describe('TeamController', () => {
  let controller: TeamController;
  let service: jest.Mocked<TeamService>;

  const mockUser: User = {
    id: 'user-1',
    name: 'John',
    email: 'test@example.com',
    password: 'hashed',
    teams: [],
    characters: [],
    isVerified: true,
    verificationToken: null,
    verificationTokenExpiresAt: null,
    inventory: new Inventory(),
  };

  const mockTeam = {
    id: 'team-1',
    name: 'My Team',
    userId: 'user-1',
    characters: [],
    inventory: [],
    user: mockUser,
  } as Team;

  const mockTeamService = {
    createTeam: jest.fn(),
    deleteTeam: jest.fn(),
    getTeams: jest.fn(),
    getTeamById: jest.fn(),
    addCharacters: jest.fn(),
    removeCharacters: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get(TeamService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTeam', () => {
    it('should call TeamService.createTeam and return the result', async () => {
      const dto = { name: 'My Team' } as TeamBodyDto;
      service.createTeam.mockResolvedValue(mockTeam);

      const result = await controller.createTeam(mockUser as User, dto);

      expect(service.createTeam).toHaveBeenCalledWith(mockUser.id, dto);
      expect(result).toEqual(mockTeam);
    });
  });

  describe('deleteTeam', () => {
    it('should call TeamService.deleteTeam', async () => {
      service.deleteTeam.mockResolvedValue(undefined);

      const result = await controller.deleteTeam(mockUser as User, 'team-1');

      expect(service.deleteTeam).toHaveBeenCalledWith(mockUser.id, 'team-1');
      expect(result).toBeUndefined();
    });
  });

  describe('getTeams', () => {
    it('should return teams for a given user', async () => {
      service.getTeams.mockResolvedValue([mockTeam]);

      const result = await controller.getTeams(mockUser as User);

      expect(service.getTeams).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual([mockTeam]);
    });
  });

  describe('getTeamById', () => {
    it('should return a team by id', async () => {
      service.getTeamById.mockResolvedValue(mockTeam);

      const result = await controller.getTeamById(mockUser as User, 'team-1');

      expect(service.getTeamById).toHaveBeenCalledWith(mockUser.id, 'team-1');
      expect(result).toEqual(mockTeam);
    });
  });

  describe('addCharacters', () => {
    it('should call TeamService.addCharacters', async () => {
      service.addCharacters.mockResolvedValue(undefined);

      const result = await controller.addCharacters(
        mockUser as User,
        'team-1',
        ['char-1'],
      );

      expect(service.addCharacters).toHaveBeenCalledWith(
        mockUser.id,
        'team-1',
        ['char-1'],
      );
      expect(result).toBeUndefined();
    });
  });

  describe('removeCharacters', () => {
    it('should call TeamService.removeCharacters', async () => {
      service.removeCharacters.mockResolvedValue(undefined);

      const result = await controller.removeCharacters(
        mockUser as User,
        'team-1',
        ['char-1'],
      );

      expect(service.removeCharacters).toHaveBeenCalledWith(
        mockUser.id,
        'team-1',
        ['char-1'],
      );
      expect(result).toBeUndefined();
    });
  });
});
