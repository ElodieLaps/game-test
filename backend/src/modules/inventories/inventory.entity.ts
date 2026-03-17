import { type InventoryOwnerType, type InventoryItems } from '@shared';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('inventory')
export class Inventory {
  @PrimaryColumn()
  ownerId: string;

  @Column({ type: 'varchar' })
  ownerType: InventoryOwnerType;

  @Column('jsonb', { default: '{ "equipments": [], "consumables": [] }' })
  items: InventoryItems;
}
