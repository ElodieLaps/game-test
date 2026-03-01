import { Character } from '@characters/character.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '@teams/team.entity';
import { TeamBodyDto } from '@teams/teamBodyDto';
import { In, Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async createTeam(team: TeamBodyDto) {
    try {
      const newTeam = this.teamRepository.create({
        name: team.name,
        userId: team.userId,
        characters: [],
      });

      await this.teamRepository.save(newTeam);
    } catch (error) {
      throw new Error('Error creating team');
    }
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    try {
      return await this.teamRepository.find({
        where: { userId },
        relations: ['characters'],
      });
    } catch (error) {
      throw new Error('Error getting user teams');
    }
  }

  async addCharactersToTeam(teamId: string, characterIds: string[]) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
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
}
