import { AuthGuard } from '@auth/auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const mockJwtService = {
  verifyAsync: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('secret'),
};

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new AuthGuard(
      mockJwtService as unknown as JwtService,
      mockConfigService as unknown as ConfigService,
    );
  });

  const mockContext = (authHeader?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: authHeader ? { authorization: authHeader } : {},
        }),
      }),
    }) as unknown as ExecutionContext;

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw if no token provided', async () => {
    await expect(guard.canActivate(mockContext())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw if token is invalid', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error());

    await expect(
      guard.canActivate(mockContext('Bearer invalid-token')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if non-Bearer token', async () => {
    await expect(
      guard.canActivate(mockContext('Basic abcdef')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should attach payload to request and return true if token is valid', async () => {
    const payload = { id: '1', email: 'test@test.com' };
    mockJwtService.verifyAsync.mockResolvedValue(payload);

    const request = { headers: { authorization: 'Bearer valid-token' } } as any;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual(payload);
  });
});
