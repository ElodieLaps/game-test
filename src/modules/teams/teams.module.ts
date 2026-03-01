import { Character } from '@characters/character.entity';
import { CharacterService } from '@characters/characters.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/user.entity';
import { Team } from './team.entity';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Character, User])],
  controllers: [TeamController],
  providers: [TeamService, CharacterService],
})
export class TeamModule {}
