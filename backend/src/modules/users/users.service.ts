import { InventoryService } from '@inventories/inventories.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamService } from '@src/modules/teams/teams.service';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { UserBodyDto } from './user.body.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly teamService: TeamService,
    private readonly inventoryService: InventoryService,
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
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
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

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(userBodyDto: UserBodyDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: userBodyDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'An account with this email is already exist',
      );
    }

    try {
      const user = this.userRepository.create({
        ...userBodyDto,
        password: await this.hashPassword(userBodyDto.password),
      });
      const savedUser = await this.userRepository.save(user);

      await this.inventoryService.getOrCreateInventory(savedUser.id, 'USER');
      await this.teamService.createTeam(savedUser.id, {
        name: 'My Team',
      });

      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la création du compte',
      );
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    await this.inventoryService.deleteInventory(id);
    await this.userRepository.remove(user);
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 9);
  }
}
