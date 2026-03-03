import { AuthBodyDto } from '@src/modules/auth/auth.body.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@users/user.entity';
import { UserService } from '@users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: AuthBodyDto): Promise<{ access_token: string }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user)
      throw new UnauthorizedException('User name or password is incorrect');

    if (!(await this.isPasswordValid(password, user.password)))
      throw new UnauthorizedException('User name or password is incorrect');

    return this.authentificateUser({ id: user.id });
  }

  async getUserFromRequest(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userService.getUserById(id);

    if (!user) throw new NotFoundException('User is not found');
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      teams: user.teams,
    };
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
