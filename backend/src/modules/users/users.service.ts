import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamService } from '@src/modules/teams/teams.service';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserBodyDto } from './user.body.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly teamService: TeamService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error getting user by id');
    }
  }

  async getUserByName(name: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ name });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error getting user by name');
    }
  }

  async createUser(userBodyDto: UserBodyDto) {
    try {
      const user = this.userRepository.create({
        ...userBodyDto,
        password: await this.hashPassword(userBodyDto.password),
      });
      const savedUser = await this.userRepository.save(user);

      await this.teamService.createTeam(savedUser.id, {
        name: 'My Team',
      });
    } catch (error) {
      throw new Error('Error creating user' + error);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 9);
  }
}
