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
import { randomUUID } from 'crypto';

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

  async createUser(userBodyDto: UserBodyDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userBodyDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'An account with this email is already exist',
      );
    }

    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const user = this.userRepository.create({
        ...userBodyDto,
        password: await this.hashPassword(userBodyDto.password),
        isVerified: false,
        verificationToken: randomUUID(),
        verificationTokenExpiresAt: expiresAt,
      });
      const savedUser = await this.userRepository.save(user);

      await this.inventoryService.getOrCreateInventory(savedUser.id, 'USER');

      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException('Error creating account');
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    await this.inventoryService.deleteInventory(id);
    await this.userRepository.remove(user);
  }

  async getUserByVerificationToken(token: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ verificationToken: token });
  }

async updateUser(id: string, data: Partial<User>): Promise<User> {
  return this.userRepository.manager.transaction(async (manager) => {
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }

    await manager.update(User, id, data);
    const user = await manager.findOneBy(User, { id });

    if (!user) throw new NotFoundException('User not found');

    return user;
  });
}

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 9);
  }
}
