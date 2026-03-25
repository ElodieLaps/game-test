import { AuthController } from '@auth/auth.controller';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestTimingInterceptor } from '@src/common/interceptors/requestTiming.interceptor';
import type { User } from '@users/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockUser: Partial<User> = {
  id: '1',
  email: 'a@b.com',
  name: 'john',
};

const mockAuthService = {
  login: jest.fn(),
  getAuthUser: jest.fn(),
  register: jest.fn(),
  verifyEmail: jest.fn(),
  resendVerificationEmail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('http://localhost:5173'),
};

const mockRes = {
  redirect: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: typeof mockAuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideInterceptor(RequestTimingInterceptor)
      .useValue({ intercept: jest.fn((ctx, next) => next.handle()) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(
      AuthService,
    ) as unknown as typeof mockAuthService;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /login', () => {
    it('should call authService.login with body', async () => {
      mockAuthService.login.mockResolvedValue({ access_token: 'token' });

      await controller.login({ email: 'a@b.com', password: 'b' });

      expect(service.login).toHaveBeenCalledWith({
        email: 'a@b.com',
        password: 'b',
      });
    });

    it('should return token', async () => {
      mockAuthService.login.mockResolvedValue({ access_token: 'token' });

      const result = await controller.login({
        email: 'a@b.com',
        password: 'b',
      });

      expect(result).toEqual({ token: 'token' });
    });
  });

  describe('GET /user', () => {
    it('should call authService.getAuthUser with user id', async () => {
      mockAuthService.getAuthUser.mockResolvedValue(mockUser);

      await controller.getAuthUser({ user: { id: '1' } });

      expect(service.getAuthUser).toHaveBeenCalledWith('1');
    });

    it('should return the user', async () => {
      mockAuthService.getAuthUser.mockResolvedValue(mockUser);

      const result = await controller.getAuthUser({ user: { id: '1' } });

      expect(result).toEqual(mockUser);
    });
  });

  describe('POST /register', () => {
    it('should call authService.register with body', async () => {
      mockAuthService.register.mockResolvedValue(undefined);

      await controller.register({
        email: 'a@b.com',
        password: 'b',
        name: 'john',
      });

      expect(service.register).toHaveBeenCalledWith({
        email: 'a@b.com',
        password: 'b',
        name: 'john',
      });
    });

    it('should return void on success', async () => {
      mockAuthService.register.mockResolvedValue(undefined);

      const result = await controller.register({
        email: 'a@b.com',
        password: 'b',
        name: 'john',
      });

      expect(result).toBeUndefined();
    });

    it('should throw if authService.register throws', async () => {
      mockAuthService.register.mockRejectedValue(
        new Error('Registration failed'),
      );

      await expect(
        controller.register({ email: 'a@b.com', password: 'b', name: 'john' }),
      ).rejects.toThrow('Registration failed');
    });
  });

  describe('GET /verify/:token', () => {
    it('should redirect to succeeded on valid token', async () => {
      mockAuthService.verifyEmail.mockResolvedValue(undefined);

      await controller.verifyEmail('valid-token', mockRes as any);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        301,
        'http://localhost:5173/verification/succeeded',
      );
    });

    it('should redirect to expired if token is expired', async () => {
      mockAuthService.verifyEmail.mockRejectedValue(
        new BadRequestException('Verification link has expired'),
      );

      await controller.verifyEmail('expired-token', mockRes as any);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        301,
        'http://localhost:5173/verification/expired',
      );
    });

    it('should redirect to failed on NotFoundException', async () => {
      mockAuthService.verifyEmail.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await controller.verifyEmail('invalid-token', mockRes as any);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        301,
        'http://localhost:5173/verification/failed',
      );
    });
  });

  describe('POST /resend-verification', () => {
    it('should call authService.resendVerificationEmail with email', async () => {
      mockAuthService.resendVerificationEmail.mockResolvedValue(undefined);

      await controller.resendVerificationEmail('a@b.com');

      expect(service.resendVerificationEmail).toHaveBeenCalledWith('a@b.com');
    });

    it('should return void on success', async () => {
      mockAuthService.resendVerificationEmail.mockResolvedValue(undefined);

      const result = await controller.resendVerificationEmail('a@b.com');

      expect(result).toBeUndefined();
    });

    it('should throw if user not found', async () => {
      mockAuthService.resendVerificationEmail.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.resendVerificationEmail('unknown@b.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
