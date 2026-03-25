import { AuthGuard } from '@auth/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InventoryConsumable, InventoryEquipment } from '@shared';
import { CurrentUser } from '@users/currentUser.decorator';
import { User } from '@users/user.entity';
import { InventoryService } from './inventories.service';

@Controller('inventory')
@UseGuards(AuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getInventory(@CurrentUser() user: User) {
    return this.inventoryService.getInventory(user.id);
  }

  @Post('add')
  async addItems(
    @CurrentUser() user: User,
    @Body()
    body: {
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ) {
    return this.inventoryService.addItems(user.id, body);
  }

  @Delete('remove')
  @UseGuards(AuthGuard)
  async removeItems(
    @CurrentUser() user: User,
    @Body()
    body: {
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ) {
    return await this.inventoryService.removeItems(user.id, body);
  }

  @Put('transfer')
  async transfer(
    @CurrentUser() user: User,
    @Body()
    body: {
      toUserId: string;
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ) {
    return this.inventoryService.transfer(user.id, body.toUserId, body);
  }
}
