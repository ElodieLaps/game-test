import { MailService } from '@mail/mail.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthBodyDto } from '@src/modules/auth/auth.body.dto';
import { UserBodyDto } from '@users/user.body.dto';
import { User } from '@users/user.entity';
import { UserService } from '@users/users.service';
import { compare } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      throw new UnauthorizedException('User name or password is incorrect');

    return this.authentificateUser({ id: user.id });
  }

  async getUserFromRequest(
    id: string,
  ): Promise<
    Omit<User, 'password' | 'verificationToken' | 'verificationTokenExpiresAt'>
  > {
    const user = await this.userService.getUserById(id);

    if (!user) throw new NotFoundException('User is not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      teams: user.teams,
      characters: user.characters,
      inventory: user.inventory,
      isVerified: user.isVerified,
    };
  }

  async register(body: UserBodyDto): Promise<void> {
    const user = await this.userService.createUser(body);
    if (!user.verificationToken) {
      throw new InternalServerErrorException(
        'Failed to generate verification token',
      );
    }

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
      await this.userRepository.update(user.id, {
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
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.userService.updateUser(user.id, {
      verificationToken: token,
      verificationTokenExpiresAt: expiresAt,
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${token}`;
    await this.mailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationUrl,
    );
  }

  private async isPasswordValid(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  private async authentificateUser({
    id,
  }: {
    id: string;
  }): Promise<{ access_token: string }> {
    const payload = { id };
    return { access_token: await this.jwtService.sign(payload) };
  }
}
