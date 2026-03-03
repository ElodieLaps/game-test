import type { AuthBodyDto } from '@auth/auth.body.dto';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequestTimingInterceptor } from '@src/common/interceptors/requestTiming.interceptor';
import { User } from '@users/user.entity';
import type { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(RequestTimingInterceptor)
  async getAuth(@Body() authBody: AuthBodyDto): Promise<{ token: string }> {
    const { access_token } = await this.authService.login(authBody);
    return { token: access_token };
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getAuthUser(@Request() request): Promise<Omit<User, 'password'>> {
    return this.authService.getUserFromRequest(request.user.id);
  }
}
