import { Character } from '@characters/character.entity';
import { CharacterService } from '@characters/characters.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamService } from '@src/modules/teams/teams.service';
import { Team } from '@teams/team.entity';
import { InventoryModule } from '@inventories/inventories.module';
import { User } from './user.entity';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team, Character]), InventoryModule],
  controllers: [UserController],
  providers: [UserService, TeamService, CharacterService, JwtService],
  exports: [UserService],
})
export class UserModule {}
