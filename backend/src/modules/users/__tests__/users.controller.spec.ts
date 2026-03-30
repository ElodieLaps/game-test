import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@users/users.controller';
import { UserService } from '@users/users.service';
import { User } from '@users/user.entity';
import { UserBodyDto } from '@src/modules/users/user.body.dto';
import { UsersInterceptor } from '@users/users.interceptor';
import { AuthGuard } from '@auth/auth.guard';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    deleteUser: jest.fn(),
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
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideInterceptor(UsersInterceptor)
      .useValue({
        intercept: (_: unknown, next: { handle: () => unknown }) =>
          next.handle(),
      })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a single user', async () => {
      const user: Partial<User> = {
        id: '1',
        name: 'Alice',
        email: 'a@b.com',
        password: 'hashed',
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
      const created: Partial<User> = { id: '3', ...dto, password: 'hashed' };
      mockUserService.createUser.mockResolvedValue(created);

      const result = await controller.createUser(dto);

      expect(result).toEqual(created);
      expect(mockUserService.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return void', async () => {
      mockUserService.deleteUser.mockResolvedValue(undefined);

      const result = await controller.deleteUser('1');

      expect(result).toBeUndefined();
      expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
    });
  });
});
