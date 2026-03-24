import type { AuthBodyDto } from '@auth/auth.body.dto';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestTimingInterceptor } from '@src/common/interceptors/requestTiming.interceptor';
import { User } from '@users/user.entity';
import type { Response } from 'express';
import { UserBodyDto } from '../users/user.body.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @UseInterceptors(RequestTimingInterceptor)
  async getAuth(@Body() authBody: AuthBodyDto): Promise<{ token: string }> {
    const { access_token } = await this.authService.login(authBody);
    return { token: access_token };
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getAuthUser(@Request() request): Promise<Partial<User>> {
    return this.authService.getUserFromRequest(request.user.id);
  }

  @Post('register')
  async register(@Body() body: UserBodyDto): Promise<void> {
    return await this.authService.register(body);
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    try {
      await this.authService.verifyEmail(token);
      return res.redirect(
        301,
        `${this.configService.get('FRONTEND_URL')}/verification/succeeded`,
      );
    } catch (error) {
      if (
        error instanceof BadRequestException &&
        error.message === 'Verification link has expired'
      ) {
        return res.redirect(
          301,
          `${this.configService.get('FRONTEND_URL')}/verification/expired`,
        );
      } else if (error instanceof NotFoundException) {
        return res.redirect(
          301,
          `${this.configService.get('FRONTEND_URL')}/verification/failed`,
        );
      }
      return res.redirect(
        301,
        `${this.configService.get('FRONTEND_URL')}/verification/failed`,
      );
    }
  }
}
