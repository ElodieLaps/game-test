import { AuthGuard } from '@auth/auth.guard';
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
import { RequestTimingInterceptor } from '@src/common/interceptors/requestTiming.interceptor';
import { User } from '@users/user.entity';
import type { AuthBodyDto } from '@auth/auth.body.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(RequestTimingInterceptor)
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
