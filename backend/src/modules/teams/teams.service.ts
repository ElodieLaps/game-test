import { Character } from '@characters/character.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '@teams/team.entity';
import { TeamBodyDto } from '@src/modules/teams/team.body.dto';
import { In, Repository } from 'typeorm';
import { InventoryService } from '@inventories/inventories.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    private readonly inventoryService: InventoryService,
  ) {}

  async createTeam(userId: string, team: TeamBodyDto) {
    try {
      const newTeam = this.teamRepository.create({
        name: team.name,
        userId,
        characters: [],
      });
      await this.inventoryService.getInventory(newTeam.id);
      return await this.teamRepository.save(newTeam);
    } catch (error) {
      throw new Error('Error creating team');
    }
  }

  async deleteTeam(userId: string, teamId: string): Promise<void> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, userId },
      relations: ['characters'],
    });
    if (!team) throw new NotFoundException('Team not found');

    const teamInventory = await this.inventoryService.getInventory(teamId);

    if (teamInventory) {
      await this.inventoryService.transfer(teamId, userId, teamInventory.items);
    }
    await this.teamRepository.remove(team);
  }

  async getTeams(userId: string): Promise<Team[]> {
    try {
      return await this.teamRepository.find({
        where: { userId },
        relations: ['characters'],
      });
    } catch (error) {
      throw new Error('Error getting user teams');
    }
  }

  async getTeamById(userId: string, teamId: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, userId },
      relations: ['characters'],
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async addCharacters(userId: string, teamId: string, characterIds: string[]) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, userId },
    });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const characters = await this.characterRepository.findBy({
      id: In(characterIds),
    });

    if (characters.length !== characterIds.length) {
      throw new BadRequestException('Some characters not found');
    }

    for (const character of characters) {
      if (character.teamId && character.teamId !== teamId) {
        throw new BadRequestException(
          `Character ${character.name} is already in another team`,
        );
      }
      character.teamId = teamId;
    }

    await this.characterRepository.save(characters);
  }

  async removeCharacters(
    userId: string,
    teamId: string,
    characterIds: string[],
  ) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, userId },
    });
    if (!team) throw new NotFoundException('Team not found');

    const characters = await this.characterRepository.findBy({
      id: In(characterIds),
      teamId,
    });

    for (const character of characters) {
      character.teamId = null;
    }

    await this.characterRepository.save(characters);
  }
}
