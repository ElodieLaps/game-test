import { AuthGuard } from '@auth/auth.guard';
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
import { UserService } from '@users/users.service';
import { UsersInterceptor } from '@users/users.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(UsersInterceptor)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  @UseInterceptors(UsersInterceptor)
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
