import type { GenderName, RaceName, RoleName, StatusName } from '@shared/types';
import { Team } from '@teams/team.entity';
import { User } from '@users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Equipments } from './equipment/types';
import type { Statistics } from './statistics/types';

@Entity('character')
export class Character {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar' })
  gender: GenderName;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.teams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: null })
  teamId: string | null;

  @ManyToOne(() => Team, (team) => team.characters)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'varchar' })
  race: RaceName;

  @Column({ type: 'varchar' })
  role: RoleName;

  @Column('simple-json', { default: '[]' })
  statuses: StatusName[];

  @Column('jsonb')
  statistics: Statistics;

  @Column('jsonb')
  equipments: Equipments;
}
