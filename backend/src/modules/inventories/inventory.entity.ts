import type { UserInventory } from '@shared';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@users/user.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.inventory, {
    nullable: false,
  })
  @JoinColumn()
  user: User;

  @Column('jsonb', { default: { equipments: [], consumables: [] } })
  items: UserInventory;
}
