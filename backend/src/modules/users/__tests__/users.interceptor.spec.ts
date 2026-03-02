import { UserInterceptor } from '@users/users.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, firstValueFrom } from 'rxjs';

describe('UserInterceptor', () => {
  it('should be defined', () => {
    expect(new UserInterceptor()).toBeDefined();
  });

  it('should remove password from all users', async () => {
    const interceptor = new UserInterceptor();

    const users = [
      {
        id: '1',
        name: 'Alice',
        password: 'hashed',
        email: 'a@b.com',
        teams: [],
      },
      { id: '2', name: 'Bob', password: 'hashed', email: 'b@c.com', teams: [] },
    ];

    const next: CallHandler = {
      handle: jest.fn(() => of(users)),
    };

    const context: ExecutionContext = {} as any;

    const result = await firstValueFrom(interceptor.intercept(context, next));

    expect(next.handle).toHaveBeenCalled();

    expect(result).toEqual([
      { id: '1', name: 'Alice', email: 'a@b.com', teams: [] },
      { id: '2', name: 'Bob', email: 'b@c.com', teams: [] },
    ]);
  });
});
