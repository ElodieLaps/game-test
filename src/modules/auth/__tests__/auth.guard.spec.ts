import { AuthGuard } from '@src/modules/auth/auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard({} as any)).toBeDefined();
  });
});
