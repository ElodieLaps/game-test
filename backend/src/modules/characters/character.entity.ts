import type {
  CustomStatistics,
  Equipments,
  GenderName,
  RaceName,
  RoleName,
  StatusName,
} from '@shared';
import type { Team } from '@teams/team.entity';
import type { User } from '@users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity('character')
export class Character {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne('User', 'characters', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column({ default: null })
  teamId: string | null;

  @ManyToOne('Team', 'characters', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'teamId' })
  team: Relation<Team> | null;

  @Column({ type: 'varchar' })
  gender: GenderName;

  @Column()
  userId: string;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'varchar' })
  race: RaceName;

  @Column({ type: 'varchar' })
  role: RoleName;

  @Column('simple-json', { default: '[]' })
  statuses: StatusName[];

  @Column({ default: 0 })
  currentExperience: number;

  @Column({ default: 0 })
  currentHealth: number;

  @Column({ default: 0 })
  currentMana: number;

  @Column('jsonb', { default: '{}' })
  customStatistics: CustomStatistics;

  @Column('jsonb')
  equipments: Equipments;
}
