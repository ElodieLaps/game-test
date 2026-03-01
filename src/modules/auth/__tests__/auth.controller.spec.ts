import { AuthController } from '@auth/auth.controller';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';

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

    await controller.getAuth({ name: 'a', password: 'b' });

    expect(loginSpy).toHaveBeenCalledWith({ name: 'a', password: 'b' });
  });

  it('should return access token', async () => {
  jest
    .spyOn(service, 'login')
    .mockResolvedValue({ access_token: 'token' });

  const result = await controller.getAuth({ name: 'a', password: 'b' });

  expect(result).toEqual({ access_token: 'token' });
});
});
