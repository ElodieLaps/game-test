import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@users/user.entity';
import { UserBodyDto } from '@src/modules/users/user.body.dto';
import { UserInterceptor } from '@users/users.interceptor';
import { UserService } from '@users/users.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseInterceptors(UserInterceptor)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() user: UserBodyDto) {
    return await this.userService.createUser(user);
  }
}
