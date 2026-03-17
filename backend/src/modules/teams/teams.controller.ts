import { AuthGuard } from '@auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TeamBodyDto } from '@src/modules/teams/team.body.dto';
import { TeamService } from '@src/modules/teams/teams.service';
import { Team } from '@teams/team.entity';
import { CurrentUser } from '@users/currentUser.decorator';
import { User } from '../users/user.entity';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTeam(@CurrentUser() user: User, @Body() team: TeamBodyDto) {
    return await this.teamService.createTeam(user.id, team);
  }

  @Delete(':teamId')
  @UseGuards(AuthGuard)
  async deleteTeam(@CurrentUser() user: User, @Param('teamId') teamId: string) {
    return await this.teamService.deleteTeam(user.id, teamId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getTeams(@CurrentUser() user: User): Promise<Team[]> {
    return await this.teamService.getTeams(user.id);
  }

  @Get(':teamId')
  @UseGuards(AuthGuard)
  async getTeamById(
    @CurrentUser() user: User,
    @Param('teamId') teamId: string,
  ): Promise<Team> {
    return await this.teamService.getTeamById(user.id, teamId);
  }

  @Put(':teamId/addCharacters')
  @UseGuards(AuthGuard)
  async addCharacters(
    @CurrentUser() user: User,
    @Param('teamId') teamId: string,
    @Body() characterIds: string[],
  ) {
    await this.teamService.addCharacters(user.id, teamId, characterIds);
  }

  @Put(':teamId/removeCharacters')
  @UseGuards(AuthGuard)
  async removeCharacters(
    @CurrentUser() user: User,
    @Param('teamId') teamId: string,
    @Body() characterIds: string[],
  ) {
    await this.teamService.removeCharacters(user.id, teamId, characterIds);
  }
}
