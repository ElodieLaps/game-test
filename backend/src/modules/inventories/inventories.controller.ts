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
import {
  InventoryConsumable,
  InventoryEquipment,
  InventoryOwnerType,
} from '@shared';
import { CurrentUser } from '@users/currentUser.decorator';
import { User } from '@users/user.entity';
import { InventoryService } from './inventories.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':ownerId')
  @UseGuards(AuthGuard)
  async getInventory(@Param('ownerId') ownerId: string) {
    return await this.inventoryService.getInventory(ownerId);
  }

  @Post('add')
  @UseGuards(AuthGuard)
  async addItems(
    @Body()
    body: {
      ownerId: string;
      ownerType: InventoryOwnerType;
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ) {
    return await this.inventoryService.addItems(
      body.ownerId,
      body.ownerType,
      body,
    );
  }

  @Delete('remove')
  @UseGuards(AuthGuard)
  async removeItems(
    @Body()
    body: {
      ownerId: string;
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ) {
    return await this.inventoryService.removeItems(body.ownerId, body);
  }

  @Put('transfer')
  @UseGuards(AuthGuard)
  async transfer(
    @Body()
    body: {
      fromId: string;
      toId: string;
      toOwnerType: InventoryOwnerType;
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ) {
    return await this.inventoryService.transfer(
      body.fromId,
      body.toId,
      body.toOwnerType,
      body,
    );
  }
}
