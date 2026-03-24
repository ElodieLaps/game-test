import { Team } from '@teams/team.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Character } from '../characters/character.entity';

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

  @OneToMany(() => Team, (team) => team.user)
  teams: Team[];

  @OneToMany(() => Character, (character) => character.user)
  characters: Character[];
}
