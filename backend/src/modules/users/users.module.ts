import { Character } from '@characters/character.entity';
import { CharacterService } from '@characters/characters.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '@teams/team.entity';
import { TeamService } from '@src/modules/teams/teams.service';
import { User } from './user.entity';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team, Character])],
  controllers: [UserController],
  providers: [UserService, TeamService, CharacterService],
  exports: [UserService],
})
export class UserModule {}
