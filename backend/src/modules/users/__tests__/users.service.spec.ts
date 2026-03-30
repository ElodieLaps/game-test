import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@users/users.service';
import { InventoryService } from '@inventories/inventories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@users/user.entity';
import { Repository } from 'typeorm';
import { UserBodyDto } from '@users/user.body.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;
  let inventoryService: InventoryService;

  const mockManager = {
    update: jest.fn(),
    findOneBy: jest.fn(),
    transaction: jest.fn(),
  };

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    manager: {
      transaction: jest.fn((cb) => cb(mockManager)),
    },
  };

  const mockInventoryService = {
    createInventory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    inventoryService = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const user = {
        id: '1',
        name: 'Alice',
        email: 'a@b.com',
        password: 'hashed',
      };
      mockRepo.findOneBy.mockResolvedValue(user);

      const result = await service.getUserById('1');
      expect(result).toEqual(user);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.getUserById('1')).rejects.toThrow('User not found');
    });
  });

  describe('getUserByName', () => {
    it('should return user if found', async () => {
      const user = {
        id: '1',
        name: 'Alice',
        email: 'a@b.com',
        password: 'hashed',
      };
      mockRepo.findOneBy.mockResolvedValue(user);

      const result = await service.getUserByName('Alice');
      expect(result).toEqual(user);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ name: 'Alice' });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.getUserByName('Alice')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      const user = { id: '1', name: 'Alice', email: 'a@b.com' };
      mockRepo.findOneBy.mockResolvedValue(user);

      const result = await service.getUserByEmail('a@b.com');
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ email: 'a@b.com' });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.getUserByEmail('notfound@b.com')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('createUser', () => {
    it('should hash password, save user and create an inventory', async () => {
      const dto: UserBodyDto = {
        name: 'Alice',
        email: 'a@b.com',
        password: 'secret',
      };
      const savedUser = { ...dto, password: 'hashed', id: '1' };

      // No existing user with this email
      mockRepo.findOneBy.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.create.mockReturnValue(savedUser);
      mockRepo.save.mockResolvedValue(savedUser);
      mockInventoryService.createInventory.mockResolvedValue(undefined);

      const result = await service.createUser(dto);

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ email: dto.email });
      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 9);
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          email: dto.email,
          password: 'hashed',
          isVerified: false,
          verificationToken: expect.any(String),
          verificationTokenExpiresAt: expect.any(Date),
        }),
      );
      expect(mockRepo.save).toHaveBeenCalledWith(savedUser);
      expect(mockInventoryService.createInventory).toHaveBeenCalledWith(
        savedUser,
      );
      expect(result).toEqual(savedUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto: UserBodyDto = {
        name: 'Alice',
        email: 'a@b.com',
        password: 'secret',
      };

      // An existing user is found
      mockRepo.findOneBy.mockResolvedValue({ id: '1', ...dto });

      await expect(service.createUser(dto)).rejects.toThrow(ConflictException);
      expect(mockRepo.save).not.toHaveBeenCalled();
      expect(mockInventoryService.createInventory).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should remove user if found', async () => {
      const user = {
        id: '1',
        name: 'Alice',
        email: 'a@b.com',
        password: 'hashed',
      };
      mockRepo.findOneBy.mockResolvedValue(user);
      mockRepo.remove.mockResolvedValue(undefined);

      await service.deleteUser('1');

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(mockRepo.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.deleteUser('1')).rejects.toThrow('User not found');
      expect(mockRepo.remove).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user and return updated user', async () => {
      const updatedUser = {
        id: '1',
        name: 'Alice',
        email: 'new@b.com',
        password: 'hashed',
      };
      mockManager.update.mockResolvedValue(undefined);
      mockManager.findOneBy.mockResolvedValue(updatedUser);

      const result = await service.updateUser('1', { email: 'new@b.com' });

      expect(mockManager.update).toHaveBeenCalledWith(User, '1', {
        email: 'new@b.com',
      });
      expect(mockManager.findOneBy).toHaveBeenCalledWith(User, { id: '1' });
      expect(result).toEqual(updatedUser);
    });

    it('should hash password if provided in update data', async () => {
      const updatedUser = {
        id: '1',
        name: 'Alice',
        email: 'a@b.com',
        password: 'newHashed',
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashed');
      mockManager.update.mockResolvedValue(undefined);
      mockManager.findOneBy.mockResolvedValue(updatedUser);

      const result = await service.updateUser('1', { password: 'newSecret' });

      expect(bcrypt.hash).toHaveBeenCalledWith('newSecret', 9);
      expect(mockManager.update).toHaveBeenCalledWith(User, '1', {
        password: 'newHashed',
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found after update', async () => {
      mockManager.update.mockResolvedValue(undefined);
      mockManager.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateUser('1', { email: 'x@b.com' }),
      ).rejects.toThrow('User not found');
    });
  });
});
