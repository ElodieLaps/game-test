import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserBodyDto } from '@src/modules/users/user.body.dto';
import { User } from '@users/user.entity';
import { UserInterceptor } from '@users/users.interceptor';
import { UserService } from '@users/users.service';
import { AuthGuard } from '@auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() userBodyDto: UserBodyDto): Promise<User> {
    return this.userService.createUser(userBodyDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
