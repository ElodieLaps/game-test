import { AuthGuard } from '@auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    } as any;

    guard = new AuthGuard(jwtService);
  });

  const mockExecutionContext = (authHeader?: string): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: authHeader ? { authorization: authHeader } : {},
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw if no token provided', async () => {
    const context = mockExecutionContext();
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw if token is invalid', async () => {
    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error());
    const context = mockExecutionContext('Bearer invalid-token');
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should attach payload to request if token is valid', async () => {
    const payload = { id: 1, email: 'test@test.com' };
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);

    const request: any = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(request.user).toEqual(payload);
  });

  it('should ignore non-Bearer tokens', async () => {
    const context = mockExecutionContext('Basic abcdef');
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
