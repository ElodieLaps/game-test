import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryConsumable, InventoryEquipment } from '@shared';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { User } from '@users/user.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async createInventory(user: User): Promise<Inventory> {
    const inventory = this.inventoryRepository.create({
      user,
      items: { equipments: [], consumables: [] },
    });
    return this.inventoryRepository.save(inventory);
  }

  async getInventory(userId: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory;
  }

  async addItems(
    userId: string,
    items: {
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ): Promise<Inventory> {
    const inventory = await this.getInventory(userId);

    for (const equipment of items.equipments ?? []) {
      const existing = inventory.items.equipments.find(
        (e) => e.name === equipment.name,
      );
      if (existing) {
        existing.quantity += equipment.quantity;
      } else {
        inventory.items.equipments.push(equipment);
      }
    }

    for (const consumable of items.consumables ?? []) {
      const existing = inventory.items.consumables.find(
        (c) => c.name === consumable.name,
      );
      if (existing) {
        existing.quantity += consumable.quantity;
      } else {
        inventory.items.consumables.push(consumable);
      }
    }

    return this.inventoryRepository.save(inventory);
  }

  async removeItems(
    userId: string,
    items: {
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ): Promise<Inventory> {
    const inventory = await this.getInventory(userId);

    for (const equipment of items.equipments ?? []) {
      const existing = inventory.items.equipments.find(
        (e) => e.name === equipment.name,
      );
      if (!existing)
        throw new NotFoundException(
          `Equipment ${equipment.name} not found in inventory`,
        );
      existing.quantity -= equipment.quantity;
      if (existing.quantity <= 0) {
        inventory.items.equipments = inventory.items.equipments.filter(
          (e) => e.name !== equipment.name,
        );
      }
    }

    for (const consumable of items.consumables ?? []) {
      const existing = inventory.items.consumables.find(
        (c) => c.name === consumable.name,
      );
      if (!existing)
        throw new NotFoundException(
          `Consumable ${consumable.name} not found in inventory`,
        );
      existing.quantity -= consumable.quantity;
      if (existing.quantity <= 0) {
        inventory.items.consumables = inventory.items.consumables.filter(
          (c) => c.name !== consumable.name,
        );
      }
    }

    return this.inventoryRepository.save(inventory);
  }

  async transfer(
    fromUserId: string,
    toUserId: string,
    items: {
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ): Promise<void> {
    await this.removeItems(fromUserId, items);
    await this.addItems(toUserId, items);
  }
}
