import { Team } from '@app/team/team.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { TeamService } from '@app/team/team.service';
import { CharacterService } from '@app/character/character.service';
import { Character } from '@app/character/character.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team, Character])],
  controllers: [UserController],
  providers: [UserService, TeamService, CharacterService],
  exports: [UserService],
})
export class UserModule {}
