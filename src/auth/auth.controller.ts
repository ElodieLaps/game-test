import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/user/user.entity';
import type { AuthBodyDto } from './auth.body.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(AuthInterceptor)
  async getAuth(
    @Body() authBody: AuthBodyDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(authBody);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getAuthUser(@Request() request): Promise<Omit<User, 'password'>> {
    return this.authService.getUserFromRequest(request.user.id);
  }
}
