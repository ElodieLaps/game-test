import { AuthGuard } from '@app/auth/auth.guard';
import type { Equipment } from '@app/item/equipment/type';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CharacterBodyDto } from './character.body.dto';
import { CharacterInterceptor } from './character.interceptor';
import { CharacterService } from './character.service';
import { equipmentSlotNames, type EquipmentSlotName } from './equipment/type';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(CharacterInterceptor)
  async createCharacter(
    @Query('userId') userId: string,
    @Body() characterDto: CharacterBodyDto,
  ) {
    return await this.characterService.createCharacter(userId, characterDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllCharacters(@Query('userId') userId: string) {
    return await this.characterService.getAllCharacters(userId);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getCharacterById(@Param('id') id: string) {
    return await this.characterService.getCharacterById(id);
  }

  @Put('/:id/equipments/add')
  @UseGuards(AuthGuard)
  async setEquipment(@Param('id') id: string, @Body() equipments: Equipment[]) {
    return await this.characterService.addEquipments(id, equipments);
  }

  @Put('/:id/equipments/remove')
  @UseGuards(AuthGuard)
  async removeEquipment(
    @Param('id') id: string,
    @Body() equipmentSlots: EquipmentSlotName[],
  ) {
    return await this.characterService.removeEquipments(id, equipmentSlots);
  }

  @Put('/:id/equipments/remove/all')
  @UseGuards(AuthGuard)
  async removeAllEquipment(@Param('id') id: string) {
    return await this.characterService.removeEquipments(id, [
      ...equipmentSlotNames,
    ]);
  }
}
