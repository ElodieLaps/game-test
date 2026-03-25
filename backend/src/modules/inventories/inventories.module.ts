import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { InventoryController } from './inventories.controller';
import { InventoryService } from './inventories.service';
import { Inventory } from './inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  controllers: [InventoryController],
  providers: [InventoryService, JwtService],
  exports: [InventoryService],
})
export class InventoryModule {}
