import { AuthGuard } from '@auth/auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TeamBodyDto } from '@src/modules/teams/team.body.dto';
import { Team } from '@teams/team.entity';
import { TeamService } from '@teams/teams.service';
import { CurrentUser } from '@users/currentUser.decorator';
import { User } from '../users/user.entity';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTeam(@CurrentUser() user: User, @Body() team: TeamBodyDto) {
    await this.teamService.createTeam(user.id, team);
  }

  @Get(':userId')
  @UseGuards(AuthGuard)
  async getTeams(@Param('userId') userId: string): Promise<Team[]> {
    return await this.teamService.getTeams(userId);
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
}
