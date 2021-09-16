import { Action } from "./action";
import { XSerializable } from "./Object";
import { IUnit } from "./Unit";

export type ItemID = string;
export type ItemData = Partial<XSerializable> & {
  id: ItemID;
  name: string;

  durability: number;

  actions: Action | Action[];
}

export type ItemSerializeData = Omit<ItemData, 'actions'>;

export interface IItem {
  data: Readonly<ItemData>;

  onUse(target: IUnit): void;
}