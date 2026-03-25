import { AuthBodyDto } from '@auth/auth.body.dto';
import { MailService } from '@mails/mails.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserBodyDto } from '@users/user.body.dto';
import type { User } from '@users/user.entity';
import { UserService } from '@users/users.service';
import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';

type AuthUser = Omit<
  User,
  'password' | 'verificationToken' | 'verificationTokenExpiresAt'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login({
    email,
    password,
  }: AuthBodyDto): Promise<{ access_token: string }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new NotFoundException('User not found');
    if (!(await this.isPasswordValid(password, user.password)))
      throw new UnauthorizedException('Invalid credentials');

    return this.authenticateUser({ id: user.id });
  }

  async getAuthUser(id: string): Promise<AuthUser> {
    const user = await this.userService.getUserById(id);

    if (!user) throw new NotFoundException('User not found');

    const {
      password,
      verificationToken,
      verificationTokenExpiresAt,
      ...authUser
    } = user;
    return authUser;
  }

  async register(body: UserBodyDto): Promise<void> {
    const user = await this.userService.createUser(body);

    if (!user.verificationToken)
      throw new InternalServerErrorException(
        'Failed to generate verification token',
      );

    await this.mailService.sendVerificationEmail(
      user.email,
      user.name,
      user.verificationToken,
    );
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userService.getUserByVerificationToken(token);

    if (!user) throw new NotFoundException('User not found');

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    ) {
      await this.userService.updateUser(user.id, {
        verificationToken: null,
        verificationTokenExpiresAt: null,
      });
      throw new BadRequestException('Verification link has expired');
    }

    await this.userService.updateUser(user.id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
    });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    const token = randomUUID();
    const verificationTokenExpiresAt = new Date();
    verificationTokenExpiresAt.setHours(
      verificationTokenExpiresAt.getHours() + 24,
    );

    await this.userService.updateUser(user.id, {
      verificationToken: token,
      verificationTokenExpiresAt,
    });
  }

  private async isPasswordValid(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  private async authenticateUser({
    id,
  }: {
    id: string;
  }): Promise<{ access_token: string }> {
    return { access_token: await this.jwtService.sign({ id }) };
  }
}
