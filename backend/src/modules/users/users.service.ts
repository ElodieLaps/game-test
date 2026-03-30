import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Repository, EntityManager } from 'typeorm';
import { UserBodyDto } from './user.body.dto';
import { User } from './user.entity';
import { InventoryService } from '@inventories/inventories.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly inventoryService: InventoryService,
  ) {}

  /**
   * Retrieves a user by their ID.
   * @throws {NotFoundException} If the user is not found.
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Retrieves a user by their name.
   * @throws {NotFoundException} If the user is not found.
   */
  async getUserByName(name: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ name });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Retrieves a user by their email.
   * @throws {NotFoundException} If the user is not found.
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Creates a new user.
   * @throws {ConflictException} If a user with this email already exists.
   * @throws {InternalServerErrorException} If there is an error during creation.
   */
  async createUser(userBodyDto: UserBodyDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: userBodyDto.email,
    });
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
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
      await this.inventoryService.createInventory(savedUser);

      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException('Error creating account');
    }
  }

  /**
   * Deletes a user by their ID.
   * @throws {NotFoundException} If the user is not found.
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }

  /**
   * Retrieves a user by their verification token.
   * @returns {Promise<User | null>} The user or null if not found.
   */
  async getUserByVerificationToken(token: string): Promise<User | null> {
    return this.userRepository.findOneBy({ verificationToken: token });
  }

  /**
   * Updates a user.
   * @throws {NotFoundException} If the user is not found.
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.userRepository.manager.transaction(
      async (manager: EntityManager) => {
        if (data.password) {
          data.password = await this.hashPassword(data.password);
        }

        await manager.update(User, id, data);
        const user = await manager.findOneBy(User, { id });

        if (!user) throw new NotFoundException('User not found');
        return user;
      },
    );
  }

  /**
   * Hashes a password.
   */
  private async hashPassword(password: string): Promise<string> {
    return hash(password, 9);
  }
}
