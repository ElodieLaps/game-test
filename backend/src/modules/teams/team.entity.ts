import { Character } from '@characters/character.entity';
import { ConsumableName } from '@shared';
import type { User } from '@users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @ManyToOne('User', 'teams', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @OneToMany(() => Character, (character) => character.team)
  characters: Character[];

  @Column('jsonb', { default: '[]' })
  inventory: ConsumableName[];
}
