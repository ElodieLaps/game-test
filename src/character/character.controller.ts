import { AuthGuard } from '@app/auth/auth.guard';
import type { Equipment } from '@app/item/equipment/type';
import { CurrentUser } from '@app/user/currentUser.decorator';
import { User } from '@app/user/user.entity';
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
import { CharacterBodyDto } from './character.body.dto';
import { CharacterInterceptor } from './character.interceptor';
import { CharacterService } from './character.service';
import { equipmentSlotNames, type EquipmentSlotName } from './equipment/type';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  // READING
  // GET ALL CHARACTERS FROM USER
  @Get()
  @UseGuards(AuthGuard)
  async getAllCharacters(@CurrentUser() user: User) {
    return await this.characterService.getAllCharacters(user.id);
  }

  // GET CHARACTER BY ID
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getCharacterById(@Param('id') id: string) {
    return await this.characterService.getCharacterById(id);
  }

  // WRITING
  // CREATE CHARACTER
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(CharacterInterceptor)
  async createCharacter(
    @CurrentUser() user: User,
    @Body() characterDto: CharacterBodyDto,
  ) {
    return await this.characterService.createCharacter(user.id, characterDto);
  }

  //DELETE CHARACTER
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCharacter(
    @Param('id') characterid: string,
    @CurrentUser() user: User,
  ) {
    return await this.characterService.deleteCharacter(user.id, characterid);
  }

  //ADD EQUIPMENTS TO CHARACTER
  @Put('/:id/equipments/add')
  @UseGuards(AuthGuard)
  async setEquipment(
    @Param('id') characterId: string,
    @CurrentUser() user: User,
    @Body() equipments: Equipment[],
  ) {
    return await this.characterService.addEquipments(
      user.id,
      characterId,
      equipments,
    );
  }

  //REMOVE EQUIPMENTS FROM CHARACTER
  @Put('/:id/equipments/remove')
  @UseGuards(AuthGuard)
  async removeEquipment(
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

  // REMOVE ALL EQUIPMENTS FROM CHARACTER
  @Put('/:id/equipments/removeAll')
  @UseGuards(AuthGuard)
  async removeAllEquipment(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.characterService.removeEquipments(user.id, id, [
      ...equipmentSlotNames,
    ]);
  }
}
