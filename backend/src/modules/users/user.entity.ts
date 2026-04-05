import type { Character } from '@characters/character.entity';
import type { Inventory } from '@inventories/inventory.entity';
import type { Team } from '@teams/team.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true, default: null })
  verificationToken: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  verificationTokenExpiresAt: Date | null;

  @OneToMany('Team', 'user', { cascade: true, onDelete: 'CASCADE' })
  teams: Relation<Team>[];

  @OneToMany('Character', 'user', { cascade: true, onDelete: 'CASCADE' })
  characters: Relation<Character>[];

  @OneToOne('Inventory', 'user', { cascade: true, onDelete: 'CASCADE' })
  inventory: Relation<Inventory>;

  @Column({ nullable: true, default: 0 })
  golds: number;
}
