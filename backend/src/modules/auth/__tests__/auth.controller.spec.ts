import { AuthController } from '@auth/auth.controller';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@src/modules/users/user.entity';

const mockUser = {
  id: '1',
  email: 'a@b.com',
  name: 'john',
} as Partial<User>;

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            getUserFromRequest: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.login', async () => {
    const loginSpy = jest
      .spyOn(service, 'login')
      .mockResolvedValue({ access_token: 'token' });

    await controller.getAuth({ email: 'a@b.com', password: 'b' });

    expect(loginSpy).toHaveBeenCalledWith({ email: 'a@b.com', password: 'b' });
  });

  it('should return access token', async () => {
    jest.spyOn(service, 'login').mockResolvedValue({ access_token: 'token' });

    const result = await controller.getAuth({
      email: 'a@b.com',
      password: 'b',
    });

    expect(result).toEqual({ token: 'token' });
  });

  describe('getAuthUser (GET /user)', () => {
    it('should call getUserFromRequest with the user id from request', async () => {
      const getSpy = jest
        .spyOn(service, 'getUserFromRequest')
        .mockResolvedValue(mockUser as Omit<User, 'password'>);

      await controller.getAuthUser({ user: { id: 1 } });

      expect(getSpy).toHaveBeenCalledWith(1);
    });

    it('should return the user without password', async () => {
      jest
        .spyOn(service, 'getUserFromRequest')
        .mockResolvedValue(mockUser as Omit<User, 'password'>);

      const result = await controller.getAuthUser({ user: { id: 1 } });

      expect(result).toEqual(mockUser);
    });
  });
});
