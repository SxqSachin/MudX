import { Action } from "./action";
import { XSerializable } from "./Object";
import { IUnit } from "./Unit";

export type ItemID = string;
export type ItemRunTimeData = XSerializable & {
  id: ItemID;

  durability: number;

  actions: Action | Action[];
}

export type ItemData = Omit<ItemRunTimeData, 'actions' | 'xid'>;

export interface IItem {
  onUse(target: IUnit): void;
}