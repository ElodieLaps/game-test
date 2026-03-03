import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@auth/auth.service';
import { UserService } from '@users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { AuthBodyDto } from '@src/modules/auth/auth.body.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: Record<keyof UserService, jest.Mock>;
  let jwtService: Record<keyof JwtService, jest.Mock>;

  beforeEach(async () => {
    userService = {
      getUserByEmail: jest.fn(),
      getUserById: jest.fn(),
    } as Record<keyof UserService, jest.Mock>;

    jwtService = {
      sign: jest.fn(),
    } as Record<keyof JwtService, jest.Mock>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const dto: AuthBodyDto = { email: 'test', password: 'secret' };
    const user = {
      id: '1',
      name: 'test',
      password: 'hashed',
      email: 'a@b.com',
      teams: [],
    };

    it('should throw UnauthorizedException if user does not exist', async () => {
      userService.getUserByEmail.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userService.getUserByEmail.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token if credentials are valid', async () => {
      userService.getUserByEmail.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token');

      const result = await service.login(dto);
      expect(result).toEqual({ access_token: 'token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id });
    });
  });

  describe('getUserFromRequest', () => {
    const user = {
      id: '1',
      name: 'test',
      password: 'hashed',
      email: 'a@b.com',
      teams: [],
    };

    it('should throw NotFoundException if user not found', async () => {
      userService.getUserById.mockResolvedValue(null);
      await expect(service.getUserFromRequest('1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return user data without password', async () => {
      userService.getUserById.mockResolvedValue(user);
      const result = await service.getUserFromRequest('1');
      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        teams: user.teams,
      });
    });
  });
});
