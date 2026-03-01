import { UserInterceptor } from '@users/users.interceptor';

describe('UserInterceptor', () => {
  it('should be defined', () => {
    expect(new UserInterceptor()).toBeDefined();
  });
});
