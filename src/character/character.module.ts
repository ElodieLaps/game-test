import { Team } from '@app/team/team.entity';
import { TeamService } from '@app/team/team.service';
import { User } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterController } from './character.controller';
import { Character } from './character.entity';
import { CharacterService } from './character.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Character, User, Team])],
  controllers: [CharacterController],
  providers: [CharacterService, UserService, TeamService, JwtService],
})
export class CharacterModule {}
