import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { User } from '@users/user.entity';
import { CurrentUser } from '../currentUser.decorator';

function getParamDecoratorFactory(decorator: Function) {
  class TestController {
    public testMethod(@decorator() _user: User) {}
  }

  const metadata = Reflect.getMetadata(
    ROUTE_ARGS_METADATA,
    TestController,
    'testMethod',
  );

  const [entry] = Object.values(metadata) as any[];
  return entry.factory;
}

const mockUser: Partial<User> = {
  id: '1',
  email: 'john@example.com',
  name: 'john',
};

const buildMockContext = (user: unknown): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  }) as ExecutionContext;

describe('CurrentUser decorator', () => {
  let factory: (data: unknown, ctx: ExecutionContext) => User;

  beforeEach(() => {
    factory = getParamDecoratorFactory(CurrentUser);
  });

  it('should return the user from the request', () => {
    const ctx = buildMockContext(mockUser);

    const result = factory(undefined, ctx);

    expect(result).toBe(mockUser);
  });

  it('should return undefined when no user is attached to the request', () => {
    const ctx = buildMockContext(undefined);

    const result = factory(undefined, ctx);

    expect(result).toBeUndefined();
  });

  it('should return null when request.user is explicitly null', () => {
    const ctx = buildMockContext(null);

    const result = factory(undefined, ctx);

    expect(result).toBeNull();
  });
});
