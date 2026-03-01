import { Character } from '@characters/character.entity';
import { CharacterController } from '@characters/characters.controller';
import { CharacterService } from '@characters/characters.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '@teams/team.entity';
import { TeamService } from '@teams/teams.service';
import { User } from '@users/user.entity';
import { UserService } from '@users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Character, User, Team])],
  controllers: [CharacterController],
  providers: [CharacterService, UserService, TeamService, JwtService],
})
export class CharacterModule {}
