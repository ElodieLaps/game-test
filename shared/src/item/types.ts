import { Consumable } from "../consumable";
import { Equipment } from "../equipment";

export type Item = {
  item: Equipment | Consumable;
  quantity: number;
};
