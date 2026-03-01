import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Team } from '@teams/team.entity';
import { TeamBodyDto } from '@teams/teamBodyDto';
import { TeamService } from '@teams/teams.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async createTeam(@Body() team: TeamBodyDto) {
    return await this.teamService.createTeam(team);
  }

  @Get(':userId')
  async getUserTeams(@Param('userId') userId: string): Promise<Team[]> {
    return await this.teamService.getUserTeams(userId);
  }

  @Put(':teamId/addCharacters')
  async addCharactersToTeam(
    @Param('teamId') teamId: string,
    @Body() characterIds: string[],
  ) {
    return await this.teamService.addCharactersToTeam(teamId, characterIds);
  }
}
