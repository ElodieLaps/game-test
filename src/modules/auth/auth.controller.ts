import { AuthGuard } from '@auth/auth.guard';
import { AuthInterceptor } from '@auth/auth.interceptor';
import { AuthService } from '@auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@users/user.entity';
import type { AuthBodyDto } from './authBodyDto';

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
