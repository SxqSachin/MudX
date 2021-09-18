import { Action } from "./action";
import { XSerializable } from "./Object";
import { IUnit } from "./Unit";

export type ItemID = string;
export type ItemData = XSerializable & ({
  id: ItemID;
  name: string;

  durability: number;

  isEquipable: false;
  isConsumable: boolean;

  actions: Action | Action[];
} | {
  id: ItemID;
  name: string;

  durability: number;

  isEquipable: true;
  isEquipped: boolean;

  isConsumable: boolean;

  actions: Action | Action[];

  onEquip: Action | Action[];
  onUnequip: Action | Action[];
})

export type ItemSerializeData = Omit<ItemData, 'actions'>;

export interface IItem {
  data: Readonly<ItemData>;

  onUse(target: IUnit): void;

  onEquip(self: IUnit): void;
  onUnequip(self: IUnit): void;
}