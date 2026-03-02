import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@src/modules/users/user.entity';
import { Team } from '@teams/team.entity';
import { TeamService } from '@teams/teams.service';
import { TeamController } from '../teams.controller';
import { TeamBodyDto } from '../team.body.dto';
import { AuthGuard } from '@src/modules/auth/auth.guard';

describe('TeamController', () => {
  let controller: TeamController;
  let service: jest.Mocked<TeamService>;

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
    user: mockUser,
  } as Team;

  const mockTeamService = {
    createTeam: jest.fn(),
    getTeams: jest.fn(),
    addCharacters: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTeam', () => {
    it('should call TeamService.createTeam', async () => {
      const dto = { name: 'My Team', userId: 'user-1' } as TeamBodyDto;

      service.createTeam.mockResolvedValue(undefined);

      const result = await controller.createTeam(mockUser, dto);

      expect(service.createTeam).toHaveBeenCalledWith(mockUser.id, dto);
      expect(result).toBeUndefined();
    });
  });

  describe('getUserTeams', () => {
    it('should return teams for a given user', async () => {
      service.getTeams.mockResolvedValue([mockTeam]);

      const result = await controller.getTeams('user-1');

      expect(service.getTeams).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockTeam]);
    });
  });

  describe('addCharacters', () => {
    it('should call TeamService.addCharacters', async () => {
      service.addCharacters.mockResolvedValue(undefined);

      const result = await controller.addCharacters(mockUser, 'team-1', [
        'char-1',
      ]);

      expect(service.addCharacters).toHaveBeenCalledWith(
        mockUser.id,
        'team-1',
        ['char-1'],
      );
      expect(result).toBeUndefined();
    });
  });
});
