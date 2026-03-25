import type { AuthBodyDto } from '@auth/auth.body.dto';
import { AuthGuard } from '@auth/auth.guard';
import { AuthService } from '@auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestTimingInterceptor } from '@src/common/interceptors/requestTiming.interceptor';
import { UserBodyDto } from '@users/user.body.dto';
import type { User } from '@users/user.entity';
import type { Response } from 'express';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @UseInterceptors(RequestTimingInterceptor)
  async login(@Body() body: AuthBodyDto): Promise<{ token: string }> {
    const { access_token } = await this.authService.login(body);
    return { token: access_token };
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getAuthUser(@Request() req): Promise<Partial<User>> {
    return this.authService.getAuthUser(req.user.id);
  }

  @Post('register')
  async register(@Body() body: UserBodyDto): Promise<void> {
    await this.authService.register(body);
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    await this.authService
      .verifyEmail(token)
      .then(() => res.redirect(301, `${frontendUrl}/verification/succeeded`))
      .catch((error: Error) => {
        const path =
          error.message === 'Verification link has expired'
            ? 'expired'
            : 'failed';
        return res.redirect(301, `${frontendUrl}/verification/${path}`);
      });
  }

  @Post('resend-verification')
  async resendVerificationEmail(@Body('email') email: string): Promise<void> {
    await this.authService.resendVerificationEmail(email);
  }
}
