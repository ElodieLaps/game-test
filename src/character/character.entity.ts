import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Equipments } from './equipment/type';
import type { GenderName } from './gender/type';
import type { RaceName } from './race/type';
import type { RoleName } from './role/type';
import type { Statistics } from './statistic/type';
import type { StatusName } from './status/type';
import { Team } from '@app/team/team.entity';
import { User } from '@app/user/user.entity';

@Entity('character')
export class Character {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  gender: GenderName;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.teams)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: null })
  teamId: string | null;

  @ManyToOne(() => Team, (team) => team.characters)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({ default: 1 })
  level: number;

  @Column()
  race: RaceName;

  @Column()
  role: RoleName;

  @Column('simple-json', { default: '[]' })
  statuses: StatusName[];

  @Column('jsonb')
  statistics: Statistics;

  @Column('jsonb')
  equipments: Equipments;
}
