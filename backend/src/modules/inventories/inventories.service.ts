import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InventoryConsumable,
  InventoryEquipment,
  InventoryOwnerType,
} from '@shared';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async getInventory(ownerId: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOneBy({ ownerId });
    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory;
  }

  async getOrCreateInventory(
    ownerId: string,
    ownerType: InventoryOwnerType,
  ): Promise<Inventory> {
    let inventory = await this.inventoryRepository.findOneBy({ ownerId });
    if (!inventory) {
      inventory = this.inventoryRepository.create({
        ownerId,
        ownerType,
        items: { equipments: [], consumables: [] },
      });
      await this.inventoryRepository.save(inventory);
    }
    return inventory;
  }

  async addItems(
    ownerId: string,
    ownerType: InventoryOwnerType,
    items: {
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ): Promise<Inventory> {
    const inventory = await this.getOrCreateInventory(ownerId, ownerType);

    if (ownerType === 'TEAM') {
      const currentItemCount =
        inventory.items.equipments.length + inventory.items.consumables.length;
      const newItemCount =
        (items.equipments ?? []).length + (items.consumables ?? []).length;

      if (currentItemCount + newItemCount > 5) {
        throw new BadRequestException('Team inventory cannot exceed 5 items');
      }
    }

    for (const equipment of items.equipments ?? []) {
      if (ownerType === 'TEAM') {
        inventory.items.equipments.push({ ...equipment, quantity: 1 });
      } else {
        const existing = inventory.items.equipments.find(
          (e) => e.name === equipment.name,
        );
        if (existing) {
          existing.quantity += equipment.quantity;
        } else {
          inventory.items.equipments.push(equipment);
        }
      }
    }

    for (const consumable of items.consumables ?? []) {
      if (ownerType === 'TEAM') {
        inventory.items.consumables.push({ ...consumable, quantity: 1 });
      } else {
        const existing = inventory.items.consumables.find(
          (c) => c.name === consumable.name,
        );
        if (existing) {
          existing.quantity += consumable.quantity;
        } else {
          inventory.items.consumables.push(consumable);
        }
      }
    }

    return await this.inventoryRepository.save(inventory);
  }

  async removeItems(
    ownerId: string,
    items: {
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ): Promise<Inventory> {
    const inventory = await this.getInventory(ownerId);

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

    return await this.inventoryRepository.save(inventory);
  }

  async transfer(
    fromId: string,
    toId: string,
    toOwnerType: InventoryOwnerType,
    items: {
      equipments?: InventoryEquipment[];
      consumables?: InventoryConsumable[];
    },
  ): Promise<void> {
    await this.removeItems(fromId, items);
    await this.addItems(toId, toOwnerType, items);
  }

  async deleteInventory(ownerId: string): Promise<void> {
    await this.inventoryRepository.delete({ ownerId });
  }
}
