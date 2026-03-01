import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@users/users.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const result = 'All users';
    expect(await service.getAllUsers()).toBe(result);
  });

  it('should return user by id', async () => {
    const result = 'User by id: 1';
    expect(await service.getUserById('1')).toBe(result);
  });
});
