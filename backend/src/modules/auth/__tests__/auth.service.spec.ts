import type { AuthBodyDto } from '@auth/auth.body.dto';
import { AuthService } from '@auth/auth.service';
import { MailService } from '@mails/mails.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@users/users.service';
import { compare } from 'bcrypt';

jest.mock('bcrypt');

const mockUserService = {
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  getUserByVerificationToken: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const dto: AuthBodyDto = { email: 'a@b.com', password: 'secret' };
    const user = {
      id: '1',
      name: 'test',
      password: 'hashed',
      email: 'a@b.com',
    };

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserService.getUserByEmail.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUserService.getUserByEmail.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token if credentials are valid', async () => {
      mockUserService.getUserByEmail.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.login(dto);

      expect(result).toEqual({ access_token: 'token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: user.id });
    });
  });

  describe('getAuthUser', () => {
    const user = {
      id: '1',
      name: 'test',
      password: 'hashed',
      email: 'a@b.com',
      teams: [],
      characters: [],
      inventory: null,
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
    };

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.getUserById.mockResolvedValue(null);
      await expect(service.getAuthUser('1')).rejects.toThrow(NotFoundException);
    });

    it('should return user without sensitive fields', async () => {
      mockUserService.getUserById.mockResolvedValue(user);

      const result = await service.getAuthUser('1');

      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('verificationToken');
      expect(result).not.toHaveProperty('verificationTokenExpiresAt');
      expect(result).toMatchObject({ id: '1', name: 'test', email: 'a@b.com' });
    });
  });

  describe('register', () => {
    it('should call createUser and sendVerificationEmail', async () => {
      mockUserService.createUser.mockResolvedValue({
        email: 'a@b.com',
        name: 'test',
        verificationToken: 'token',
      });

      await service.register({
        email: 'a@b.com',
        password: 'secret',
        name: 'test',
      });

      expect(mockUserService.createUser).toHaveBeenCalled();
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(
        'a@b.com',
        'test',
        'token',
      );
    });

    it('should throw InternalServerErrorException if no verificationToken', async () => {
      mockUserService.createUser.mockResolvedValue({
        email: 'a@b.com',
        name: 'test',
        verificationToken: null,
      });

      await expect(
        service.register({
          email: 'a@b.com',
          password: 'secret',
          name: 'test',
        }),
      ).rejects.toThrow();
    });
  });

  describe('verifyEmail', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockUserService.getUserByVerificationToken.mockResolvedValue(null);
      await expect(service.verifyEmail('token')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if token is expired', async () => {
      mockUserService.getUserByVerificationToken.mockResolvedValue({
        id: '1',
        verificationTokenExpiresAt: new Date('2000-01-01'),
      });

      await expect(service.verifyEmail('token')).rejects.toThrow();
      expect(mockUserService.updateUser).toHaveBeenCalledWith('1', {
        verificationToken: null,
        verificationTokenExpiresAt: null,
      });
    });

    it('should verify user if token is valid', async () => {
      mockUserService.getUserByVerificationToken.mockResolvedValue({
        id: '1',
        verificationTokenExpiresAt: new Date(Date.now() + 10000),
      });

      await service.verifyEmail('token');

      expect(mockUserService.updateUser).toHaveBeenCalledWith('1', {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      });
    });
  });
});
