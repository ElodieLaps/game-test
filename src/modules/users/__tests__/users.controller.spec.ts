import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@users/users.controller';
import { UserService } from '@users/users.service';
import { User } from '@users/user.entity';
import { UserBodyDto } from '@users/userBodyDto';
import { UserInterceptor } from '@users/users.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: '1',
          name: 'Alice',
          email: 'a@b.com',
          password: 'hashed',
          teams: [],
        },
        {
          id: '2',
          name: 'Bob',
          email: 'b@c.com',
          password: 'hashed',
          teams: [],
        },
      ];
      mockUserService.getAllUsers.mockResolvedValue(users);

      const result = await controller.getAllUsers();
      expect(result).toEqual(users);
      expect(mockUserService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a single user', async () => {
      const user: User = {
        id: '1',
        name: 'Alice',
        email: 'a@b.com',
        password: 'hashed',
        teams: [],
      };
      mockUserService.getUserById.mockResolvedValue(user);

      const result = await controller.getUserById('1');
      expect(result).toEqual(user);
      expect(mockUserService.getUserById).toHaveBeenCalledWith('1');
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const dto: UserBodyDto = {
        name: 'Charlie',
        email: 'c@d.com',
        password: 'secret',
      };
      const user: User = { id: '3', ...dto, password: 'hashed', teams: [] };
      mockUserService.createUser.mockResolvedValue(user);

      const result = await controller.createUser(dto);
      expect(result).toEqual(user);
      expect(mockUserService.createUser).toHaveBeenCalledWith(dto);
    });
  });
});
