import { Character } from '@app/character/character.entity';
import { User } from '@app/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamController } from './team.controller';
import { Team } from './team.entity';
import { TeamService } from './team.service';
import { CharacterService } from '@app/character/character.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Character, User])],
  controllers: [TeamController],
  providers: [TeamService, CharacterService],
})
export class TeamModule {}
