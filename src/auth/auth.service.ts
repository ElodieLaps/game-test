import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthBodyDto } from './auth.body.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({
    name,
    password,
  }: AuthBodyDto): Promise<{ access_token: string }> {
    const user = await this.userService.getUserByName(name);

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
