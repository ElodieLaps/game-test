import { ConsumableName } from "../consumable/constants";
import { EquipmentName } from "../equipment";

export type InventoryOwnerType = "USER" | "TEAM";

export type InventoryEquipment = {
  name: EquipmentName;
  quantity: number;
};

export type InventoryConsumable = {
  name: ConsumableName;
  quantity: number;
};

export type InventoryItems = {
  equipments: InventoryEquipment[];
  consumables: InventoryConsumable[];
};
