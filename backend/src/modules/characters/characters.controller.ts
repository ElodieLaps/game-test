import { AuthGuard } from '@auth/auth.guard';
import { CharacterBodyDto } from '@characters/character.body.dto';
import { CharacterService } from '@characters/characters.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EquipmentName, EquipmentSlotName, equipmentSlotNames } from '@shared';
import { CharacterCreateInterceptor } from '@src/modules/characters/charactersCreate.interceptor';
import { CurrentUser } from '@users/currentUser.decorator';
import { User } from '@users/user.entity';
import { CharactersComputeInterceptor } from './charactersCompute.interceptor';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  @UseGuards(AuthGuard)
  @UseInterceptors(CharactersComputeInterceptor)
  async getAllCharacters(@CurrentUser() user: User) {
    return await this.characterService.getAllCharacters(user.id);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(CharactersComputeInterceptor)
  async getCharacterById(@Param('id') id: string) {
    return await this.characterService.getCharacterById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(CharacterCreateInterceptor)
  async createCharacter(
    @CurrentUser() user: User,
    @Body() characterDto: CharacterBodyDto,
  ) {
    return await this.characterService.createCharacter(user.id, characterDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCharacter(
    @Param('id') characterId: string,
    @CurrentUser() user: User,
  ) {
    return await this.characterService.deleteCharacter(user.id, characterId);
  }

  @Put('/:id/equipments/add')
  @UseGuards(AuthGuard)
  async addEquipments(
    @Param('id') characterId: string,
    @CurrentUser() user: User,
    @Body() equipmentNames: EquipmentName[],
  ) {
    return await this.characterService.addEquipments(
      user.id,
      characterId,
      equipmentNames,
    );
  }

  @Put('/:id/equipments/remove')
  @UseGuards(AuthGuard)
  async removeEquipments(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() equipmentSlots: EquipmentSlotName[],
  ) {
    return await this.characterService.removeEquipments(
      user.id,
      id,
      equipmentSlots,
    );
  }

  @Put('/:id/equipments/removeAll')
  @UseGuards(AuthGuard)
  async removeAllEquipments(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return await this.characterService.removeEquipments(user.id, id, [
      ...equipmentSlotNames,
    ]);
  }
}
