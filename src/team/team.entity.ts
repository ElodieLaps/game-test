import { Character } from '@app/character/character.entity';
import { User } from '@app/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.teams)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Character, (character) => character.team)
  characters: Character[];
}
