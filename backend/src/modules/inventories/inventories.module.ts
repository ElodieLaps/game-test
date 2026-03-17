import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventories.controller';
import { InventoryService } from './inventories.service';
import { Inventory } from './inventory.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  controllers: [InventoryController],
  providers: [InventoryService, JwtService],
  exports: [InventoryService],
})
export class InventoryModule {}
