import { Character } from '@characters/character.entity';
import { CharacterService } from '@characters/characters.service';
import { InventoryModule } from '@inventories/inventories.module';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/user.entity';
import { Team } from './team.entity';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Character, User]), InventoryModule],
  controllers: [TeamController],
  providers: [TeamService, CharacterService, JwtService],
})
export class TeamModule {}
