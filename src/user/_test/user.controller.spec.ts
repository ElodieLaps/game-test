import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { User } from '../user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined (controller)', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined (service)', () => {
    expect(service).toBeDefined();
  });
});
